import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  COLLECTION = 'ordenes';

  constructor( // Referencia a Firestore
    private afs: AngularFirestore) { }


    getOrdenes(restaurant_id) {
      return this.afs.collection(this.COLLECTION, ref => ref.where('id_restaurant', '==', restaurant_id).orderBy('fecha', 'desc')).valueChanges({ idField: 'id' }); 
    }

    getOrdenById(id) {
      return this.afs.collection(this.COLLECTION).doc(id).valueChanges(); 
    }

    preparar(id) {
      return this.afs.collection(this.COLLECTION).doc(id).update({
        is_en_preparacion: true,
        is_aceptada: true
      });
    }

    entregar(id) {
      return this.afs.collection(this.COLLECTION).doc(id).update({
        is_en_preparacion: false,
        is_aceptada: true,
        is_lista: true
      });
    }
}
