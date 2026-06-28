import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root' 
})

export class UsuarioService{
    

    private apiUrl ="https://biblioteca-back-gsi1.onrender.com/api/usuario";
    private urlReporte ="http://localhost:8080/api/reporte";
    constructor(private http:HttpClient){}

    obtenerUsuario(){
        return this.http.get<any[]>(`${this.apiUrl}/listaUsuario`)
    }

    guardarUsuario(usuario:any){
        return this.http.post(`${this.apiUrl}/guardarUsuario`,usuario)
    }
    actualizarUsuario(id:number,usuario:any){
        return this.http.put(`${this.apiUrl}/actualizar/${id}`,usuario)
    }
    eliminarUsuario(id:number){
        return this.http.delete(`${this.apiUrl}/eliminar/${id}`)
    }

    descargarReporte():Observable<Blob>{
        return this.http.get(`${this.urlReporte}/descargar`, { responseType: 'blob' })
    }
}