import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, LifeOpsResponse } from '../../gemini.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-score-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-card">
      <header class="header">
        <div class="logo-area">
          <div class="logo-icon">✨</div>
          <h1>LifeOps</h1>
        </div>
        <p class="subtitle">Optimize your energy & time</p>
      </header>
      
      <div class="controls-section">
        <div class="input-group">
          <label for="energy-slider">
            Energy Level <span class="value-badge">{{ energy }}%</span>
          </label>
          <div class="slider-container">
            <span class="icon">⚡</span>
            <input 
              id="energy-slider"
              type="range" 
              [(ngModel)]="energy" 
              min="0" 
              max="100" 
              class="modern-slider"
            >
          </div>
        </div>
        
        <div class="input-group">
          <label for="time-input">Time Available</label>
          <div class="input-wrapper">
            <span class="icon">⏰</span>
            <input 
              id="time-input"
              type="text" 
              [(ngModel)]="time" 
              placeholder="e.g., 2 hours" 
              class="modern-input"
            >
          </div>
        </div>
        
        <button (click)="getPlan()" [disabled]="loading" class="generate-btn">
          <span *ngIf="!loading">Generate Plan 🚀</span>
          <span *ngIf="loading" class="loader"></span>
        </button>
      </div>

      <div *ngIf="result" class="results-section fade-in">
        <div class="summary-card">
          <h3>💡 Summary</h3>
          <p>{{ result.summary }}</p>
        </div>
        
        <div class="recommendation-content">
          <h3>📋 Customized Plan</h3>
          <div [innerHTML]="sanitizedHtml" class="markdown-body"></div>
        </div>
      </div>
      
      <div *ngIf="error" class="error-message fade-in">
        ⚠️ {{ error }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      padding: 20px;
    }

    .dashboard-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
      padding: 40px;
      transition: all 0.3s ease;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 5px;
    }

    .logo-icon {
      font-size: 2rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1rem;
    }

    .controls-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .value-badge {
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .slider-container, .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .icon {
      position: absolute;
      left: 12px;
      z-index: 10;
      font-size: 1.1rem;
      pointer-events: none;
    }

    .modern-input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s;
      background: #f8fafc;
      font-family: inherit;
    }

    .modern-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      background: #fff;
    }

    .modern-slider {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 5px;
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .modern-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2563eb;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
      transition: transform 0.1s;
    }

    .modern-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }

    .generate-btn {
      margin-top: 10px;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .generate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    }

    .generate-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .generate-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .results-section {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      animation: fadeIn 0.5s ease-out;
    }

    .summary-card {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 20px;
      border-left: 4px solid #2563eb;
    }

    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 1rem;
      color: #334155;
    }

    .summary-card p {
      margin: 0;
      color: #475569;
      line-height: 1.5;
    }

    .recommendation-content h3 {
      color: #1e293b;
      margin-bottom: 15px;
    }

    /* Styles for dynamic content */
    .markdown-body ::ng-deep h1, .markdown-body ::ng-deep h2 {
      font-size: 1.25rem;
      color: #1e293b;
      margin-top: 1.5em;
    }
    
    .markdown-body ::ng-deep ul, .markdown-body ::ng-deep ol {
      padding-left: 20px;
      color: #475569;
    }

    .markdown-body ::ng-deep li {
      margin-bottom: 8px;
    }

    .error-message {
      margin-top: 20px;
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #ef4444;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ScoreChartComponent {
  energy = '50';
  time = '';
  result: LifeOpsResponse | null = null;
  loading = false;
  error = '';
  sanitizedHtml: SafeHtml = '';

  constructor(
    private geminiService: GeminiService,
    private sanitizer: DomSanitizer
  ) {}

  getPlan() {
    this.loading = true;
    this.error = '';
    this.result = null;
    
    this.geminiService.orchestrateLifeOps(this.energy, this.time)
      .subscribe({
        next: (res: LifeOpsResponse) => {
          this.result = res;
          // Clean the HTML from markdown code blocks if present
          const cleanHtml = this.cleanMarkdown(res.html);
          this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.error = err.message || 'An error occurred';
          this.loading = false;
        }
      });
  }

  private cleanMarkdown(text: string): string {
    if (!text) return '';
    // If text contains ```html block, extract just that part
    const match = text.match(/```html([\s\S]*?)```/);
    if (match && match[1]) {
      return match[1].trim();
    }
    // Fallback: remove markdown tags if they exist somewhat loosely
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}
