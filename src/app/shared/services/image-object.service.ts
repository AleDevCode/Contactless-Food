import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class ImageObjectService {

  constructor(private storage: AngularFireStorage) { }



    // Tarea para subir archivo
    public tareaCloudStorage(coleccion,nombreArchivo: string, datos: any, ) {
      return this.storage.upload(`${coleccion}/${nombreArchivo}`, datos);
    }
  
    // Referencia del archivo
    public referenciaCloudStorage(coleccion, nombreArchivo: string) {
      return this.storage.ref(`${coleccion}/${nombreArchivo}`);
    }
}

