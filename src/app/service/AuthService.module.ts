import { Router } from '@angular/router';
import { Inject,Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
@Injectable()
export class AuthService{
    url:string = environment.apiUrl;
    phone_num  = new Subject();
    get_user = new Subject();
    prevent_reset = new Subject();
    private token:string;
    private isAuthenticated =false;
    private adminIsAuthenticated = false;
    private authStatusListener = new Subject();
    private adminStatusListener = new Subject();
    private tokenTimer:any;
    constructor(private router:Router,private cookieService:CookieService){
    }
  
    getToken(){
        return this.token;
    
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }
    getAdminStatusListener(){
        return this.adminStatusListener.asObservable();
    }
    getAdminIsAuthenticated(){
        return this.adminIsAuthenticated;
    }
    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    Logout(){
       
        this.token = null;
        this.adminIsAuthenticated = false;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.adminStatusListener.next(false);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
      
        this.router.navigate(["/"]);
    }
    private saveAuthData(token:string,expirationDate:Date){

            this.cookieService.set('token',token);
            this.cookieService.set('expiration',expirationDate.toISOString());
             
    }
    private setContact(contact:string){
        this.cookieService.set('contact',contact);
    }
    getContact(){
       const contact =  this.cookieService.get('contact');
       return contact;
    }
    private removeContact(){
      
        this.cookieService.delete('contact',environment.path,environment.domain);
    }
    private clearAuthData(){
      this.cookieService.deleteAll(environment.path,environment.domain);
    }
    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        } 
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() -  now.getTime();
        if(expiresIn>0){
                        
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            // Time is converted to seconds again and sent
            this.setAuthTimer(expiresIn/1000);
            if(authInformation.contact == '03026627823'){
                this.adminIsAuthenticated = true;
                this.adminStatusListener.next(true);
            }
        }
    }
    private getAuthData(){
        const token = this.cookieService.get('token');
        const expirationDate = this.cookieService.get('expiration');
        const contact = this.cookieService.get('contact');
        if(!token || !expirationDate){   
            return;
        }
        return{
            token:token,
            expirationDate: new Date(expirationDate),
            contact:contact
        }
    }
    private setAuthTimer(duration:number){
        this.tokenTimer =  setTimeout(()=>{
            this.Logout();
        },duration*1000);
    }
    
    phone_verf_part1(contact:string){
        fetch(this.url+'auth/phone_verification_part_1',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({contact:contact})
        }).then((res)=>{
            if(res.status!==200){
                return  res.json().then((resData)=>{
                    throw new Error(resData.message)
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            this.setContact(resData.contact);
            this.router.navigate(['phone_verf_pt2'])
        }).catch((error)=>{
            alert(error.message);
        })
        
    }
    
    phone_verf_part2({code:code}){
        fetch(this.url+'auth/phone_verification_part_2',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({code:code})
        }).then((res)=>{
            if(res.status!==200){
                return  res.json().then((resData)=>{
                    this.removeContact();
                    throw new Error(resData.message)
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            this.cookieService.delete('timer',environment.path,environment.domain);
            this.router.navigate(['Signup']);
        }).catch((error)=>{
            
            alert(error.message);
            this.router.navigate(['phone_verf_pt1']);
            
        })
    }

    SignUp(user:{name:string,email:string,password:string,contact:string}){
        fetch(this.url+'auth/SignUp',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name:user.name,email:user.email,password:user.password,contact:user.contact})
        }).then((res)=>{
            if(res.status!==201){
               return res.json().then((resData)=>{
                    throw new Error(resData.message)
                })
            }
            return res.json()
        }).then((resData)=>{
            alert(resData.message);
            this.removeContact();
            this.router.navigate(['Signin']);
        }).catch((error)=>{
            alert(error.message);
            this.router.navigate(['Signin']);
        })
    }

    SignIn(user:{contact:string,password:string}){
        
        fetch(this.url+'auth/SignIn',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({contact:user.contact,password:user.password})
        }).then((res)=>{
            if(res.status!==200){
               return  res.json().then((resData)=>{
                   const error = new Error();
                   error.message = resData.message;
                   if(resData.contact){
                       error.name = resData.contact;
                   }
                    throw error;
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            const token = resData.token;
            this.token = token;
            if(token){
                const expiresInDuration = resData.expiresIn;
                //Token Expiration Duration:
                this.setAuthTimer(expiresInDuration);
                const now = new Date();
                const expirationDate = new Date((now.getTime() + expiresInDuration)*1000);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.saveAuthData(token,expirationDate);
                this.router.navigate(['deals/exclusive-discounted-deals']);
                if(resData.userContact=='03026627823'){
                    this.setContact(resData.userContact);
                    this.adminIsAuthenticated = true;
                    this.adminStatusListener.next(true);
                }
            }
            
           
        }).catch((error)=>{
            alert(error.message);
            this.prevent_reset.next(error.name);



        })
    }

    getUser(){
        this.token = this.getToken();
        fetch(this.url+'auth/get_user',{
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
            this.get_user.next({name:resData.name,email:resData.email});
        }).catch((error)=>{
            alert(error.message);
        })
    }

    updateUserData(user:{name:string,email:string,password:string}){
        this.token = this.getToken();
        fetch(this.url+'auth/update_user',{
            method:'PATCH',
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+this.token},
            body:JSON.stringify({
                name:user.name,
                email:user.email,
                password:user.password
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
            this.router.navigate(['deals/exclusive-deals']);
        }).catch((error)=>{
            alert(error.message);
        })
    }

    resetPasswordPt1(email:string){
        fetch(this.url+'auth/reset_password_pt1',{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:email
            })

        }).then((res)=>{
            if(res.status!==200){
               return  res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
        }).catch((error)=>{
            alert(error.message);
        })  
    }

    resetPasswordPt2(data:{token:string,passowrd:string}){
        fetch(this.url+'auth/reset_password_pt2',{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                token:data.token,
                password:data.passowrd
            })

        }).then((res)=>{
            if(res.status!==200){
               return  res.json().then((resData)=>{
                    throw new Error(resData.message);
                })
            }
            return res.json();
        }).then((resData)=>{
            alert(resData.message);
            this.router.navigate(['Signin']);
        }).catch((error)=>{
            alert(error.message);
        })
    }


}
