import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../usuarios/auth.service';
import { catchError,throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

constructor(
    private authService:AuthService,
    private router: Router,){
    }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError(e=>{
        if(e.status==401 ){

          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login'])
        }
        if(e.status==403){
          swal('Acceso Denegado','No tienes acceso a este recurso', 'warning');
          this.router.navigate(['/clientes'])
          
        }
        return throwError(e)
      })
    )
  }
}