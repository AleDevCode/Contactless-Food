import { Component, OnInit, NgZone } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { Categoria } from 'src/app/shared/models/categoria.model';
import { Location } from "@angular/common";

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.scss'],
})
export class DetailsProductComponent implements OnInit {
  //Variable Producto
  producto: Product = {} as Product;
  idProducto: string;
  restaurant_id: string;
  categoria = {} as Categoria;
  constructor(
    private actRoute: ActivatedRoute, // Se utliza para obtener datos de la ruta actual)
    private productoService: ProductosService,
    private categoriasService: CategoriasService,
    public ngZone: NgZone,
    public router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.restaurant_id = 'nKJ32s91z52WqDcpSzHW';
    this.idProducto = this.actRoute.snapshot.paramMap.get('id');

    this.productoService
      .getProducto(this.idProducto)
      .valueChanges()
      .subscribe((p: Product) => {
        this.producto = p;

        this.categoriasService
          .getCategoria(p.categoria_id)
          .subscribe((c: Categoria) => {
            this.categoria = c;
          });
      });
  }

  backClicked() {
    this._location.back();
  }
}
