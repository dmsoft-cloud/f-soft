import { Component } from '@angular/core';
import { ChartType } from 'chart.js';

type Label = string[]; 
type MultiDataSet = number[][]; 

@Component({
  selector: 'dms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


 // Bar Chart
 public barChartOptions = { responsive: true };
 public barChartLabels: Label = ['2018', '2023'];
 public barChartType: ChartType = 'bar';
 public barChartData = [{ data: [8000, 6000], label: 'Revenue Added to Pipeline' }];

 // Line Chart
 public lineChartType: ChartType = 'line';
 public lineChartData = [{ data: [30, 20], label: 'Deals Created' }];

 // Pie Chart
 public pieChartLabels: Label = ['Opportunities', 'Lead'];
 public pieChartData: MultiDataSet = [[39.8, 36.9]];
 public pieChartType: ChartType = 'pie';
}
