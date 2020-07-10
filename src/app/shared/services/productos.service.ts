import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  COLLECTION = 'productos';

  constructor(
    // Referencia a Firestore
    private afs: AngularFirestore
  ) {}

  getProductos(restaurant_id) {
    return this.afs.collection(this.COLLECTION, (ref) =>
      ref.where('restaurant_id', '==', restaurant_id).orderBy('fecha', 'desc')
    );
  }

  getProducto(id) {
    return this.afs.collection(this.COLLECTION).doc(id);
  }

  // Agregar un producto
  addProducto(producto: Product) {
    producto.id = this.afs.createId();
    return this.afs
      .collection(this.COLLECTION)
      .doc(`${producto.id}`)
      .set(producto);
  }

  updateProducto(id, producto: Product) {
    return this.afs.collection(this.COLLECTION).doc(id).update(producto);
  }

  deleteProducto(id, producto: Product) {
    return this.afs.collection(this.COLLECTION).doc(id).delete();
  }
}
