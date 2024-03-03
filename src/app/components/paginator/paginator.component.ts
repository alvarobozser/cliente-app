import { Component, Input, OnInit ,OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

 @Input() paginador:any;
 paginas :any[];
 desde:number;
 hasta:number;

  constructor() { }

  ngOnInit(){
  this.intPaginator();
  }

  ngOnChanges(changes:SimpleChanges){
    let paginadorActualizado = changes['paginador'];

    if(paginadorActualizado.previousValue){
      this.intPaginator();
    }
  }

  intPaginator():void{
    this.desde=Math.min(Math.max(1,this.paginador.number-1),this.paginador.totalPages-2);
    this.hasta=Math.max(Math.min(this.paginador.totalPages,this.paginador.number+1),3);

    if(this.paginador.totalPages>5){
      this.paginas= new Array(this.hasta -this.desde +1).fill(0).map((_valor,indice)=>indice + this.desde);
      }else{
      this.paginas= new Array(this.paginador.totalPages).fill(0).map((_valor,indice)=>indice +1);
      }
  }

}
