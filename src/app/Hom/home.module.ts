import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({

    declarations:[
        HomeComponent,
        HeaderComponent
    ],
    imports:[
        CommonModule,
        RouterModule
    ],
    exports:[
        HomeComponent,
        HeaderComponent
    ]
})
export class HomeModule{

}