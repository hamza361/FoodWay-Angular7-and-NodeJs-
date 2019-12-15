import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/AuthService.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-reset-password-pt2',
  templateUrl: './reset-password-pt2.component.html',
  styleUrls: ['./reset-password-pt2.component.css']
})
export class ResetPasswordPt2Component implements OnInit {

  constructor(private authService:AuthService,private route:ActivatedRoute) { }
  ResetForm:FormGroup;
  token:string;
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('token')){
        this.token = paramMap.get('token');
        console.log(this.token);
        this.createForm();
      }
    
  })
}

  createForm(){
    this.ResetForm = new FormGroup({
      'password': new FormControl(null,Validators.required)
    })
  }

  
  onSubmit(){
    this.authService.resetPasswordPt2({token:this.token,passowrd:this.ResetForm.value.password});
  }
  

}
