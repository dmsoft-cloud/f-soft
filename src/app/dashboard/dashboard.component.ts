import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StyleService } from '../utils/style.service';

type Label = string[]; 


@Component({
  selector: 'dms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private styleService: StyleService) {}

  ngOnInit(): void {
    this.styleService.updateHeight('160vh');
    this.createLineChart();
    this.createBarChart();
    this.createPieChart();
  }

  createLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Flows Inbound',
          data: [35, 79, 50, 61, 66, 75, 30],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        }, 
        {
          label: 'Flows Outbound',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgb(16, 94, 40)',
          borderWidth: 2
        }
      ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Flows last 6 month'
          }
        }
      }
    });
  }

  createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Error Outbound',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(255, 176, 102, 0.2)',
          borderColor: 'rgb(253, 147, 48)',
          borderWidth: 1
        },
        {
          label: 'Error Inbound',
          data: [45, 39, 20, 21, 36, 35, 10],
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Error last 6 month'
          }
        }
      }
    });
  }

  createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Assilea', 'Axa', 'Cardiff', 'Other'],
        datasets: [{
          label: 'Colori',
          data: [300, 50, 100, 30],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(243, 123, 107, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgb(69, 238, 173)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Flows distribution'
          }
        }
      }
    });
  }


}
