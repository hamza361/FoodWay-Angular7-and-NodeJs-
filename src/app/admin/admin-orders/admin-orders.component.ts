import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart_Order_Service } from '../../service/cart_order_service.module';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit,OnDestroy {

  constructor(private cart_order_service:Cart_Order_Service) { }
  orders:[]=[];
  NoProduct:boolean=false;
  private ordersSub:Subscription;
 
  ngOnInit() {
    
    this.cart_order_service.getAdminOrders();
    this.ordersSub = this.cart_order_service.adminOrders.subscribe((orders:[])=>{
    
        this.orders = orders;
        
        if(this.orders.length==0){
          console.log(this.orders.length);
              this.NoProduct = true;
             
        } 
    })
 
  }

acceptedOrder(orderId:string){
    this.cart_order_service.orderAccepted(orderId);
}
deliveryStart(orderId:string){
  this.cart_order_service.deliveryStarted(orderId);
}

delivered(orderId){
  this.cart_order_service.orderDelivered(orderId);
}
  ngOnDestroy(){
    this.ordersSub.unsubscribe();
  }

}
