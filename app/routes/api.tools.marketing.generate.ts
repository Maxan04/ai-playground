import { getOpenAIClient } from "~/lib/openaiClient.server";

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
        return Response.json({
            result: `[MOCK MODE]
            
This is a simulated ${deliveryType}.
            
Tone: ${tone}
Length: ${length}
Language: ${language}
Creativity: ${creativity}
            
Source preview:
${sourceContent.slice(0, 200)}...
            
OPENAI_API_KEY is not set, so no real API generation was performed.`,
            meta: {
                deliveryType,
                mock: true,
            },
        });
    }

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            temperature: Math.max(Math.min(2, Number(creativity))),
            input: [
                {
                    role: "system",
                    content: `
                    You are a professional marketing copywriter.

                    Your task is to generate marketing content based strictly on the instructions and source content by the user.
                    
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
                    - Write in the requested language (e.g. Swedish or English,).

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

        return Response.json({
            result: text,
            meta: {
                deliveryType,
                model: "gpt-4.1-mini",
                temperature: creativity,
            },
        });
    } catch (error) {
        console.error("OpenAI API error:", error);

        return Response.json( 
            { error: "Failed to generate marketing content" },
            { status: 500 }
        );
    }
}