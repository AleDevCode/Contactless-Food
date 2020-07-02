import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor( private toast: ToastrService) { }


  toastSuccess() {
   return  this.toast.success("Registro con éxito", "Mensaje", {
      positionClass: "toast-bottom-center",
      timeOut: 3000,
    });
  }

  toastDelete() {
    return  this.toast.success("Registro eliminado con éxito", "Mensaje", {
      positionClass: "toast-bottom-center",
      timeOut: 3000,
    });
  }

  toastUpdate() {
    return  this.toast.success("Registro actualizado con éxito", "Mensaje", {
      positionClass: "toast-bottom-center",
      timeOut: 3000,
    });
  }

}
