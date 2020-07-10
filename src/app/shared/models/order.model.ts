import { Product } from './product.model';
import { ProductOrderCount } from './productOrderCount.model';

export interface Order {
    id?: string;
    user_id: string;
    productos: ProductOrderCount[];
    costo_total: number;
    costo_subtotal: number;
    nombre_cliente: string;
    notifications_token?: string;
    direccion_cliente?: string;
    referencias?: string;
    mesa?: string;
    id_restaurant: string;
    is_aceptada: boolean;
    is_en_preparacion: boolean;
    is_lista: boolean;
    fecha: Date;
}