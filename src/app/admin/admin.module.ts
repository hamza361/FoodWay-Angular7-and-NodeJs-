import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    declarations:[
        AddEditComponent,
        AdminOrdersComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule
    ]
})

export class AdminModule{

}