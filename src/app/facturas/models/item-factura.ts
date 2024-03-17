import { Productos } from "./productos";

export class ItemFactura {
    producto:Productos = new Productos();
    cantidad:number=1;
    importe:number;

public calcularImporte():number{
    return this.cantidad * this.producto.precio;
}
}
