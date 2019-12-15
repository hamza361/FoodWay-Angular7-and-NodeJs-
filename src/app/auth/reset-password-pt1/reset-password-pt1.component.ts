import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/service/AuthService.module';

@Component({
  selector: 'app-reset-password-pt1',
  templateUrl: './reset-password-pt1.component.html',
  styleUrls: ['./reset-password-pt1.component.css']
})
export class ResetPasswordPt1Component implements OnInit {

  constructor(private authService:AuthService) { }
  ResetForm:FormGroup;
  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.ResetForm = new FormGroup({
      'email': new FormControl(null,[Validators.required,Validators.email])
    })
  }

  onSubmit(){
    this.authService.resetPasswordPt1(this.ResetForm.value.email);
  }



}
