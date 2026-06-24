import { Routes } from '@angular/router';
import { Libro } from './pages/Libro/libro.component'; 
import { Usuario } from './pages/Usuario/usuario.component';
import{Reporte} from './pages/Reporte/reporte.component';
import { Dashboard } from './pages/DashBoard/dashboard.component';
import { DetalleComponent } from './pages/Detalle/detalle.component/detalle.component';
import { DevolucionComponent } from './pages/devolucion/devolucion.component/devolucion.component';
import { PagoComponent } from './pages/devolucion/pago.component/pago.component';

export const routes: Routes = [
    {path: '', redirectTo: '/libro', pathMatch: 'full' },
    {path:'usuario',component:Usuario},
    {path: 'libro', component: Libro },
    {path:'reporte',component:Reporte},
    {path:'dashboard',component:Dashboard},
    {path:'detalle',component:DetalleComponent},
    {path:'devolucion',component:DevolucionComponent},
    {path:'pago',component:PagoComponent}
];
