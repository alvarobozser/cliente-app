import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from './usuarios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario:Usuarios;
  private _token:string;

  constructor(private http:HttpClient) { }

  public get usuario():Usuarios{
    if(this._usuario!=null){
      return this._usuario
    
    }else if(this._usuario==null && sessionStorage.getItem('usuario')!=null){
     this._usuario= JSON.parse(sessionStorage.getItem('usuario')) as Usuarios;  
     return this._usuario;
    }
    return new Usuarios();
  }

  public get token():string{
    if(this._token!=null){
      return this._token
    }else if(this._token==null && sessionStorage.getItem('token')!=null){
      this._token=sessionStorage.getItem('token'); 
      return this._token
    }
    return null;
  }

  login(usuario:Usuarios):Observable<any>{
    const urlEndpoint = 'http://localhost:8080/oauth/token';

    const credentials =  btoa('angularapp' + ':' + '12345');

    const  httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credentials });
    let params = new URLSearchParams();

    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);

    return this.http.post<any>(urlEndpoint, params.toString(),{headers: httpHeaders});
  }

  guardarUsuario(accessToken :string){
    let payload= this.obtenerDatos(accessToken);
    this._usuario = new Usuarios();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellidos = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));

  }

  guardarToken(accessToken :string){
    this._token=accessToken;
    sessionStorage.setItem('token',this._token);
  }

  obtenerDatos(accessToken:string):any{
    if(accessToken!=null){
      let token = JSON.parse(atob(accessToken.split(".")[1]))
      return token;
    }
    return null;
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDatos(this.token);
    if(payload!=null && payload.user_name && payload.user_name.length>0){
      return true
    }
    return false;
  }

  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  logout(){
    this._token=null;
    this._usuario=null;
    sessionStorage.clear();
  }
}
