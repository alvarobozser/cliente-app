import { Component, OnInit } from '@angular/core';
import { FacturasService } from '../services/facturas.service';
import { Factura } from '../models/factura';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detail-factura',
  templateUrl: './detail-factura.component.html',
  styleUrls: ['./detail-factura.component.css']
})
export class DetailFacturaComponent implements OnInit {

  factura:Factura;
  titulo:string = 'Factura'
  constructor(
    private facturaService: FacturasService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params=>{
      let id =+params.get('id')
      this.facturaService.getFactura(id).subscribe(factura=>this.factura=factura);
    })
  }

}
