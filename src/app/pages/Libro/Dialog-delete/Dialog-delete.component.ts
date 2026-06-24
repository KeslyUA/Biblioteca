import { Component, Inject, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { libro } from "../../../models/libro";
import { usuario } from "../../../models/usuario";

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'Dialog-delete.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
})
export class DialogEliminar {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number,tipo: string, nombre?: string }) {} 

  readonly dialogRef = inject(MatDialogRef<DialogEliminar>);

  onNoClick(): void {
    this.dialogRef.close();
    
  }
  
  eliminar(){
    this.dialogRef.close(this.data);
  }
}