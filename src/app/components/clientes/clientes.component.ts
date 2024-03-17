import { Component, OnInit } from '@angular/core';
import { ClienteService } from './services/cliente.service';
import { ModalService } from './services/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../models/clientes';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador:any;
  clienteSeleccionado:Cliente;

  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService, 
    private activateRoute: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit(): void {

    this.activateRoute.paramMap.subscribe(params=>{

    let page:number =+ params.get('page');

    if(!page){
      page=0;
    }
    
    this.clienteService.getClientes(page).pipe(
      tap(response=>
        (response.content as Cliente[]).forEach(cliente=>{}))).subscribe(
      response=>{
          this.clientes=response.content as Cliente[];
          this.paginador=response;
          });
        });

      this.modalService.notificarUpload.subscribe(cliente=>{
        this.clientes=this.clientes.map(clienteOriginal=>{
          if(cliente.id==clienteOriginal.id){
            clienteOriginal.foto=cliente.foto;
          }
          return clienteOriginal;
        })
      })
    }

    delete(cliente: Cliente): void {

      swal({
        title: '¿Esta seguro?',
        text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes=this.clientes.filter(cli => cli!==cliente)
              swal(
                'Eliminado!',
                'Eliminado con éxito',
                'success'
              )
            }
          )
        }
      })
    }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado=cliente;
    this.modalService.abrirModal();
  }

}

