import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Categoria } from 'src/app/shared/models/categoria.model';
import { ImageObject } from 'src/app/shared/models/imageObject.model';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  //Variables Generales
  restaurant_id: string;
  isAdding = false;
  isEditing = false;

  // Variables para Categoría
  modalCategoria = false;
  categoriasImg: any[] = []; // Array de imagenes disponibles para Categorías
  formCategoria: FormGroup;
  categorias: Categoria[] = [];
  imgSeleccionada: ImageObject; // Variable necesaria para seleccionar una imagen en el form de categorías
  categoria_id = ''; //Variable necesaria para editar
  categoriaImgValid = false;

  //Variables para producto
  productos: Product[] = [];
  productosFilter: Product[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private alertsService: AlertsService,
    private toastService: ToastsService,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.restaurant_id = 'nKJ32s91z52WqDcpSzHW';
    this.setUpFormCategoria();

    //Obtener productos

    this.productosService
      .getProductos(this.restaurant_id)
      .valueChanges()
      .subscribe((prodcutos: Product[]) => {
        this.productos = prodcutos;
        this.productosFilter = prodcutos;
      });

    //Obtener imágenes para categorías
    this.categoriasService.getCategoriasImg().subscribe((res) => {
      res.forEach((e) => {
        this.categoriasImg.push(e);
      });
    });

    // Obtener categorías del restaurant
    this.categoriasService
      .getCategorias(this.restaurant_id)
      .valueChanges()
      .subscribe((categorias: Categoria[]) => {
        this.categorias = categorias;
      });
  }

  getProductosByCategoria(id) {
    this.productosFilter = this.productos.filter((p) => p.categoria_id == id);
  }

  verTodos() {
    this.productosFilter = this.productos;
  }

  // Form de Categoría
  setUpFormCategoria() {
    this.formCategoria = new FormGroup({
      nombre: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      categoriaImg: new FormControl(null, {
        validators: [],
      }),
    });
  }

  //CRUD DE CATEGORIA

  // Crear categoria
  onSubmitCategoria() {
    this.categoriasService
      .addCategoria(this.llenarCategoria())
      .then((res) => {
        this.toggleModalCategoria();
        this.toastService.toastSuccess();
        this.isAdding = false;
        this.verTodos();
      })
      .catch((e) => {});
  }

  onAdding() {
    this.toggleModalCategoria();
    this.agregar();
  }
  // Abre el modal y llena el formulario con los
  // de la categoría seleccionada
  onEdit(c) {
    this.toggleModalCategoria();
    this.editar();
    this.categoria_id = c.id;
    this.formCategoria.patchValue({
      nombre: c.nombre,
      categoriaImg: c.categoriaImg,
    });
    console.log(c.categoriaImg.nombre);
    setTimeout(() => {
      this.selectImg(c.categoriaImg.nombre);
    }, 500);
  }

  //Actualiza categoría
  onUpdateCategoria() {
    this.categoriasService
      .updateCategoria(this.categoria_id, this.llenarCategoria())
      .then(() => {
        this.toggleModalCategoria();
        this.toastService.toastUpdate();
        this.isEditing = false;
        this.verTodos();
      })
      .catch((e) => {});
  }

  // Elimina categoría
  deleteCategoria(id) {
    const mensaje =
      'Los productos que pertenecen a esta categoría también serán eliminados';
    this.alertsService.openAlertEliminacion(mensaje).then((result) => {
      if (result.value) {
        this.categoriasService.deleteCategoria(id).then(() => {
          this.toastService.toastDelete();
          this.verTodos();
        });
      }
    });
  }

  // Llena los datos de la categoría
  llenarCategoria() {
    const categoria: Categoria = {
      nombre: this.formCategoria.value.nombre,
      categoriaImg: this.imgSeleccionada,
      restaurant_id: 'nKJ32s91z52WqDcpSzHW',
      fecha: new Date(),
    };

    return categoria;
  }

  // MÉTODOS PARA  IMG PICKER
  selectedImg(img, event: any) {
    console.log(event.target);
    const selected = document.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }
    event.target.classList.add('selected');
    console.log(event.target.classList);
    this.formCategoria.value.categoriaImg = img;
    this.imgSeleccionada = img;
    console.log(this.formCategoria.valid);
    console.log(this.formCategoria.value.categoriaImg);
    this.categoriaImgValid = true;
  }

  selectImg(id: string) {
    const img = document.getElementById(id);
    console.log(img);
    img.classList.add('selected');
  }

  //ELIMINAR PRODUCTO

  deleteProducto(id, producto) {
    const mensaje = 'El producto será eliminado de forma permanente';
    this.alertsService.openAlertEliminacion(mensaje).then((result) => {
      if (result.value) {
        this.productosService.deleteProducto(id, producto).then(() => {
          this.toastService.toastDelete();
        });
      }
    });
  }

  //MÉTODOS AUXILIARES
  editar() {
    this.isEditing = !this.isEditing;
  }

  agregar() {
    this.isAdding = !this.isAdding;
  }

  toggleModalCategoria() {
    this.modalCategoria = !this.modalCategoria;
    this.formCategoria.reset();
  }

  cancelar() {
    this.toggleModalCategoria();
    this.isAdding = false;
    this.isEditing = false;
  }
}
