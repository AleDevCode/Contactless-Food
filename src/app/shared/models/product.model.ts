import { ImageObject } from './imageObject.model';
import { Amenidad } from './amenidad.model';
import { Topping } from './topping.model';

export interface Product {
    id?: string;
    nombre: string;
    foto: ImageObject;
    descripcion: string;
    precio: number;
    restaurant_id: string;
    categoria_id: string; 
    amenidades: Amenidad[];
    toppings: Topping[];
    fecha: Date; 
}