import { libro } from "./libro"

export interface usuario{
    idUsuario:number,
    nombre:string,
    apellido:string,
    dni:string,
    celular:number,
    libros:any[],
    fechaPrestado:string,
    fechaEntrega:Date | string | null;
    estado:string;
}