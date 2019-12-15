import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/AuthService.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListenSub:Subscription;
  userIsAuthenticated:boolean;
  adminIsAuthenticated = false;
  private adminStatusSub:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated:boolean)=>{
      this.userIsAuthenticated = isAuthenticated;
    })
    this.adminIsAuthenticated = this.authService.getAdminIsAuthenticated();
    this.adminStatusSub =  this.authService.getAdminStatusListener().subscribe((adminIsAuthenticated:boolean)=>{
      this.adminIsAuthenticated  = adminIsAuthenticated;
 })

  }
  onLogout(){
    this.authService.Logout();
  }
  ngOnDestroy(){
    this.authListenSub.unsubscribe();
  }

}
