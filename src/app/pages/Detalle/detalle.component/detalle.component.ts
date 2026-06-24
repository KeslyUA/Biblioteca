import { Component,inject,OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { usuario } from '../../../models/usuario';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle.component',
  imports: [MatIcon,RouterLink,DatePipe],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
})
export class DetalleComponent {

  

  detalleUsuario:usuario[]=[];

  usuarioRecibido: usuario = history.state['datos'];
  estado:boolean = history.state['estado'];

}
