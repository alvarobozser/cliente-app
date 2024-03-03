import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuarios } from '../models/usuarios';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo ="Iniciar Sesión";
  usuario:Usuarios;

  constructor(
    private authService : AuthService,
    private router : Router
  ) { 
    this.usuario = new Usuarios();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal('Login','Hola ' + this.authService.usuario.nombre  + ', ya estás autenticado', 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login():void{

    if(!this.usuario.username || !this.usuario.password){
      swal('Error Login' , 'Nombre de usuario o password vacíos','error')
      return;
    } 

    this.authService.login(this.usuario).subscribe({
      next:response=>{
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario=this.authService.usuario;
        this.router.navigate(['/clientes']);
        swal('Login','Hola ' + usuario.nombre , 'success');
      },
      error:error=>{
        swal('Error Login', 'Usuario o clave incorrectas' , 'error');
      }
    })
  }
}
