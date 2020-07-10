import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//FIREBASE 
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";

import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';


//Componentes
import { ProductosComponent } from './pages/restaurant/productos/productos.component';
import { AddProductComponent } from './pages/restaurant/add-product/add-product.component';
import { EditProductComponent } from './pages/restaurant/edit-product/edit-product.component';
import { DetailsProductComponent } from './pages/restaurant/details-product/details-product.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

//Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './shared/services/auth.service';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductosComponent,
    AddProductComponent,
    EditProductComponent,
    DetailsProductComponent,
    OrdenesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireAuthModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
