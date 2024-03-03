import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../components/models/usuarios';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //_ para utilizar solo en esta clase
  private _usuario:Usuarios;
  private _token:string;

  constructor(private http:HttpClient) { }
  
  //Metodo get Usuario
  public get usuario():Usuarios{
    if(this._usuario!=null){
      return this._usuario
    
    }else if(this._usuario==null && sessionStorage.getItem('usuario')!=null){
     this._usuario= JSON.parse(sessionStorage.getItem('usuario')) as Usuarios;  
     return this._usuario;
    }
    return new Usuarios();
  }

  //Metodo get Token
  public get token():string{
    if(this._token!=null){
      return this._token
    }else if(this._token==null && sessionStorage.getItem('token')!=null){
      this._token=sessionStorage.getItem('token'); 
      return this._token
    }
    return null;
  }

  //Metodo logeo de inicio
  login(usuario:Usuarios):Observable<any>{
    //Declaramos la URL para comprobacion y generacion del token
    const urlEndpoint = 'http://localhost:8080/oauth/token';

    //Declaramos los datos del front para enviar en peticion
    const credentials =  btoa('angularapp' + ':' + '12345');

    //Cabecera de inicipio con el auth y el tipo
    const  httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credentials });
    let params = new URLSearchParams();

    //Utilizamos los datos introducidos para autenticarnos
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);

    return this.http.post<any>(urlEndpoint, params.toString(),{headers: httpHeaders});
  }

  //Guardamos el usuario en el sessionStorage para su uso en el aplicativo
  //Obtenemos datos a traves de la decodificacion del token
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

   //Guardamos el token en el sessionStorage para su uso en el aplicativo
  guardarToken(accessToken :string){
    this._token=accessToken;
    sessionStorage.setItem('token',this._token);
  }

   //Obtenemos datos a traves de la decodificacion del token
  obtenerDatos(accessToken:string):any{
    if(accessToken!=null){
      let token = JSON.parse(atob(accessToken.split(".")[1]))
      return token;
    }
    return null;
  }

  //Comprueba si esta autenticado o no
  isAuthenticated():boolean{
    let payload = this.obtenerDatos(this.token);
    if(payload!=null && payload.user_name && payload.user_name.length>0){
      return true
    }
    return false;
  }

  //Comprueba si tiene rol o no
  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  //Cierra la session y elimina todos los datos del usuario del aplicativo
  logout(){
    this._token=null;
    this._usuario=null;
    sessionStorage.clear();
  }
}
