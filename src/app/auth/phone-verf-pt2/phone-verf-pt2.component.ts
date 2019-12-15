import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/AuthService.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-phone-verf-pt2',
  templateUrl: './phone-verf-pt2.component.html',
  styleUrls: ['./phone-verf-pt2.component.css']
})
export class PhoneVerfPt2Component implements OnInit {

  constructor(private route:ActivatedRoute,private authService:AuthService) { }
  ContactForm:FormGroup;
  id:string;
  ngOnInit() {
    // this.route.paramMap.subscribe((paramMap:ParamMap)=>{
    //   if(paramMap.has('id')){
    //     this.id = paramMap.get('id');
    //   }
    // })
    this.createForm();
  }

  createForm(){
    this.ContactForm = new FormGroup({
      'code': new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
    })
  }

  onSubmit(){
    this.authService.phone_verf_part2({code:this.ContactForm.value.code})
  }


}
