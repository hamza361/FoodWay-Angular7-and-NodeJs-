import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cart_Order_Service } from '../../service/cart_order_service.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy {

  constructor(private cart_order_service:Cart_Order_Service) { }
  items:[]=[];
  NoProduct:boolean = false;
  TotalPrice:number=0;
  private cart_order_Sub:Subscription;
  ngOnInit() {
    this.cart_order_service.getCart();
    this.cart_order_Sub = this.cart_order_service.cart.subscribe((data:{items:[],TotalPrice:number})=>{
      if(data.items.length===0){
        this.NoProduct = true;
      }
      this.items = data.items;
      // for(var i = 0 ; i<this.items.length;i++){
      //   console.log(this.items[i]);
      // }
      this.TotalPrice = data.TotalPrice;
    })
  }

  onDelete(productId:string){
    this.cart_order_service.deleteFromCart(productId);
  }

  orderNow(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      localStorage.setItem('latitude',latitude.toString());
      localStorage.setItem('longitude',longitude.toString());
      this.cart_order_service.orderNow();
      });
    } else {
          alert('Geo location not Supported by the browser');
   }
    
  }

  ngOnDestroy(){
    this.cart_order_Sub.unsubscribe();
  }

}
