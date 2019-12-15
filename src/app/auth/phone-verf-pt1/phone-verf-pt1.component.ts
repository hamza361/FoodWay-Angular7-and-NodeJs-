import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/AuthService.module';
import { Router } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
@Component({
  selector: 'app-phone-verf-pt1',
  templateUrl: './phone-verf-pt1.component.html',
  styleUrls: ['./phone-verf-pt1.component.css']
})
export class PhoneVerfPt1Component implements OnInit {

  constructor(private authService:AuthService,private router:Router,private cookieService:CookieService) { }
  ContactForm:FormGroup;
  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.ContactForm = new FormGroup({
      'contact': new FormControl(null,[Validators.required,Validators.minLength(11),Validators.maxLength(11)])
    })
  }

  onSubmit(){
    console.log(this.ContactForm.value.contact);
    const contact_num = this.ContactForm.value.contact.replace('0','+92');
    localStorage.setItem('timer',new Date().getMilliseconds.toString());
    setTimeout(()=>{
      if(this.cookieService.get('timer')){
        alert('Kindly Resend If code has not arrived.');
        this.cookieService.delete('timer');
        this.router.navigate(['phone_verf_pt1']);
      }
     
    },60000);
    this.authService.phone_verf_part1(contact_num);
  }

}
