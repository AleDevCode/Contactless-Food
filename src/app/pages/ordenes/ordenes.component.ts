import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/shared/services/ordenes.service';
import { Order } from 'src/app/shared/models/order.model';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss'],
})
export class OrdenesComponent implements OnInit {
  ordenes: Order[] = [];
  nuevas = true;
  preparando = false;
  entregando = false;

  restaurant_id = 'nKJ32s91z52WqDcpSzHW';

  ordenesNuevas: Order[] = [];
  ordenesPreparando: Order[] = [];
  ordenesEntregando: Order[] = [];

  orden: Order = {} as Order;

  constructor(private ordenesService: OrdenesService) {}

  ngOnInit(): void {
    const nueva = document.querySelector('#nueva');
    nueva.classList.add('active');

    this.ordenesService
      .getOrdenes(this.restaurant_id)
      .subscribe((ordenes: any[]) => {
        this.ordenes = ordenes;

        console.log(this.ordenes);

        this.nuevasOrdenes();
      });
  }

  tab(event: any) {
    console.log(event.target);
    const selected = document.querySelector('.active');
    if (selected) {
      selected.classList.remove('active');
    }
    event.target.classList.add('active');
    console.log(event.target.id);
    switch (event.target.id) {
      case 'nueva':
        this.nuevasOrdenes();
        break;

      case 'preparando':
        this.preparandoOrdenes();
        break;

      case 'entregando':
        this.entregandoOrdenes();
        break;

      default:
        break;
    }
  }

  nuevasOrdenes() {
    this.nuevas = true;
    this.preparando = false;
    this.entregando = false;

    this.ordenesNuevas = this.ordenes.filter((o) => !o.is_aceptada);
    console.log(this.ordenesNuevas);
  }

  preparandoOrdenes() {
    this.nuevas = false;
    this.preparando = true;
    this.entregando = false;

    this.ordenesPreparando = this.ordenes.filter((o) => o.is_en_preparacion);
  }

  entregandoOrdenes() {
    this.nuevas = false;
    this.preparando = false;
    this.entregando = true;
    this.ordenesEntregando = this.ordenes.filter((o) => o.is_lista);
    console.log(this.ordenesEntregando);
  }

  selectCard(orden, event: any) {
    this.orden = orden;
    const selected = document.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }
    event.target.classList.add('selected');
  }

  preparar(o: Order) {
    this.ordenesService.preparar(o.id).then(() => {
      this.ordenesNuevas = this.ordenes.filter((o) => !o.is_aceptada);
      this.ordenesEntregando = this.ordenes.filter((o) => o.is_lista);
      this.ordenesService.getOrdenById(o.id).subscribe((o: Order) => {
        o.id = o.id; 
        this.orden = o;
      });
      const selected = document.querySelector('#nueva');
      if (selected) {
        selected.classList.remove('active');
      }
      document.querySelector('#preparando').classList.add('active');
      this.preparandoOrdenes();
    });
  }

  entregar(o: Order) {
    this.ordenesService.entregar(o.id).then(() => {
      this.ordenesNuevas = this.ordenes.filter((o) => !o.is_aceptada);
      this.ordenesPreparando = this.ordenes.filter((o) => o.is_lista);
      this.ordenesService.getOrdenById(o.id).subscribe((o: Order) => {
        o.id = o.id; 
        this.orden = o;
      });
      const selected = document.querySelector('#preparando');
      if (selected) {
        selected.classList.remove('active');
      }
      document.querySelector('#entregando').classList.add('active');
      this.entregandoOrdenes();
    });
  }
}
