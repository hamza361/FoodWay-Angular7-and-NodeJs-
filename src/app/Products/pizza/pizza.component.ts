import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../model/Product.model';
import { Service } from '../../service/service.module';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/AuthService.module';
import { Cart_Order_Service } from '../../service/cart_order_service.module';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit,OnDestroy {
  products: Product[] = [];
  NoProduct:boolean = false;
  connection = '';
  private adminIsAuthenticated  = false;
  private adminStatusSub:Subscription;
  private productsSub:Subscription;
 
  constructor(private service: Service,private router:Router,private authService:AuthService,private cart_order_service:Cart_Order_Service) { }

  ngOnInit() {
  
   
      this.service.getProducts('pizza');
     this.productsSub =  this.service.poroducts_update.subscribe((data:Product[])=>{
        if(data.length===0){
          this.NoProduct = true;
          this.products = data;
        }else{
          this.products = data;
        }
      })
      this.adminIsAuthenticated = this.authService.getAdminIsAuthenticated();
      this.adminStatusSub =  this.authService.getAdminStatusListener().subscribe((adminIsAuthenticated:boolean)=>{
            this.adminIsAuthenticated  = adminIsAuthenticated;
       })
  
  }

  onDelete(_id){

    this.service.DeleteProduct({_id:_id.toString(),category:'pizza'});
   }

   onEdit(_id){
    this.router.navigate(['./admin/edit_product','pizza',_id,]);
  }
  addToCart(id:string){
    this.cart_order_service.addToCart(id,'pizza');
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
  }

}
