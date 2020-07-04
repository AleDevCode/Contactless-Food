import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(
    // Referencia a Firestore
    private afs: AngularFirestore
  ) {}

  getProductos(restaurant_id) {
    return this.afs.collection('productos', (ref) =>
      ref.where('restaurant_id', '==', restaurant_id)
    );
  }

  getProducto(id) {
    return this.afs.collection('productos').doc(id); 
  }

  // Agregar un producto
  addProducto(producto: Product) {
    producto.id = this.afs.createId();
    return this.afs.collection('productos').doc(`${producto.id}`).set(producto);
  }

  updateProducto(id, producto: Product) {
    return this.afs.collection('productos').doc(id).update(producto);
  }

  deleteProducto(id, producto: Product) {


    return this.afs.collection('productos').doc(id).delete();
  }
}
