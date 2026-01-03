import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreChartComponent } from './components/score-chart/score-chart.component';
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'lifeops';
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [CommonModule, ScoreChartComponent],
        template: `
    <h1>LifeOps</h1>
    <app-score-chart></app-score-chart>
  `
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map