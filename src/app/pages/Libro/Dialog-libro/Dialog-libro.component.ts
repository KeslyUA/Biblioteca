import {Component, Inject,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {libro}from '../../../models/libro';


@Component({
  selector: 'Dialog',
  standalone: true,
  templateUrl: './Dialog-libro.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  styleUrl: './Dialog-libro.component.css',
})
export class Dialog {


  

constructor(@Inject(MAT_DIALOG_DATA) public data: libro) {
  if (!this.data) {
      this.data = { id: 0,nombreLibro: '', tipo: '', autor: '', imagen: '',vecesPrestado:0 };
    }
}

 readonly dialogRef = inject(MatDialogRef<Dialog>);
 

  cerrarDialog(): void {
    this.dialogRef.close();
  }

  guardar(){
    this.dialogRef.close(this.data);
  }

  
  
}
