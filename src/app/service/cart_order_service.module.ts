import { Injectable } from '@angular/core';
import { AuthService } from './AuthService.module';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class Cart_Order_Service{

    private token;
    url:string = environment.apiUrl+'cart_orders/';
    cart = new Subject();
    userOrders = new Subject();
    userSingleOrder = new Subject();
    adminOrders = new Subject();
    adminOrderpush = new Subject();
    adminOrdersArray=[];
    userOrdersArray = [];
    constructor(private authService:AuthService,private router:Router){}
// To inform user order is accepted by Web SocketIO
userOrderAccepted(orderId:string){
    const index_of_User_Orders_Array = this.userOrdersArray.findIndex((p)=>{
        return p._id.toString() === orderId.toString();
    });
    this.userOrdersArray[index_of_User_Orders_Array].status='Accepted will be delivered in 50 minutes.';
    this.userOrders.next(this.userOrdersArray.slice());
    
}
// To inform user order delivery is started by Web SocketIO
userOrderDeliveryStarted(orderId:string){
    const index_of_User_Orders_Array = this.userOrdersArray.findIndex((p)=>{
        return p._id.toString() === orderId.toString();
    });
    this.userOrdersArray[index_of_User_Orders_Array].delivery='Started.';
    this.userOrders.next(this.userOrdersArray.slice());

}
// To inform user order is deliverd by Web SocketIO
userOrderDelivered(orderId:string){
    console.log(orderId);
    const index_of_User_Orders_Array = this.userOrdersArray.findIndex((p)=>{
        return p._id.toString() === orderId.toString();
    });
    this.userOrdersArray[index_of_User_Orders_Array].delivery='Delivered.';
    this.userOrders.next(this.userOrdersArray.slice());
}
//when order accepted by admin call this function in admin-order-component.ts
orderAccepted(orderId:string){
    this.token = this.authService.getToken();
    fetch(this.url+'order_accepted',{
        method:'PATCH',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
        body:JSON.stringify({
            orderId:orderId
        })

    }).then((res)=>{
        if(res.status!==200){
            return res.json().then((resData)=>{
                throw new Error(resData.message);
            })
        }
        return res.json();
    }).then((resData)=>{
        alert(resData.message);
        const index_of_Admin_Orders_Array = this.adminOrdersArray.findIndex((p)=>{
           return p._id.toString() === resData.orderId;
        });
   
        this.adminOrdersArray[index_of_Admin_Orders_Array].status='Accepted';

        this.adminOrders.next(this.adminOrdersArray.slice());



    }).catch((error)=>{
        alert(error.message);
    })
}
//when new order by user update adminarray by webSocket IO:
    newOrder(newOrder){

        this.adminOrdersArray.push(newOrder);
       
          var short = this.adminOrdersArray.filter((p)=>{
           return p._id.toString() == newOrder._id.toString()
       })
       this.adminOrdersArray = this.adminOrdersArray.filter((p)=>{
           return p._id.toString() != newOrder._id.toString();
       })
       console.log(short[0]);
       this.adminOrdersArray.push(short[0]);
      
       console.log(this.adminOrdersArray);
       this.adminOrders.next(this.adminOrdersArray.slice());
    

}
    getCart(){
        this.token = this.authService.getToken();
        fetch(this.url+'getCart',{
            method:'GET',
            headers:{Authorization:'Bearer '+this.token},
        }).then((res)=>{
            if(res.status!==200){
               return res.json().then((resData)=>{
                    throw Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            this.cart.next(resData);
        }).catch((error)=>{
            alert(error.message);
            this.authService.Logout();
        })
    }
    addToCart(id:string,category:string){
        this.token = this.authService.getToken();

        fetch(this.url+'add_to_cart',{
            method:"POST",
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                _id:id,
                category:category
            })
        }).then((res)=>{
            if(res.status!==201){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })  
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            this.router.navigate(['cart']);
            this.cart.next({items:resData.items,TotalPrice:resData.TotalPrice});
        }).catch((error)=>{
            alert(error.message);
        })
    }

    deleteFromCart(productId:string){
        this.token = this.authService.getToken();
        fetch(this.url+'deleteFromCart',{
            method:'POST',
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                productId:productId
            })
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw Error(resData.message);
                })
            }
            return res.json();
            
        }).then((resData)=>{
            this.cart.next(resData);
        }).catch((error)=>{
            alert(error);
            this.router.navigate(['cart']);
        })
    }

    orderNow(){
        const latitude = localStorage.getItem('latitude');
        const longitude = localStorage.getItem('longitude');
        this.token = this.authService.getToken();
        fetch(this.url+'order',{
            method:'POST',
            headers:{ 'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                latitude:latitude,
                longitude:longitude
            })
          
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            this.userOrdersArray.push(resData.order);
            this.userOrders.next(this.userOrdersArray.slice());
            this.removeCoOrdinates();
            this.router.navigate(['orders']);
        }).catch((error)=>{
            alert(error.message);
        }) 
    }

    getUserOrders(){
        this.token = this.authService.getToken();
        fetch(this.url+'user_orders',{
            method:'GET',
            headers:{Authorization:'Bearer '+this.token}
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            this.userOrdersArray = resData.orders;
            this.userOrders.next(this.userOrdersArray.slice());
        }).catch((error)=>{
            alert(error.message);
            this.authService.Logout();
        })
    }

    getAdminOrders(){
        this.token = this.authService.getToken();
        fetch(this.url+'admin_orders',{
            method:'GET',
            headers:{Authorization:'Bearer '+this.token}
        }).then((res)=>{
       
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            this.adminOrdersArray = resData.orders;
            this.adminOrdersArray = this.adminOrdersArray.map((p)=>{
               
                if(p.status.includes('minutes')){
                    p.status = 'Accepted';
                }
                return {_id:p._id,userId:{cart:p.userId.cart,contact:p.userId.contact,name:p.userId.name},status:p.status,address:p.address,TotalPrice:p.TotalPrice,orders:p.orders,delivery:p.delivery};
            });
            this.adminOrders.next(this.adminOrdersArray.slice());
        }).catch((error)=>{
            alert(error.message);
            this.authService.Logout();
        })
    }

   //when ordered is deliverd  admin call this function in admin-order-component.ts
    orderDelivered(orderId:string){
        this.token = this.authService.getToken();
        fetch(this.url+'order_delivered',{
            method:'PATCH',
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                orderId:orderId
            })
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            const index_of_Admin_Orders_Array = this.adminOrdersArray.findIndex((p)=>{
               return p._id.toString() === resData.orderId;
            });
           
            this.adminOrdersArray[index_of_Admin_Orders_Array].delivery='Delivered.';
            this.adminOrders.next(this.adminOrdersArray.slice());
    
    
    
        }).catch((error)=>{
            alert(error.message);
        })
    }
//when order delivery started  admin call this function in admin-order-component.ts
    deliveryStarted(orderId:string){
        this.token = this.authService.getToken();
        fetch(this.url+'delivery_started',{
            method:'PATCH',
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                orderId:orderId
            })
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            const index_of_Admin_Orders_Array = this.adminOrdersArray.findIndex((p)=>{
               return p._id.toString() === resData.orderId;
            });
            console.log(this.adminOrdersArray[index_of_Admin_Orders_Array]);
            this.adminOrdersArray[index_of_Admin_Orders_Array].delivery='Started.';
            this.adminOrders.next(this.adminOrdersArray.slice());
    
    
    
        }).catch((error)=>{
            alert(error.message);
        })
    }


   removeCoOrdinates(){
       localStorage.removeItem('latitude');
       localStorage.removeItem('longitude');
   }
}