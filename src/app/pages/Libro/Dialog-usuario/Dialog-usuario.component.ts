import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DialogSearch } from '../Search-libro/Search-libro.component';
import { LibroService } from '../../../services/libro';


@Component({
  selector: 'Dialog',
  standalone: true,
  templateUrl: './Dialog-usuario.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
  ],
  styleUrl: './Dialog-usuario.component.css',
})

export class DialogUsuario{

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any ={
      nombre:"",
      apellido:"",
      dni:"",
      celular:"",
      libros:[],
    },
    private DialogRef: MatDialogRef<DialogUsuario>,
    private dialog: MatDialog,
    private libroService:LibroService,
    private cd: ChangeDetectorRef,
  ) {}
 
  

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  cerrarDialog(): void {
    this.DialogRef.close();
  }

  guardar(){
    this.DialogRef.close(this.data );
  }

  
  editarLibro(){
  this.libroService.obtenerLibros().subscribe(libros =>{
    const abrir =this.dialog.open(DialogSearch,{
      width:'400px',
      data:{libros}
    })
    abrir.afterClosed().subscribe(resultado =>{
      if(resultado){
        
         if(!this.data.libros){
          this.data.libros = []
        }
          const f = this.data.libros.push(resultado);
        
      }
      this.cd.detectChanges();
       
    })
  })}
}
