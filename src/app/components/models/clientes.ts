import { Factura } from "src/app/facturas/models/factura";
import { Region } from "./Region";

export class Cliente{
    id:number;
    nombre:string;
    apellido:string;
    email:string;
    createAt:string;
    foto:string;
    region:Region;
    facturas:Factura[]=[]
}