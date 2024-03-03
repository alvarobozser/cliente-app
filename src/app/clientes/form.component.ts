import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { Cliente } from './clientes';
import { Route, Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import {MatDatepickerModule} from '@angular/material'
import { Region } from './Region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente()
  regiones: Region[] = []
  titulo: String = "Crear Cliente"

  errores:String[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente() {
    this.activateRoute.params.subscribe(params => {
      let id = params['id']

      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)

      }
    });

    this.clienteService.getRegiones().subscribe(regiones=>{
      this.regiones=regiones;
    });

  }

  create() {
    this.clienteService.crearCliente(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success')
      },
      //Controlar errores con al peticion
      err =>{
        this.errores=err.error.errors as string[];
      }
    );
  }

  update() {
    this.clienteService.update(this.cliente).subscribe(
      json => {

        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `${json.mensaje} : ${json.cliente.nombre}`, 'success')
      },
      err =>{
        this.errores=err.error.errors as string[];
        
      }
    );
  }

  compararRegion(r1:Region,r2:Region):boolean{
    if(r1 === undefined && r2 ===undefined){
      return true;
    }
    return r1 ==null || r2 == null ? false : r1.id===r2.id;
  }
}
