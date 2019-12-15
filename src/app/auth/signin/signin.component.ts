import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/AuthService.module';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService:AuthService) { }
  SignInForm:FormGroup;
  contact:string = null;
  ngOnInit() {
    this.authService.prevent_reset.subscribe((data:string)=>{
      this.contact = data;
    });
    this.createForm();
  }

  createForm(){
    this.SignInForm = new FormGroup({
      'contact':new FormControl(this.contact,[Validators.required,Validators.minLength(11),Validators.maxLength(11)]),
      'password': new FormControl(null,[Validators.required])
    })
  }
  onSubmit(){
    const contact = this.SignInForm.value.contact;
    const password = this.SignInForm.value.password;
    this.authService.SignIn({contact:contact,password:password});
  }

}
