import { Injectable } from '@angular/core';
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }


  openAlertEliminacion(mensaje) {
    return swal.fire({
      title: "¿Estás seguro? ",
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
  }
}
