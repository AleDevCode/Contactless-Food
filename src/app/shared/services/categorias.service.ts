import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Categoria } from '../models/categoria.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  COLLECTION = 'categorias';

  constructor(
    // Referencia a Firestore
    private afs: AngularFirestore) {}



  // Obtiene la colección de imagenes de categorías preestablecidas
  getCategoriasImg() {
    return this.afs.collection('categoriasImg').valueChanges();
  }


  // Agregar una categoría 
  addCategoria(categoria: Categoria) {
    categoria.id = this.afs.createId();
    return this.afs
      .collection(this.COLLECTION)
      .doc(`${categoria.id}`)
      .set(categoria);
  }

  updateCategoria(id, categoria) {
    categoria.id = id; 
    return this.afs.collection(this.COLLECTION).doc(id).set(categoria);
  }


  getCategoria(id) {
      return this.afs.collection(this.COLLECTION).doc(id).valueChanges();
   }

  getCategorias(restaurant_id) {
    return this.afs.collection(this.COLLECTION, ref => ref.where('restaurant_id', '==', restaurant_id).orderBy('fecha', 'desc')); 
  }

  deleteCategoria(id) {
    this.afs.collection('productos', ref => ref.where('categoria_id', '==', id)).valueChanges().subscribe( productos => {
      productos.forEach((prod: Product) => {
        this.afs.collection('productos').doc(prod.id).delete();
      })
    })

    return this.afs.collection(this.COLLECTION).doc(id).delete();
  }
  
}
