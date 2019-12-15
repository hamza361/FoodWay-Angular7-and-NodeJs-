import { NgModule } from "@angular/core";
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations:[
    CartComponent,
    OrdersComponent
    ],
    imports:[
        CommonModule,
        BrowserAnimationsModule,
        PDFExportModule,
    ]
})

export class CartOrderModule{

}