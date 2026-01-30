import { getOpenAIClient } from "~/lib/openaiClient.server";

export async function action({ request }: { request: Request }) {
    const body = await request.json().catch(() => null);

    if (!body) {
        return Response.json( { error: "Invalid JSON body" }, { status: 400 });
    }

    const { 
        customerEmail, 
        tone,
        language,
        companyInfo,
    } = body;

    if (!customerEmail) {
        return Response.json( { error: "Customer email is required" }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (!openai) {
        const mockReply = `[MOCK MODE]
        
Customer email:
${customerEmail.slice(0, 200)}...

Tone: ${tone}
Language: ${language}
        
Company info:
${companyInfo || "None"}
        
OPENAI_API_KEY is not set, so no real API generation was performed.`;

        return Response.json({
            result: mockReply,
            meta: {
                mock: true
            }
        });
    }

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: `
                    Goal:
                    You are a professional customer support agent writing email replies.

                    Constraints:
                    - Do NOT invent facts, policies, refunds, or promises.
                    - Use ONLY the provided company info.
                    - If information is missing, respond politely and generically.
                    - Do NOT mention you are an AI model.

                    Style:
                    - Follow the requested tone exactly.
                    - Write in the requested language.

                    Output:
                    - Write only the email reply text (no metadata, no explanations).
                    `.trim(),
                },
                {
                    role: "user",
                    content: `
Tone: ${tone}
Language: ${language}

Company info:
${companyInfo || "None"}

Customer email:
${customerEmail}
                    `.trim(),
                },
            ],
        });
        
        const reply = response.output_text ?? "";

        return Response.json({
            result: reply,
            meta: {
                mock: false
            }
        });
    } catch (error: any) {
        console.error("OpenAI API error:", error);

        return Response.json( { error: "Failed to generate email reply" }, { status: 500 });
    }
}
