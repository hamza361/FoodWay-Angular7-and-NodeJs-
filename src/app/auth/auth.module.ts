import { NgModule } from "@angular/core";
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { PhoneVerfPt1Component } from './phone-verf-pt1/phone-verf-pt1.component';
import { PhoneVerfPt2Component } from './phone-verf-pt2/phone-verf-pt2.component';
import { ResetPasswordPt1Component } from './reset-password-pt1/reset-password-pt1.component';
import { ResetPasswordPt2Component } from './reset-password-pt2/reset-password-pt2.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations:[
        SigninComponent,
        SignupComponent,
        PhoneVerfPt1Component,
        PhoneVerfPt2Component,
        ResetPasswordPt1Component,
        ResetPasswordPt2Component
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ]
})

export class AuthModule{

}