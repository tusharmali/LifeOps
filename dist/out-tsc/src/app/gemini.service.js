import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let GeminiService = class GeminiService {
    constructor(http) {
        this.http = http;
        // Function URL from deployment
        this.functionUrl = 'https://us-central1-lifeops-73921.cloudfunctions.net/getRecommendation';
    }
    orchestrateLifeOps(energy, time) {
        return this.http.post(this.functionUrl, {
            energyInput: energy,
            timeInput: time
        });
    }
};
GeminiService = __decorate([
    Injectable({ providedIn: 'root' })
], GeminiService);
export { GeminiService };
//# sourceMappingURL=gemini.service.js.map