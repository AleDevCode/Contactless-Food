import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './pages/restaurant/productos/productos.component';
import { AddProductComponent } from './pages/restaurant/add-product/add-product.component';
import { EditProductComponent } from './pages/restaurant/edit-product/edit-product.component';



const routes: Routes = [

  {path: "productos", component: ProductosComponent},
  {path: "add-product", component: AddProductComponent},
  {path: "productos/:id", component: EditProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
