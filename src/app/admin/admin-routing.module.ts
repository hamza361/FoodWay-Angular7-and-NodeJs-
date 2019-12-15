import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';


const AdminRoutes:Routes = [
    {path:'add_product',canActivate:[AuthGuard],component:AddEditComponent},
    {path:'edit_product/:category/:_id',component:AddEditComponent},
    {path:'admin_orders',component:AdminOrdersComponent}
]

@NgModule({
    imports:[RouterModule.forChild(AdminRoutes)],
    exports:[RouterModule]
})

export class AdminRoutingModule{

}