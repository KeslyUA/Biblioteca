import { ChangeDetectorRef, Component,signal } from "@angular/core";
import { UsuarioService } from "../../services/usuario";
import { usuario } from "../../models/usuario";
import { DatePipe } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule,ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector:'app-reporte',
    imports: [
        DatePipe,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule
],
    templateUrl:'./reporte.component.html',
    styleUrl:'reporte.component.css'
})
export class Reporte {

    listarUsuario:usuario[] = [];
    listarUsuariosFiltrados:usuario[] = [];
    paginas:usuario[] = [];
     
    seleccionado = new FormControl('');
    inicio =0;
    fin = 5;
    rangoTex :string ='0 - 5';
    fechaLimite:Date | null = null;
    fechaActual: Date = new Date();
    constructor(
       private usuarioService:UsuarioService,
       private cd: ChangeDetectorRef,
       private router:Router
    ){}

    ngOnInit(){
        
        this.usuarioService.obtenerUsuario().subscribe((data:usuario[]) =>{
            this.listarUsuario = data.map(item => {
                return {
                    ...item,
                    fechaEntrega:item.fechaEntrega ? new Date(item.fechaEntrega) : null
                }
            })
            this.listarUsuariosFiltrados = [...this.listarUsuario]
            this.paginas= this.listarUsuariosFiltrados.slice(0,5)
            this.cd.detectChanges();
        })
        
        this.seleccionado.valueChanges.subscribe((valorDetectado) =>{
            
            const fechaActual = new Date;
            switch(valorDetectado){
                case '1':
                    this.listarUsuariosFiltrados = this.listarUsuario.filter(u => {

                        if(!u.fechaEntrega){
                            return false
                        }
                        const fecha =new Date(u.fechaEntrega) 
                        return fechaActual < fecha;
                    });
                    this.inicio = 0;
                    this.fin = 5;
                    this.paginas = this.listarUsuariosFiltrados.slice(0,5);
                    
                    break;
                case '2':
                    this.listarUsuariosFiltrados = this.listarUsuario.filter(u => {

                        if(!u.fechaEntrega){
                            return false
                        }
                        const fecha =new Date(u.fechaEntrega) 
                        return fechaActual > fecha;
                    });
                    this.inicio = 0;
                    this.fin = 5;
                    
                    this.paginas = this.listarUsuariosFiltrados.slice(0,5);
                    break;

                case '3':
                    this.listarUsuariosFiltrados = [...this.listarUsuario]
                    this.inicio = 0;
                    this.fin = 5;
                    this.paginas = this.listarUsuariosFiltrados.slice(0,5);
            }
            
        })
        
    }
    

    
    alerta(usuario:usuario):String{

        if(!usuario.fechaEntrega) return 'green';

        this.fechaLimite = new Date(usuario.fechaEntrega);

        return this.fechaActual < this.fechaLimite ? 'green':'red';
    }

    estado(usuario:usuario):boolean{
         if(!usuario.fechaEntrega) return true;

         const fechaLimite = new Date(usuario.fechaEntrega);
         return this.fechaActual < fechaLimite ;

    }

    filterReporte(event : Event){
        
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        if(filterValue.length == 0){
            this.paginas = this.listarUsuariosFiltrados.slice(0,5)
            this.cd.detectChanges();
            return
        }
        this.paginas= this.listarUsuariosFiltrados.filter(
            usuario => usuario.nombre.toLowerCase().includes(filterValue) || 
            usuario.apellido.toLowerCase().includes(filterValue) || 
            usuario.dni.toLowerCase().includes(filterValue) 
        ).slice(0,5);
        
        this.cd.detectChanges();

    }

    paginador(valor:string){
        
        if(valor == 'siguiente'){
            if( this.fin < this.listarUsuariosFiltrados.length && this.paginas.length >4 ){
                this.inicio += 5
                this.fin +=5
                this.paginas=this.listarUsuariosFiltrados.slice(this.inicio,this.fin)
            }
            return

        }else if(valor == 'atras'){
            if(this.fin > 5 ){
                this.inicio -=5
                this.fin -=5

                this.paginas = this.listarUsuariosFiltrados.slice(this.inicio,this.fin)
            }
            return 
        }
    }
    
    paginadorText(){
        return `${this.inicio} - ${this.fin}`;
    }

    info(detalleUsuario:usuario){
        let estad =true
        const fechaentrega =detalleUsuario.fechaEntrega;
        if(fechaentrega){
            estad =fechaentrega < this.fechaActual ?  false: true; 
        }
       
        this.router.navigate(['/detalle'],{ state: { 
            datos:detalleUsuario ,
            estado:estad
        }})

    }

    descargar(){
        this.usuarioService.descargarReporte().subscribe({
            next:(data:Blob)=>{
                const url = window.URL.createObjectURL(data);

                const a = document.createElement('a');
                a.href = url;

                a.download = 'reportes_prestamo.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                window.URL.revokeObjectURL(url);
            }
        })
    }

}