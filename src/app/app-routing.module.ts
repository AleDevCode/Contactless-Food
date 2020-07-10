import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './pages/restaurant/productos/productos.component';
import { AddProductComponent } from './pages/restaurant/add-product/add-product.component';
import { EditProductComponent } from './pages/restaurant/edit-product/edit-product.component';
import { DetailsProductComponent } from './pages/restaurant/details-product/details-product.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'details/:id',
    component: DetailsProductComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: ProductosComponent },
  { path: 'ordenes', component: OrdenesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
