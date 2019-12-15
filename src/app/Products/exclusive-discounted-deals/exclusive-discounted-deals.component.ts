import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Service } from '../../service/service.module';
import { Product } from '../../model/Product.model';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService.module';
import { Subscription } from 'rxjs';
import { Cart_Order_Service } from '../../service/cart_order_service.module';

@Component({
  selector: 'app-exclusive-discounted-deals',
  templateUrl: './exclusive-discounted-deals.component.html',
  styleUrls: ['./exclusive-discounted-deals.component.css']
})
export class ExclusiveDiscountedDealsComponent implements OnInit,OnDestroy {

  products :Product []  = [];
  NoProduct:boolean = false;
  private adminIsAuthenticated = false;
  private adminStatusSub:Subscription;
  private productsSub:Subscription;
  constructor(private service:Service,private router:Router,private authService:AuthService,private cart_order_service:Cart_Order_Service) { 
    
  }

  ngOnInit() {
      
     this.service.getProducts('exclusive-discounted-deals');
    this.productsSub = this.service.poroducts_update.subscribe((data:Product[])=>{
       if(data.length===0){
         this.NoProduct = true;
        
       }
         this.products = data;
       
       
     })
     this.adminIsAuthenticated = this.authService.getAdminIsAuthenticated();
    this.adminStatusSub =  this.authService.getAdminStatusListener().subscribe((adminIsAuthenticated:boolean)=>{
          this.adminIsAuthenticated  = adminIsAuthenticated;
     })
    
  }

  
  onDelete(_id){

    this.service.DeleteProduct({_id:_id.toString(),category:'exclusive-discounted-deals'});
   }

   onEdit(_id){
    this.router.navigate(['./admin/edit_product','exclusive-discounted-deals',_id,]);
  }

  addToCart(id:string){
    this.cart_order_service.addToCart(id,'exclusive-discounted-deals')
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
  }
}
