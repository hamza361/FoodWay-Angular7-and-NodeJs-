import { OnInit, Injectable } from '@angular/core';
import { Product } from '../model/Product.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as openSocket from 'socket.io-client';
import { AuthService } from './AuthService.module';
import { Cart_Order_Service } from './cart_order_service.module';
import {environment} from '../../environments/environment';
@Injectable()
export class Service implements OnInit{
    
     products_array:Product [] = [];
     poroducts_update = new Subject();
     prevent_reset = new Subject();
     product_fetched = new Subject();
     url:string = environment.apiUrl;
     private token:string;
     constructor(private router:Router,private authService:AuthService,private cart_order_service:Cart_Order_Service){}
     ngOnInit(){
        
     }

     addProducts(newProduct:{product:Product,category:string}){
         this.token = this.authService.getToken();
         const formData = new FormData();
         formData.append('name',newProduct.product.name);
         formData.append('imagePath',newProduct.product.imagePath);
         formData.append('price',newProduct.product.price.toString());
         formData.append('description',newProduct.product.description);
         formData.append('category',newProduct.product.category);
         fetch(this.url+newProduct.category+'/add-product',{
             method:'POST',
             headers:{ Authorization:'Bearer '+this.token},
             body:formData
         }).then((res)=>{
            if(res.status !==201){

                return res.json().then((resData)=>{
                   const error = new Error(resData.message);
               
                   if(resData.product_data){
                    
                        throw {error:error, product_data:resData.product_data};
                   }
                    throw {error:error};
                })
            
            }else{
                return res.json();
            }
         }).then((resData)=>{
             this.products_array.push(resData.product);
             alert(resData.message);
         }).catch((error)=>{

             alert(error.error.message);
             if(error.product_data){
                this.prevent_reset.next(error.product_data);
             }
            
         })
     }

     getProducts(category:string){
         this.token = this.authService.getToken();
         fetch(this.url+category+'/get-products',{
             method:'GET',
             headers:{ Authorization:'Bearer '+this.token}
            }).then((res)=>{
                if(res.status!==200){
                    return  res.json().then((resData)=>{
                        throw new Error(resData.message)
                    })
                }else{
                    return res.json();
                }
            }).then((resData)=>{
                this.products_array = resData.products;
                this.poroducts_update.next(this.products_array.slice());
            }).catch((error)=>{
                alert(error.message);
                this.authService.Logout();
                this.router.navigate(['/Signin']);
            })

            const socket = openSocket('http://localhost:3000');
            socket.on('products',(data)=>{
                if(data.action === 'create'){
                    this.addProductIO(data.product);
                }
                else if(data.action === 'delete'){
                    this.deleteProductIO(data._id);
                }else if(data.action === 'userOrderAccepted'){
                    this.cart_order_service.userOrderAccepted(data.orderId);
                }else if(data.action === 'newOrder'){
                    this.cart_order_service.newOrder(data.order);
                }else if(data.action === 'deliveryStarted'){
                    this.cart_order_service.userOrderDeliveryStarted(data.orderId);
                }
                else if(data.action === 'orderDelivered'){
                    console.log('OrderDe')
                    this.cart_order_service.userOrderDelivered(data.orderId);
                }
            })
     }

     addProductIO(product:Product){
        this.products_array.push(product);
         var newProduct:Product[]= this.products_array.filter((p)=>{
            return p._id.toString() == product._id.toString()
        })
        this.products_array = this.products_array.filter((p)=>{
            return p._id.toString() != product._id.toString();
        })
   
        this.products_array.push(newProduct[0]);
      
        this.poroducts_update.next(this.products_array.slice());
     }
     deleteProductIO(_id:string){
        this.products_array = this.products_array.filter((p)=>{
            return p._id.toString() != _id.toString();
        })
        this.poroducts_update.next(this.products_array.slice());
     }
     DeleteProduct(deleteProduct:{_id:string, category:string}){
        this.token = this.authService.getToken();
       fetch(this.url+deleteProduct.category+'/delete-product/'+deleteProduct._id,{
           method:'DELETE',
           headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
           body:JSON.stringify({
                _id:deleteProduct._id,
                category:deleteProduct.category
           })

       }).then((res)=>{
            if(res.status!==200){
               return  res.json().then((resData)=>{
                    throw new Error(resData.message)
                })
            }
            return res.json();
       }).then((resData)=>{
           this.products_array = this.products_array.filter((p:Product)=>{
               return p._id.toString() != resData._id.toString();
           })
           this.poroducts_update.next(this.products_array.slice());
           alert(resData.message);
       }).catch((error)=>{
           alert(error.message);
       })
     }

     getProduct(product_info:{_id:string,category:string}){
        this.token = this.authService.getToken();
         console.log(product_info.category+product_info._id)
        fetch(this.url+product_info.category+'/get-product/'+product_info._id,{
            method:'GET',
            headers:{ Authorization:'Bearer '+this.token}
           }).then((res)=>{
               if(res.status!==200){
                  return res.json().then((resData)=>{
                       throw new Error(resData.message);
                   });
               }else{
                   return res.json();
               }
           }).then((resData)=>{
              
               this.product_fetched.next(resData.product);
           }).catch((error)=>{
               alert(error.message);
               this.router.navigate(['/Signin']);
           })

     }
     editProduct(editProduct:{product:Product,old:string}){
         let formData;
         let headers = {};
         this.token = this.authService.getToken();
        if(typeof(editProduct.product.imagePath) === 'object'){
            formData = new FormData();
            formData.append('_id',editProduct.product._id);
            formData.append('name',editProduct.product.name);
            formData.append('imagePath',editProduct.product.imagePath);
            formData.append('price',editProduct.product.price.toString());
            formData.append('description',editProduct.product.description);
            formData.append('category',editProduct.product.category);
            formData.append('OldImagePath',editProduct.old);
        }else if(typeof(editProduct.product.imagePath)==='string'){
            formData = {_id:editProduct.product._id,name:editProduct.product.name,description:editProduct.product.description,
                price:editProduct.product.price, imagePath:editProduct.product.imagePath,category:editProduct.product.category
            }
            headers = {'Content-Type':'application/json',Authorization:'Bearer '+this.token}
            formData = JSON.stringify(formData);
        }
       console.log(formData)
        fetch(this.url+editProduct.product.category+'/edit-product',{
            method:'PATCH',
            headers:headers,
            body:formData
        }).then((res)=>{
            if(res.status!==200){
                return res.json().then((resData)=>{
                    const error = new Error(resData.message);
                
                    if(resData.product_data){

                         throw {error:error, product_data:resData.product_data};
                    }
                     throw {error:error};
                 })
            }else{
                return res.json();
            }
         
        }).then((resData)=>{
            this.router.navigate(['./deals/'+editProduct.product.category])
            alert(resData.message);

        }).catch((error)=>{
            alert(error.error.message);
            if(error.product_data){
                this.prevent_reset.next(error.product_data);
             }else{
                this.router.navigate(['/Signin']);
             }
        })
     }

   

}