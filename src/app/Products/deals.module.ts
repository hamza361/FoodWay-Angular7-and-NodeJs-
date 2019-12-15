import {NgModule} from "@angular/core";
import { ExclusiveDiscountedDealsComponent } from './exclusive-discounted-deals/exclusive-discounted-deals.component';
import { PizzaComponent } from './pizza/pizza.component';
import { SnacksComponent } from './snacks/snacks.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DealsRoutingModule } from './deals-routing.module';

@NgModule({
    declarations:[
        ExclusiveDiscountedDealsComponent,
        PizzaComponent,
        SnacksComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        DealsRoutingModule
    ]
})

export class DealsModule{

}