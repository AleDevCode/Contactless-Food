import { Component, OnInit, NgZone } from '@angular/core';
import { Amenidad } from 'src/app/shared/models/amenidad.model';
import { Topping } from 'src/app/shared/models/topping.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Categoria } from 'src/app/shared/models/categoria.model';
import { Product } from 'src/app/shared/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { ImageObject } from 'src/app/shared/models/imageObject.model';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { ImageObjectService } from 'src/app/shared/services/image-object.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
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
  cambioImagen = false;

  //Variable Producto

  producto: Product;
  idProducto: string;
  restaurant_id: string;

  constructor(
    private actRoute: ActivatedRoute, // Se utliza para obtener datos de la ruta actual)
    private productoService: ProductosService,
    private categoriasService: CategoriasService,
    private toastService: ToastsService,
    private imageObject: ImageObjectService,
    public ngZone: NgZone,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.restaurant_id = 'nKJ32s91z52WqDcpSzHW';
    this.idProducto = this.actRoute.snapshot.paramMap.get('id');
    this.setUpFormProductos();

    this.categoriasService
      .getCategorias(this.restaurant_id)
      .valueChanges()
      .subscribe((categorias: Categoria[]) => {
        this.categorias = categorias;
      });
    this.productoService
      .getProducto(this.idProducto)
      .valueChanges()
      .subscribe((p: Product) => {
        this.producto = p;

        this.formProducto.patchValue({
          nombre: this.producto.nombre,
          descripcion: this.producto.descripcion,
          categoria_id: this.producto.categoria_id,
          precio: this.producto.precio,
        });

        this.amenidades = this.producto.amenidades;
        this.toppings = this.producto.toppings;
        this.previewUrl = this.producto.foto.url;
      });
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
    this.cambioImagen = true; 
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

  removeItemFromAmenidades(array, item) {
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

  submitProducto() {
    if (this.cambioImagen) {
      this.subirFoto();
    } else {
      this.updateProducto(this.producto.foto.url); 
    }
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
        this.updateProducto(url);
      });
    });
  }

  updateProducto(url) {
    const img = {} as ImageObject;
    img.nombre = this.formProducto.value.nombre;
    img.url = url;
    const producto = {} as Product;
    producto.amenidades = this.amenidades;
    producto.toppings = this.toppings;
    producto.nombre = this.formProducto.value.nombre;
    producto.precio = this.formProducto.value.precio;
    producto.descripcion = this.formProducto.value.descripcion;
    producto.categoria_id = this.formProducto.value.categoria_id;
    producto.foto = img;
    producto.restaurant_id = this.restaurant_id;

    this.productoService.updateProducto(this.idProducto, producto).then(() => {
      this.toastService.toastUpdate();
      this.formProducto.reset();
      this.amenidades = [];
      this.toppings = [];

      this.ngZone.run(() => {
        this.router.navigate(['/productos']);
      });
    });
  }
}
