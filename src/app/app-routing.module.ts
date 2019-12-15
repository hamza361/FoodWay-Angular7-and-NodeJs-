import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HeaderComponent } from './Hom/header/header.component';

import { HomeComponent } from './Hom/home/home.component';
import { AddEditComponent } from './admin/add-edit/add-edit.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppComponent } from './app.component';
import { CartComponent } from './Cart_Order/cart/cart.component';
import { OrdersComponent } from './Cart_Order/orders/orders.component';
import { PhoneVerfPt1Component } from './auth/phone-verf-pt1/phone-verf-pt1.component';
import { PhoneVerfPt2Component } from './auth/phone-verf-pt2/phone-verf-pt2.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { ResetPasswordPt1Component } from './auth/reset-password-pt1/reset-password-pt1.component';
import { ResetPasswordPt2Component } from './auth/reset-password-pt2/reset-password-pt2.component';

const appRoutes:Routes = [
    {path:'',pathMatch:'full',component:HomeComponent},
    {path:'deals',loadChildren:'./Products/deals.module#DealsModule'},
    {path:'admin',loadChildren:'./admin/admin.module#AdminModule'},
    {path:'phone_verf_pt1',component:PhoneVerfPt1Component},
    {path:'phone_verf_pt2',component:PhoneVerfPt2Component},
    {path:'Signin',component:SigninComponent},
    {path:'Signup',component:SignupComponent},
    {path:'cart',component:CartComponent},
    {path:'orders',component:OrdersComponent},
    {path:'dashboard',canActivate:[AuthGuard],component:DashboardComponent},
    {path:'reset_form_pt1',component:ResetPasswordPt1Component},
    {path:'reset_form_pt2/:token',component:ResetPasswordPt2Component},
    {path:'**',redirectTo:''}
]
@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{

}