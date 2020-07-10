import { Component, OnInit, NgZone } from '@angular/core';
import { Amenidad } from 'src/app/shared/models/amenidad.model';
import { Topping } from 'src/app/shared/models/topping.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImageObjectService } from 'src/app/shared/services/image-object.service';
import { ImageObject } from 'src/app/shared/models/imageObject.model';
import { Product } from 'src/app/shared/models/product.model';
import { Categoria } from 'src/app/shared/models/categoria.model';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  //Variables del restaurant
  id: string;

  // Variables para input de foto
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  public porcentaje = 0;
  public finalizado = false;
  public URLPublica = '';

  //Variables para el form
  amenidades: Amenidad[] = [];
  toppings: Topping[] = [];
  addingAmenidad = false;
  addingTopping = false;
  nombreAmenidad: string = '';
  topping = {} as Topping;
  formProducto: FormGroup;
  categorias: Categoria[] = [];
  file = false;

  constructor(
    private imageObject: ImageObjectService,
    private categoriaService: CategoriasService,
    private productoService: ProductosService,
    private toastService: ToastsService,
    public ngZone: NgZone,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.id = 'nKJ32s91z52WqDcpSzHW';
    this.categoriaService
      .getCategorias(this.id)
      .valueChanges()
      .subscribe((categorias: Categoria[]) => {
        this.categorias = categorias;
      });

    this.setUpFormProductos();
  }

  addAmenidad() {
    let a = {} as Amenidad;
    a.nombre = this.nombreAmenidad;
    this.amenidades.push(a);
    this.addingAmenidad = false;
    this.nombreAmenidad = '';
  }

  addTopping() {
    let t = {} as Topping;
    t.nombre = this.topping.nombre;
    t.precio = this.topping.precio;
    this.toppings.push(t);
    this.addingTopping = false;
    this.topping.nombre = '';
    this.topping.precio = 0;
  }

  // Métodos para el input de la imagen
  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.preview();
    this.file = true;
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  removeItemFromArray(array, item) {
    var i = array.indexOf(item);
    console.log('Entre a remover');
    if (i !== -1) {
      array.splice(i, 1);
    }
  }

  setUpFormProductos() {
    this.formProducto = new FormGroup({
      nombre: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      descripcion: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      precio: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      categoria_id: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  subirFoto() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    const archivo = formData.get('file');
    this.fileUploadProgress = '0%';
    const referencia = this.imageObject.referenciaCloudStorage(
      'productos',
      this.fileData.name
    );
    const tarea = this.imageObject.tareaCloudStorage(
      'productos',
      this.fileData.name,
      archivo
    );

    // Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.fileUploadProgress =
        Math.round((porcentaje / porcentaje) * 100) + '%';
      if (this.porcentaje === 100) {
        this.finalizado = true;
      }
    });

    tarea.then((res) => {
      referencia.getDownloadURL().subscribe((url) => {
        this.crearProducto(url);
      });
    });
  }



  crearProducto(url) {
    const img: ImageObject = {
      nombre: this.formProducto.value.nombre,
      url: url,
    };

    const producto: Product = {
      amenidades: this.amenidades,
      toppings: this.toppings,
      nombre: this.formProducto.value.nombre,
      precio: this.formProducto.value.precio,
      descripcion: this.formProducto.value.descripcion,
      categoria_id: this.formProducto.value.categoria_id,
      foto: img,
      restaurant_id: this.id,
      fecha: new Date(),
    };

    this.productoService.addProducto(producto).then(() => {
      this.toastService.toastSuccess();
      this.formProducto.reset();
      this.amenidades = [];
      this.toppings = [];

      this.ngZone.run(() => {
        this.router.navigate(['/productos']);
      });
    });
  }

  submitProducto() {
    this.subirFoto();
  }
}
