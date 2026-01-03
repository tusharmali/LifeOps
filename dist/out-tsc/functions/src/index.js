/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = defineSecret("GEMINI_API_KEY");
// Initialize Gemini function helper
const getGenAI = (key) => {
    return new GoogleGenerativeAI(key);
};
// Prompts
const PROMPTS = {
    summarizer: `You are an expert summarizer, tasked with creating a coherent and holistic overview of a user's energy consumption and time allocation. Your summary should combine the provided 'energy_input' and 'time_input' to effectively convey the interplay between these two aspects.
# Step by Step instructions
1. Read the provided Energy Input and Time Input carefully.
2. Write a sentence or two that combines aspects of both the Energy Input and Time Input to begin building a holistic overview.
3. Review the summary written so far. Does it coherently combine both the Energy Input and Time Input to provide a holistic overview? If not, go back to step 2 and add or refine sentences to improve the summary's coherence and completeness, ensuring it effectively conveys the interplay between energy consumption and time allocation.
4. Once the summary effectively combines both inputs into a holistic overview, output the complete summary.

IMPORTANT NOTE: Start directly with the output, do not output any delimiters.
Output:
`,
    scorer: `You are an expert evaluator, tasked with meticulously assessing the effectiveness and efficiency of the provided 'Summarizer' output. Your evaluation should be based on how well the summary combines and represents the energy and time information.
# Step by Step instructions
1. Read the provided Summarizer output carefully.
2. Evaluate the Summarizer output for its effectiveness in combining the energy and time information.
3. Evaluate the Summarizer output for its efficiency in representing the combined energy and time information.
4. Based on the evaluation of effectiveness and efficiency, assign a score or provide a qualitative assessment.
5. Output the score or assessment of the Summarizer output.

IMPORTANT NOTE: Start directly with the output, do not output any delimiters.
Output:
`,
    optimizer: `You are an expert in optimizing personal productivity and well-being, specializing in energy and time management. Your role is to generate an optimized output based on the provided \`Scorer\` output, which includes a summary and its score. This output should provide actionable insights or improved suggestions related to energy and time management, leveraging the combined information to offer practical and effective guidance.
# Step by Step instructions
1. Carefully analyze the provided Scorer output, which includes the summary of energy and time inputs and its corresponding score.
2. Based on the Scorer output, identify key areas for improvement or optimization in energy and time management.
3. Formulate a few actionable insights or improved suggestions related to energy and time management, incorporating the summary and its score.
4. After generating a few insights or suggestions, review them to ensure they are practical, effective, and directly address the information in the Scorer output. If the insights or suggestions are not satisfactory, go back to step 3 to refine them.
5. Combine the insights and suggestions into a coherent and optimized output, ensuring clarity and conciseness.

IMPORTANT NOTE: Start directly with the output, do not output any delimiters.
Output:
`,
    htmlGenerator: `Generate a static HTML webpage. The webpage should display an optimized summary to the user. The layout should be clean and user-friendly, with the summary prominently featured. The page should be responsive and adapt well to different screen sizes. The content should be presented clearly and concisely, making it easy for the user to understand the optimized information.
`
};
export const getRecommendation = onRequest({ cors: true, secrets: [apiKey] }, async (request, response) => {
    try {
        const key = apiKey.value();
        if (!key) {
            logger.error("API_KEY secret not found");
            response.status(500).send("Server configuration error");
            return;
        }
        const genAI = getGenAI(key);
        const modelName = "gemini-pro";
        const model = genAI.getGenerativeModel({ model: modelName });
        logger.info(`Initialized Gemini with model: ${modelName}`);
        const energyInput = request.body.energyInput || request.query.energyInput;
        const timeInput = request.body.timeInput || request.query.timeInput;
        if (!energyInput || !timeInput) {
            response.status(400).send("Missing energyInput or timeInput");
            return;
        }
        logger.info("Starting recommendation chain with model: gemini-1.5-flash-001", { energyInput, timeInput });
        // Step 1: Summarizer
        const summaryPrompt = `${PROMPTS.summarizer}

Energy Input:
"""
${energyInput}
"""
Time Input:
"""
${timeInput}
"""`;
        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryOutput = summaryResult.response.text();
        logger.info("Summarizer Output", { summaryOutput });
        // Step 2: Scorer
        const scorerPrompt = `${PROMPTS.scorer}

Summarizer:
"""
${summaryOutput}
"""`;
        const scorerResult = await model.generateContent(scorerPrompt);
        const scorerOutput = scorerResult.response.text();
        logger.info("Scorer Output", { scorerOutput });
        // Step 3: Optimizer
        const optimizerPrompt = `${PROMPTS.optimizer}

Scorer:
"""
${scorerOutput}
"""`;
        const optimizerResult = await model.generateContent(optimizerPrompt);
        const optimizerOutput = optimizerResult.response.text();
        logger.info("Optimizer Output", { optimizerOutput });
        // Step 4: HTML Generator
        const htmlPrompt = `${PROMPTS.htmlGenerator}

Optimizer:
"""
${optimizerOutput}
"""`;
        const htmlResult = await model.generateContent(htmlPrompt);
        const htmlOutput = htmlResult.response.text();
        response.json({
            summary: summaryOutput,
            score: scorerOutput,
            optimized: optimizerOutput,
            html: htmlOutput
        });
    }
    catch (error) {
        logger.error("Error in getRecommendation", error);
        response.status(500).send("Internal Server Error: " + error);
    }
});
//# sourceMappingURL=index.js.map