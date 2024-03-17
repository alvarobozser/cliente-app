import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Factura } from '../models/factura';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndpoint : string = 'http://localhost:8080/api/facturas'

  constructor(private http:HttpClient) { }

  getFactura(id:number): Observable<Factura>{
    return this.http.get<Factura>(this.urlEndpoint+'/'+id);
  }

  deleteFactura(id:number):Observable<void>{
    return this.http.delete<void>(this.urlEndpoint+'/'+id);
  }

  filtrarProductos(term:string):Observable<Productos[]>{
    return this.http.get<Productos[]>(this.urlEndpoint+'/filtrarProductos/'+term);
  }

  createFactura(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(this.urlEndpoint+'/add',factura);
  }
}
