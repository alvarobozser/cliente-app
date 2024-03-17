import { Component, Input, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { ModalService } from '../services/modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Cliente } from '../../models/clientes';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() cliente:Cliente; 
  
  titulo: string = "Detalle del cliente"
  imagenSelect :File;
  progress: number=0;

  constructor(
    private clienteService : ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService:FacturasService
    )
    {}

  ngOnInit(): void {
  }

  selectFile(event){
    this.imagenSelect= event.target.files[0];
    this.progress=0;
    if(this.imagenSelect.type.indexOf('image')<0){
      swal('Error seleccionar imagen','El archivo debe ser del tipo imagen','error')
    }
  }

  uploadimagen(){
    if(!this.imagenSelect){
      swal('Error al subir la imagen','Seleccione una imagen','error')
    }else{
      this.clienteService.uploadPhoto(this.imagenSelect, this.cliente.id).subscribe(
        event=>{
          //this.cliente= cliente;
          if(event.type=== HttpEventType.UploadProgress){
            this.progress = Math.round((event.loaded/event.total)*100);
          }else if(event.type===HttpEventType.Response){
            let response:any = event.body
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            swal('La imagen se ha subido correctamente',this.cliente.foto,'success');
          }
      })
    }  
  }

  delete(factura:Factura){
    swal({
      title: '¿Esta seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}}?`,
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
        this.facturaService.deleteFactura(factura.id).subscribe(
          response => {
            this.cliente.facturas=this.cliente.facturas.filter(f => f!==factura)
            swal(
              'Eliminado!',
              'Eliminada con éxito',
              'success'
            )
          }
        )
      }
    })
  }

  cerraModal(){
    this.modalService.cerraModal();
    this.imagenSelect=null;
    this.progress=0;
  }
}
