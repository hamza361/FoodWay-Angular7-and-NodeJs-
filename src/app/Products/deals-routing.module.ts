import {NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ExclusiveDiscountedDealsComponent } from './exclusive-discounted-deals/exclusive-discounted-deals.component';
import { PizzaComponent } from './pizza/pizza.component';
import { SnacksComponent } from './snacks/snacks.component';


const DealsRoutes:Routes = [
    {path:'exclusive-discounted-deals',component:ExclusiveDiscountedDealsComponent},
    {path:'pizza',component:PizzaComponent},
    {path:'snacks',component:SnacksComponent},
]
@NgModule({
    imports:[
        RouterModule.forChild(DealsRoutes)
    ],
    exports:[RouterModule]
})

export class DealsRoutingModule{

}