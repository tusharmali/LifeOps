import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LifeOpsResponse {
  summary: string;
  score: string;
  optimized: string;
  html: string;
}

@Injectable({ providedIn: 'root' })
export class GeminiService {
  // Function URL from deployment
  private functionUrl = 'https://us-central1-lifeops-73921.cloudfunctions.net/getRecommendation';

  constructor(private http: HttpClient) {}

  orchestrateLifeOps(energy: string, time: string): Observable<LifeOpsResponse> {
    return this.http.post<LifeOpsResponse>(this.functionUrl, {
      energyInput: energy,
      timeInput: time
    });
  }
}
