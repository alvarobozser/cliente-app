import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError,throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

constructor(
    private authService:AuthService,
    private router: Router,){
    }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    //Interceptor para normalizar los mensajes 401 y 403 de todas las peticiones
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