import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cart_Order_Service } from '../../service/cart_order_service.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit,OnDestroy {

  constructor(private cart_order_service:Cart_Order_Service) { }
  orders:[]=[];
  NoProduct:boolean=false;
  private ordersSub:Subscription;
  // TotalPrice:number=0;
  // show:boolean;
  ngOnInit() {

    this.cart_order_service.getUserOrders();
    this.ordersSub = this.cart_order_service.userOrders.subscribe((orders:[])=>{
      if(orders.length==0){
        this.NoProduct = true;
      }
      this.orders = orders;
        
    })
 
  }
 

  ngOnDestroy(){
    this.ordersSub.unsubscribe();
  }

}
