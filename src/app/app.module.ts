import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { Service } from './service/service.module';
import { AuthService } from './service/AuthService.module';
import { AuthGuard } from './auth/auth.guard';
import { Cart_Order_Service } from './service/cart_order_service.module';

import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { AuthModule } from './auth/auth.module';
import { CartOrderModule } from './Cart_Order/cart_order.module';
import { HomeModule } from './Hom/home.module';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HomeModule,
    AuthModule,
    CartOrderModule,
    AppRoutingModule
  ],
  providers: [Service,AuthService,AuthGuard,Cart_Order_Service,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
