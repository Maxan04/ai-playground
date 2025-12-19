import type { Mode } from "./playgroundTypes";
import { mockPlayground } from "./mockPlayground";
import { getOpenAIClient } from "./openaiClient.server";

export async function runPlaygroundAI(mode: Mode, inputText: string): Promise<string> {

    const openai = getOpenAIClient();

    if (!openai) {
        return mockPlayground(mode, inputText);
    }
    
    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content:
                        `Du är en assistent för en marknadsförings-playground. Mode: ${mode}. ` +
                        `Svara på svenska och håll det relativt kortfattat.`,
                },
                {
                    role: "user",
                    content: inputText,
                },
            ],
        });

        const outputText = response.output_text;

        return outputText;

    } catch (error) {
        console.error("OpenAI error:", error);
        return "Ett fel uppstod när vi pratade med AI-tjänsten. Försök igen senare.";
    }
}