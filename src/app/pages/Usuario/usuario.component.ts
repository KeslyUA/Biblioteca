import { Component, inject,ChangeDetectorRef} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import { UsuarioService } from '../../services/usuario';
import { MatDialog } from '@angular/material/dialog';
import { DialogSearch } from '../Libro/Search-libro/Search-libro.component';
import { LibroService } from '../../services/libro';
import { libro } from '../../models/libro';
import { usuario } from '../../models/usuario';
import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DialogUsuario } from '../Libro/Dialog-usuario/Dialog-usuario.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogEliminar } from '../Libro/Dialog-delete/Dialog-delete.component';
import { jsPDF } from "jspdf";
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  imports: [
    MatFormFieldModule,
    MatInputModule, 
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatIconModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class Usuario {
  displayedColumns: string[] = ['IdUsuario', 'nombre', 'apellido', 'dni', 'celular', 'libro','fechaPrestado','descargar','Acciones'];
  dataSource = new MatTableDataSource<usuario>();

  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private usuarioService:UsuarioService,
    private libroService:LibroService,
    private cd:ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private http:HttpClient
  ){}
  usuario: any= {
    nombre:"",
    apellido:"",
    dni:"",
    celular:"",
    libros:[],

  }
  private token ='9e06c2f00f753959b13c3d6a198a01b2ddaef86e355b22eebae9e4c7ea32';
  
ngOnInit(){
    this.usuarioService.obtenerUsuario().subscribe((data:usuario[]) =>{
      this.dataSource.data = data;
      this.cd.detectChanges();
    })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  consultaDni(dni:number){
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })

    const body ={
      "dni": dni
    }

    this.http.post<any>(
      'https://api.json.pe/api/dni',
      body,
      {headers}
    ).subscribe(info => {
      this.usuario.nombre = info.data.nombres;
      this.usuario.apellido =`${info.data.apellido_paterno} ${info.data.apellido_materno}`;

      this.cd.detectChanges();
    })
  }
  

  guardarUsuario(){
    const dniIngresado = this.usuario.dni?.trim();
    if(!this.usuario.nombre || !this.usuario.apellido || !this.usuario.dni || !this.usuario.libros || !this.usuario.celular){
      this.snackBar.open('Datos vacios,por favor llene todos los campos', 'Ok', { duration: 3000 });
      return;
    }
    const userExiste = this.dataSource.data.some(u => u.dni?.toString().trim() === dniIngresado)
    if(userExiste){
      this.snackBar.open('Error,Usuario ya realizo prestamo', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar'],
        });
        return;
    }
    
      this.usuarioService.guardarUsuario(this.usuario).subscribe(
        {
          next: () => {
              this.snackBar.open('Usuario guardado con éxito', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar']
              });

              this.usuarioService.obtenerUsuario().subscribe(datos => {
                this.dataSource.data = datos;
              })
              
              setTimeout(() => {
                this.usuario = {
                  nombre: '',
                  apellido: '',
                  dni: '',
                  celular: '',
                  libros: null,
                };
              });
              


            },error: () => {
                this.snackBar.open('Error al guardar el usuario', 'Ok', { duration: 3000 });
            }
            

        }
      )
      
    
    
  }

 

  abrirDialogLibro(){
    this.libroService.obtenerLibros().subscribe((data:libro[])=>{

    const abrir = this.dialog.open(DialogSearch,{
          width:"400px",
          height:"400px",
          data:{libros:data}
        })
        abrir.afterClosed().subscribe(resultado =>{

          if (!this.usuario.libros) {
                this.usuario.libros = [];
          }
          
          resultado && this.usuario.libros.push(resultado);

          this.cd.detectChanges();       
        })

    })
    

    
  };

  DialogEdit(usuarioSeleccionado?:usuario):void{
    const abrirEdit= this.dialog.open(DialogUsuario,{
      width:"400px",
      data:usuarioSeleccionado?{...usuarioSeleccionado}:null
    })

    abrirEdit.afterClosed().subscribe(resultado =>{

      if(resultado){
          this.usuarioService.actualizarUsuario(resultado.idUsuario,resultado).subscribe({
            
            next: () => {
            this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });

            this.usuarioService.obtenerUsuario().subscribe((data: usuario[]) => {
              
              this.dataSource.data = data;

            });
            this.cd.detectChanges();

            },error: () => {
              this.snackBar.open('Error al actualizar el usuario', 'Ok', { duration: 3000 });
            }
        
          });
      }

    });
  }

  eliminarUser(usuario:usuario):void{
    const dialogEliminar = this.dialog.open(DialogEliminar,{
      width:"300px",      
      data:{
        id: usuario.idUsuario,
        nombre: usuario.nombre,
        tipo: "usuario"
      }
    })
    dialogEliminar.afterClosed().subscribe(resultado =>{
      if(resultado){
        this.usuarioService.eliminarUsuario(resultado.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });

            this.usuarioService.obtenerUsuario().subscribe((data: usuario[]) => {
              
              this.dataSource.data = data;

            });

          },error: () => {
            this.snackBar.open('Error al eliminar el usuario', 'Ok', { duration: 3000 });
          }
        })

      }
    })
    
  }

  generarPDF(usuario:usuario){
    const dc = new jsPDF();
    const fechaFormateada = new Date(usuario.fechaPrestado).toLocaleDateString('es-ES');

    dc.setFont("helvetica", "bold");
    dc.text("CONTRATO DE PRÉSTAMO BIBLIOTECARIO", 100, 10,{align: "center"});

    dc.setFont("helvetica", "normal");
    dc.setFontSize(11);
    dc.text("El presente documento certifica el acto de préstamo de material bibliográfico. El usuario se", 10, 28);
    dc.text("compromete formalmente a cumplir con las normas estipuladas para este proceso:", 10, 34);

    dc.setFont("helvetica", "bold");
    dc.text("CLÁUSULAS DE PENALIZACIÓN Y SANCIONES:", 10, 48);

    dc.setFont("helvetica", "normal");
    dc.text("1. Retraso en la entrega: Si el usuario no devuelve el libro dentro del plazo establecido", 10, 58);
    dc.text("   (máximo 10 días), se aplicará una multa automática de S/ 5.00 por atraso.", 10, 64);
    dc.text("   Asimismo, perderá el derecho a solicitar nuevos préstamos durante dicho período.", 10, 70);

    dc.text("2. Deterioro del material: En caso de que el libro sea devuelto con daños materiales o en", 10, 80);
    dc.text("   mal estado, el usuario asumirá una penalización obligatoria de S/ 10.00.", 10, 86);

    dc.text("3. Pérdida o material incompleto: Si el usuario devuelve libros incompletos o extravía", 10, 96);
    dc.text("   el ejemplar, se aplicará un cobro punitivo de S/ 50.00 por cada volumen faltante.", 10, 102);

    dc.line(10, 112, 200, 112); 
    dc.setFont("helvetica", "bold");
    dc.text("DETALLES DE USUARIO", 10, 120);

    dc.setFont("helvetica", "normal");
    dc.text(`Nombre: ${usuario.nombre} ${usuario.apellido}`, 10, 130);
    const cantidad = usuario.libros ? usuario.libros.length : 0;
    dc.text(`Cantidad de Libros Prestados: ${cantidad}`, 10, 138);
    dc.text(`fecha de prestamo:${fechaFormateada}`, 10, 146);

    dc.text("Firma del usuario:_________________________", 60, 270);

    dc.save("reporte.pdf");
  }


}
