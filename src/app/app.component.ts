import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './service/AuthService.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  constructor(private authService:AuthService){
    
  }

  
  ngOnInit(){
    console.log('IN APP');

      this.authService.autoAuthUser();
   
 

  
  }



 
  
}

