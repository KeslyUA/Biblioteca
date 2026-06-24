import { Component,OnInit } from "@angular/core";
import { LibroService } from "../../services/libro";
import { libro } from "../../models/libro";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
    selector:'app-dashboard',
    templateUrl:'./dashboard.component.html',
    styleUrl:'./dashboard.component.css',
    standalone: true,
    imports:[
        
    ]
})

export class Dashboard implements OnInit{
    listaLibros:libro[] = [];
    topNombre:string[]=[]
    topCantidad:number[]= []
    topAutor:string[]=[]
     chart: any;


    constructor(private libroServise:LibroService){}

    ngOnInit():void{
        this.libroServise.obtenerLibros().subscribe(datos=>{ 
            
            this.listaLibros = datos;

            const librosOrdenados = [...this.listaLibros].sort((a, b) => b.vecesPrestado - a.vecesPrestado);
            const top5Libros = librosOrdenados.slice(0, 5);
            
            this.topNombre = top5Libros.map(l => l.nombreLibro);
            this.topCantidad=top5Libros.map(l =>l.vecesPrestado);
            this.topAutor=top5Libros.map(l => l.autor);

          this.GraficoBarras();
          this.GraficoCircular();
            
        })
        
    }
    GraficoBarras() {
        this.chart = new Chart('barChart', {
        type: 'bar',
            data: {
                labels: this.topNombre,
                datasets: [
                    {
                        label: 'Prestamos',
                        data: this.topCantidad,
                        backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    GraficoCircular() {
        this.chart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: this.topAutor,
                datasets: [
                    {
                    label: 'Veces Prestado',
                    data: this.topCantidad,
                    backgroundColor: [
                        '#093f85',
                        '#085a90',
                        '#0967a9',
                        '#1a86ec',
                        '#51bff6'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                    position: 'bottom'
                    },
                    title: {
                    display: true,
                    text: 'Autores mas solicitados'
                    }
                }
            }
        });
    }

}