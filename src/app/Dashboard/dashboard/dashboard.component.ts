import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/AuthService.module';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public UserForm:FormGroup;
  constructor(private authservice:AuthService) { }
  userSub:Subscription;
  user:any;
  ngOnInit() {
    this.authservice.getUser();
    this.userSub = this.authservice.get_user.subscribe((user)=>{
      this.user = user;
      this.createForm();
    })


  }

  createForm(){
    this.UserForm = new FormGroup({
      'name': new FormControl(this.user.name,[Validators.required,Validators.minLength(3)]),
      'email': new FormControl(this.user.email,[Validators.required,Validators.email]),
      'password': new FormControl(null,Validators.required)


    })
  }

  onSubmit(){
    this.authservice.updateUserData({name:this.UserForm.value.name,email:this.UserForm.value.email,password:this.UserForm.value.password});
  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
