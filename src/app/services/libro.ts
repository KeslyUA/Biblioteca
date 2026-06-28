import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibroService {

  private apiUrl="https://biblioteca-back-gsi1.onrender.com/api/libro"
  constructor(private http: HttpClient) { }

obtenerLibros(){
  return this.http.get<any[]>(`${this.apiUrl}/lista`);
}

guardarLibro(libro:any){

  return this.http.post(`${this.apiUrl}/guardar`, libro);
}

actualizarLibro(id:number, libro:any){

  return this.http.put(`${this.apiUrl}/actualizar/${id}`, libro);
}
eliminar(id:number){
  
  return this.http.delete(`${this.apiUrl}/eliminar/${id}`)
}
}
