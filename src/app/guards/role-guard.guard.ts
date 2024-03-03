import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    //Guard para proteger ruta con el rol
    //Comprueba si estas autenticado, si no a Login
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login'])
        return false;
      }
      
      //Extrae del route el dato del rol y comprueba si el autenticado tiene ese rol de acceso
      let role = route.data['role'] as string;
      if(this.authService.hasRole(role)){
        return true;
      }
      swal('Acceso Denegado','No tienes acceso a este recurso', 'warning');
      this.router.navigate(['/clientes'])
    return false;
  }
  
}
