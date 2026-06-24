import { Component ,OnInit} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QRCodeComponent } from 'angularx-qrcode';
import {MatButtonModule} from '@angular/material/button';
import { UsuarioService } from '../../../services/usuario';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pago.component',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    QRCodeComponent,
    MatButtonModule,
    FormsModule,
    MatIcon,
    DatePipe

  ],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent implements OnInit{
  constructor(
    private usuarioService :UsuarioService,
    private router:Router,
    private snackBar: MatSnackBar
  ){

  }
  data = history.state['datos'];
  usuario = history.state['user'];
  datosYape:string = `Monto a pagar: S/${this.data}- Devolución `;
  cargando: boolean = false;
  montoMoro=0;
  
  ngOnInit(): void {
      const fechaHoy =new Date();
      fechaHoy > this.usuario.fechaEntrega ? this.montoMoro = 5 : this.montoMoro = 0;
      
  }
  cancelado(){
      this.usuarioService.eliminarUsuario(this.usuario.idUsuario).subscribe({
        next: () => {
          this.snackBar.open('¡Proceso de devolucion exitosa!','cerrar',{
            duration:3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snack-exito']
          })
          this.router.navigate(['/devolucion']);
        },
        error: (err) => {
          console.error("Hubo un error al eliminar el usuario en el backend:", err);
        }
      });
    
  }
}