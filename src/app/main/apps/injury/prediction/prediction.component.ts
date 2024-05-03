import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { ServiceInjury } from '../service-injury.service';
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent  {
  @ViewChild('barChart') private chartRef;
  chart: any;
  position = '';
  team = '';
  nationality = '';
  age = '';
  prediction: number;

  constructor(private predictionService: ServiceInjury) { }

  predict() {
    this.predictionService.predict(Number(this.age), this.position, this.team, this.nationality).subscribe((result: any) => {
      this.prediction = result.prediction;
      this.updateChart();
    });
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Position', 'Équipe', 'Nationalité', 'Âge'],
        datasets: [{
          label: '# de joueurs',
          data: [0, 0, 0, 0], // Initialiser à zéro
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  updateChart() {
    // Mettre à jour les données du graphique avec la prédiction
    this.chart.data.datasets[0].data = [this.prediction, this.prediction, this.prediction, this.prediction];
    this.chart.update();
  }

}
