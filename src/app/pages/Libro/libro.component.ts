import {  Component, OnInit, ViewChild,inject ,ChangeDetectorRef} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatPaginator,MatPaginatorModule} from '@angular/material/paginator';
import {libro} from '../../models/libro';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro';
import{MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import{Dialog} from '../Libro/Dialog-libro/Dialog-libro.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogEliminar } from './Dialog-delete/Dialog-delete.component';


@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, CommonModule, MatButtonModule,MatPaginatorModule,MatIconModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.css',
})


export class Libro implements OnInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'nombreLibro', 'tipo', 'autor','acciones'];
    dataSource = new MatTableDataSource<libro>();

  
  constructor(private libroService: LibroService,
    private cd: ChangeDetectorRef,
  ){}
  

  ngOnInit(){
    this.libroService.obtenerLibros().subscribe(data=>{
      this.dataSource.data = data;
      console.log("auu",data)
    });
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  buscarLibro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  guardarLibro(libroCreado:libro){
    this.libroService.guardarLibro(libroCreado).subscribe((libroGuardado:any)=>{
      const nuevoDato = [...this.dataSource.data,libroGuardado];
      this.dataSource.data = nuevoDato;
      this.cd.detectChanges();
    })
  }

  eliminarLibro(id:number){
    
    this.libroService.eliminar(id).subscribe(()=>{
      this.dataSource.data = this.dataSource.data.filter(libro => libro.id !== id)
    })
  }

  abrirDialogEliminar(libro: libro): void {
    const dialogo = this.dialog.open(DialogEliminar, {
      data: {
        id: libro.id,
        nombre: libro.nombreLibro,
        tipo: "libro"},
    });
    dialogo.afterClosed().subscribe(resultado => {
      if(resultado){
        this.eliminarLibro(resultado.id);
      }
    });

  }

  editarLibro(id:number,libroActualizado:libro){
    this.libroService.actualizarLibro(id,libroActualizado).subscribe(()=>{
      this.dataSource.data = this.dataSource.data.map(li=> li.id === id ? libroActualizado:li)
    })
  }

   abrirDialog(libro?:libro): void {
    const dialogRef = this.dialog.open(Dialog,{
      width:'400px',
      data:{...libro}
    }

    );

    dialogRef.afterClosed().subscribe(resultado => {
    if(resultado){
      if(resultado.id){
        this.editarLibro(resultado.id, resultado);
      }else{
        this.guardarLibro(resultado)
      
      }
    }
  });
  }
 
  
}
