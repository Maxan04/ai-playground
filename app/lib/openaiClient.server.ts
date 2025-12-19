import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {

    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY är inte satt. Appen kommer att falla tillbaka till mock-svar.");
    
        return null;
    }

    if (!openaiInstance) {
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    return openaiInstance;
}

