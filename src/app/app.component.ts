import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreChartComponent } from './components/score-chart/score-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScoreChartComponent],
  template: `
    <h1>LifeOps</h1>
    <app-score-chart></app-score-chart>
  `
})
export class AppComponent {
  title = 'lifeops';
}
