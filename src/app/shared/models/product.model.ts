import { ImageObject } from './imageObject.model';

export interface Product {
    id: string;
    nombre: string;
    foto: ImageObject;
    descripcion: string;
    precio: number;
    restaurant_id: string;
    categoria_id: string; 
    // amenidades: Amenidad[];
    // toppings: Topping[];
}