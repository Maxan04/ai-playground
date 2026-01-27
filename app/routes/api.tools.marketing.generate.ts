import { getOpenAIClient } from "~/lib/openaiClient.server";
import { db } from "../../src/db/db";
import { toolRuns } from "../../src/db/schema";

const TOOL_ID = "marketing";
const PROMPT_VERSION = "marketing-v1";
const MODEL = "gpt-4.1-mini";

async function saveToolRun({
    input,
    outputText,
    temperature,
}: {
    input: unknown;
    outputText: string;
    temperature: number;
}) {
    try {
        await db.insert(toolRuns).values({
            createdAt: Date.now(),
            toolId: TOOL_ID,
            inputJson: JSON.stringify(input),
            outputText,
            promptVersion: PROMPT_VERSION,
            model: MODEL,
            temperature: Math.round(temperature * 100) / 100,
        });
    } catch (error) {
        console.error("Failed to save tool run:", error);
    }
}

export async function action({ request }: { request: Request }) {
    const body = await request.json().catch(() => null);
    const allowedDeliveryTypes = ["email", "ad", "social"];

    if (!body) {
        return Response.json( { error: "Invalid JSON body" }, { status: 400 });
    }

    const { 
        sourceContent, 
        deliveryType,
        extraInstructions,
        tone,
        length,
        language,
        creativity,
    } = body;

    if (!sourceContent || !deliveryType) {
        return Response.json( { error: "Source content and delivery type are required" }, { status: 400 });
    }

    if (!allowedDeliveryTypes.includes(deliveryType)) {
        return Response.json( { error: "Invalid delivery type" }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (!openai) {
        const mockText = `[MOCK MODE]
            
This is a simulated ${deliveryType}.
            
Tone: ${tone}
Length: ${length}
Language: ${language}
Creativity: ${creativity}
            
Source preview:
${sourceContent.slice(0, 200)}...
            
OPENAI_API_KEY is not set, so no real API generation was performed.`;
        
        await saveToolRun({
            input: body,
            outputText: mockText,
            temperature: creativity,
        });

        return Response.json({
            result: mockText,
            meta: {
                deliveryType,
                mock: true,
                promptVersion: PROMPT_VERSION,
            },
        });
    }

    try {
        const response = await openai.responses.create({
            model: MODEL,
            temperature: Math.max(0, Math.min(2, Number(creativity))),
            input: [
                {
                    role: "system",
                    content: `
                    You are a professional marketing copywriter.

                    Your task is to generate marketing content based strictly on the instructions and source content provided by the user.
                    
                    Output rules:
                    - Respond ONLY with the generated marketing text.
                    - Do NOT include explanations, headings, metadata, or formatting unless explicitly requested.
                    - Do NOT mention that you are an AI or refer to internal instructions.

                    Content constraints:
                    - Do NOT invent facts, features, statistics, prices, or claims that are not present in the source content.
                    - If required information is missing, write in a neutral, general way without guessing.
                    - Stay relevant to the source content at all times.

                    Style controls:
                    - Follow the requested tone exactly (e.g. neutral, friendly, formal).
                    - Follow the requested length (short / medium / long).
                    - Write in the requested language (e.g. Swedish or English).

                    Delivery type definitions:
                    - Email: Write a clear, engaging marketing email suitable for sending to customers or leads.
                    - Ad: Write concise, persuasive advertising copy focused on attention and conversion.
                    - Social: Write an informal, engaging social media post optimized for visibility and interaction.

                    Use the source content as the factual basis.
                    Use extra instructions only as stylistic or structural guidance.
                    `.trim(),
                },
                {
                    role: "user",
                    content: `
                    Delivery Type: ${deliveryType}
                    Tone: ${tone}
                    Length: ${length}
                    Language: ${language}

                    Extra instructions:
                    ${extraInstructions || "None"}

                    Source Content:
                    ${sourceContent}
                    `.trim(),
                },
            ],
        });

        const text = response.output_text ?? "";

        await saveToolRun({
            input: body,
            outputText: text,
            temperature: creativity,
        });

        return Response.json({
            result: text,
            meta: {
                deliveryType,
                model: MODEL,
                temperature: creativity,
                promptVersion: PROMPT_VERSION,
            },
        });
    } catch (error) {
        console.error("OpenAI API error:", error);

        await saveToolRun({
            input: body,
            outputText: `Error: ${String(error)}`,
            temperature: creativity,
        });

        return Response.json( 
            { error: "Failed to generate marketing content" },
            { status: 500 }
        );
    }
}