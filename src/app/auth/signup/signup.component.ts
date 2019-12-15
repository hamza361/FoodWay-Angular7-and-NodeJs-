import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/AuthService.module';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router) { }
  SignUpForm:FormGroup;
  password:string;
  contact:string;
  ngOnInit() {
   this.contact =  this.authService.getContact();
   if(this.contact){
      return this.createForm();
   }
    this.router.navigate(['phone_verf_pt1']);
  }

  createForm(){
    this.SignUpForm = new FormGroup({
      'name': new FormControl(null,[Validators.required,Validators.minLength(3)]),
      'email':new FormControl(null,[Validators.required,Validators.email]),
      'password': new FormControl(null,[Validators.required]),
      'confirm_password': new FormControl(null,[Validators.required,this.check.bind(this)])
    })
  }

  check(control:FormControl):{[s:string]:boolean}{
   
    if(this.password){
        if(this.SignUpForm.value.password === control.value){
            return null; 
        }else{
            return {'Not Matched':true}
        }
    }else{
      return {'Not Matched':true}
    }
  }

  onSubmit(){
    const name = this.SignUpForm.value.name;
    const email = this.SignUpForm.value.email;
    const password = this.SignUpForm.value.password;
    this.authService.SignUp({name:name,email:email,password:password,contact:this.contact});

  }
  

}
