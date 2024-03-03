import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Cliente } from '../../models/clientes';
import { Region } from '../../models/Region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndpoint: string = 'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndpoint + '/regiones')
  }

  getClientes(page:any): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).
      pipe(
        tap((response:any)=>{
          //Importante orden del tap, 
          //ya que Map ya lo ha cambiado a tipo cliente el response por que lo retorna.
          (response.content as Cliente[]).forEach(cliente=>{})}),
          map((response:any) => {//Map transforma, tap no.
      
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre;
          
         // let datePipe = new DatePipe('es');
         // cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
          return cliente;
        });
        return response;
      }),
      tap(response=>{//Importante orden del tap, 
        //ya que Map ya lo ha cambiado a tipo cliente el response por que lo retorna.
        (response.content as Cliente[]).forEach(cliente=>{
        })
      })
      );
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        //Controlar errores
        if (e.status == 400) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(e.status!=401){
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`)
  }

  uploadPhoto(archivo:File, id:any): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`,formData, {
      reportProgress: true,
    })
    return this.http.request(req)
  }
}