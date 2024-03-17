import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../components/clientes/services/cliente.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { FacturasService } from './services/facturas.service';
import { Productos } from './models/productos';
import { ItemFactura } from './models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})

export class FacturasComponent implements OnInit {
  @ViewChild('inputBusqueda') inputBusqueda!: ElementRef<HTMLInputElement>;
  
  titulo:string='Nueva Factura';
  factura:Factura = new Factura();
  autocomplete = new FormControl();
  productos: Productos[] = [];
  productosSelec: Productos;
  itemFactura:ItemFactura = new ItemFactura;

  constructor(
    private clienteService: ClienteService,
    private facturaService: FacturasService,
    private activatedRoute:ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      let idCliente =+ params.get('idCliente')
      this.clienteService.getCliente(idCliente).subscribe(cliente=>this.factura.cliente=cliente);
    });
  }

  filtrarProductos(term:any){
    if(term!=null && term!=''){
      this.facturaService.filtrarProductos(term).subscribe(productos=> this.productos=productos);
    }
  }

  event(event:any){
    if (event) {
      this.productosSelec = this.productos.find(producto => producto.nombre === event);
      if(this.existeItem(this.productosSelec.id)){
        this.aumentarCantidad(this.productosSelec.id)
      }else{
      let nuevoItem= new ItemFactura();
      let producto = new Productos();
      producto=this.productosSelec;
      nuevoItem.producto=producto
      this.factura.items.push(nuevoItem);
      }
      this.productos=[];
      this.inputBusqueda.nativeElement.value = '';
    } else {
      this.productosSelec = undefined;
    }
  }

  actuCantidad(id:number,event:any){
    let cantidad:number = event.target.value as number;
    if(cantidad==0 || cantidad<0){
      return this.eliminar(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id=== item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }

  eliminar(id:number){
    this.factura.items=this.factura.items.filter((item:ItemFactura)=>id!==item.producto.id)
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach(element => {
      if (id === element.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  aumentarCantidad(id:number){
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id=== item.producto.id){
        ++item.cantidad
      }
      return item;
    })
  }

  crearFactura(){
    console.log(this.factura)
    this.facturaService.createFactura(this.factura).subscribe(factura=>{
        swal(this.titulo,`Factura ${factura.descripcion} creada con éxito`,'success');
        this.router.navigate(['/facturas',factura.id])
    })
  }
}
