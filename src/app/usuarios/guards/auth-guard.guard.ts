import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated()){
        if(this.isExpiredToken()){
          this.authService.logout();
          this.router.navigate(['/login'])
          return false;
        }
        return true;
      }
      this.router.navigate(['/login'])
    return false;
  }

  isExpiredToken():boolean{
    let token = this.authService.token;
    let payload = this.authService.obtenerDatos(token);
    let now= new Date().getTime()/1000;
    if(payload.exp<now){
      return true;
    }
    return false;
  }
  
}
