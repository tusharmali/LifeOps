import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
let GeminiService = class GeminiService {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
    }
    async orchestrateLifeOps(energy, time, goal, mood) {
        const model = 'gemini-2.5-flash';
        const prompt = `
      You are the LifeOps AI Orchestrator. Your goal is to process user life-context and provide high-confidence, actionable advice.

      Rules:
      1. ALWAYS return valid JSON. No conversational filler.
      2. Follow the 4-Agent pipeline logic internally:
         - Agent 1 (Summarizer): Create a coherent overview of energy/time/mood.
         - Agent 2 (Scorer): Evaluate the state (Focus, Recovery, Productivity, Well-being).
         - Agent 3 (Optimizer): Identify the single best action and alternatives.
         - Agent 4 (Explainer): Explain the trade-offs and reasoning.
      3. Use a tone that is empathetic but data-driven.
      4. Ensure recommendations are practical (e.g., "10-minute breathwork" or "Deep work on Module 1" rather than "Be productive").

      User Input Data:
      - Energy Level: "${energy}"
      - Time Available: "${time}"
      - Current Goal: "${goal}"
      - Current Mood: "${mood}"

      Output Format (JSON Only):
      {
        "summary": ["bullet point 1", "bullet point 2", "bullet point 3"],
        "scores": {
          "focus": number (0.0 to 1.0),
          "recovery": number (0.0 to 1.0),
          "productivity": number (0.0 to 1.0),
          "wellBeing": number (0.0 to 1.0)
        },
        "recommendation": {
          "action": "String describing the primary recommended action",
          "alternatives": ["Alternative action 1", "Alternative action 2"],
          "confidenceScore": number (0.0 to 1.0)
        },
        "explanation": "String explaining the recommendation (max 80 words)."
      }
    `;
        try {
            const response = await this.ai.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json'
                }
            });
            const text = response.text;
            if (!text) {
                throw new Error('No response from Gemini');
            }
            return JSON.parse(text);
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }
};
GeminiService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GeminiService);
export { GeminiService };
//# sourceMappingURL=gemini.service.js.map