import { Component,ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService } from '../../../services/usuario';
import { FormsModule } from '@angular/forms';
import { usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../../services/libro';
import { libro } from '../../../models/libro';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devolucion.component',
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatSelectModule,FormsModule,CommonModule],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css',
})
export class DevolucionComponent {
  constructor(
    private usuarioService:UsuarioService,
    private cd :ChangeDetectorRef,
    private libroService:LibroService,
    private router:Router
  ){}
  estadoLibro = '';
  dni :string = '';
  filtrado?: usuario;
  libroSeleccionado?:libro;
  libro:boolean=false;
  lista:number[] = [];
  siguiente:boolean = false;
  pago:number=0;

  buscarUsuario(){
    this.usuarioService.obtenerUsuario().subscribe(dato =>{
      const resultado= dato.find(u => u.dni == this.dni)
      this.filtrado= resultado;
      this.cd.detectChanges();
    })
  }
  seleccionar(id:number,libroSelec:any){
    this.libroService.obtenerLibros().subscribe(libro => {
      const libroFiltrado = libro.find(f => f.id == libroSelec.id)
      this.libroSeleccionado = libroFiltrado;
      
      const existe = this.lista.includes(id);
      existe == true ? this.libro=true : this.libro=false;
      
      this.cd.detectChanges();
    })
  }
  enviarEstado(id:number,estado:string):boolean{
    let monto=0;
   switch(estado){
    case '1':  monto=0
    break;
    case '2':  monto=10
    break;
    case '3':  monto=50
    break;

   }
   this.pago += monto;
   this.lista.push(id)
   if(this.lista.length == this.filtrado?.libros.length){
    this.siguiente = true;
   }
   return this.libro =true 
  }
 
  procesar(){

    this.router.navigate(['/pago'],{ state: { 
            datos:this.pago,
            user:this.filtrado
        }})

  }
  
}
