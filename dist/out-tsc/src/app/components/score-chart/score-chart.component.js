import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ScoreChartComponent = class ScoreChartComponent {
    constructor(geminiService) {
        this.geminiService = geminiService;
        this.energy = '50';
        this.time = '';
        this.result = null;
        this.loading = false;
        this.error = '';
    }
    getPlan() {
        this.loading = true;
        this.error = '';
        this.result = null;
        this.geminiService.orchestrateLifeOps(this.energy, this.time)
            .subscribe({
            next: (res) => {
                this.result = res;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = err.message || 'An error occurred';
                this.loading = false;
            }
        });
    }
};
ScoreChartComponent = __decorate([
    Component({
        selector: 'app-score-chart',
        standalone: true,
        imports: [CommonModule, FormsModule],
        template: `
    <div class="container">
      <h2>LifeOps Dashboard</h2>
      
      <div class="controls">
        <label>
          Energy Level: {{ energy }}
          <input type="range" [(ngModel)]="energy" min="0" max="100">
        </label>
        
        <label>
          Time Available:
          <input type="text" [(ngModel)]="time" placeholder="e.g., 2 hours">
        </label>
        
        <button (click)="getPlan()" [disabled]="loading">Generate Plan</button>
      </div>

      <div *ngIf="loading">Processing...</div>

      <div *ngIf="result" class="results">
        <h3>Summary</h3>
        <p>{{ result.summary }}</p>
        
        <h3>Recommendation</h3>
        <div [innerHTML]="result.html"></div>
        
        <details>
          <summary>Debug Info</summary>
          <pre>{{ result | json }}</pre>
        </details>
      </div>
      
      <div *ngIf="error" class="error">
        Error: {{ error }}
      </div>
    </div>
  `,
        styles: [`
    .container { max-width: 800px; margin: 0 auto; }
    .controls { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
    button { padding: 10px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; }
    button:disabled { background: #ccc; }
    .error { color: red; }
    .results { border-top: 2px solid #eee; padding-top: 20px; }
  `]
    })
], ScoreChartComponent);
export { ScoreChartComponent };
//# sourceMappingURL=score-chart.component.js.map