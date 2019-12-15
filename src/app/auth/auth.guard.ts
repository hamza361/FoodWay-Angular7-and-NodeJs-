import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/AuthService.module';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService,private router:Router){}
    isAuth:boolean = true;
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):
    boolean | Observable<boolean>| Promise<boolean>{
       const isAuth1 = this.authService.getAdminIsAuthenticated();
       const isAuth2 = this.authService.getIsAuthenticated();
       if(!isAuth1 && !isAuth2){
            this.isAuth =false;
           this.router.navigate(['/Signin']);
       }
       return this.isAuth;
    }
    
}