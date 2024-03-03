import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

constructor(
    private authService:AuthService){
    }
  //Interceptor para añadir el token a las cabeceras de las peticiones  
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    //Obtenemos el token con el metodo GET
    let token=this.authService.token;
    
    //Si es distinto de null, lo añadimos a la cabecera
    if(token!=null){
        const authReq = req.clone({
        headers: req.headers.set('Authorization','Bearer ' + token)
        });
        
        return next.handle(authReq);
    }

    return next.handle(req);
  }
}