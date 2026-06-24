import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'Dialog',
  standalone: true,
  templateUrl: './Search-libro.component.html',
  styleUrl:'Search-libro.component.css',
  imports: [
    MatDialogContent,
  ],
})
export class DialogSearch {

constructor(
  public dialogBuscar: MatDialogRef<DialogSearch>,
  @Inject(MAT_DIALOG_DATA) 
  public data: any,
){}

listaDisabled:number[] =[];

seleccionarLibro(libro:any){
  this.dialogBuscar.close(libro);

}  
  
}
