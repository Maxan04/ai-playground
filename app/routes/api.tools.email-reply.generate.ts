import { getOpenAIClient } from "~/lib/openaiClient.server";

type EmailReplyResult = {
    subject: string;
    body: string;
};

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
        const mockResult: EmailReplyResult = {
            subject: "[MOCK] Re: Your Inquiry",
            body: `
[MOCK MODE]
        
Customer email:
${customerEmail.slice(0, 200)}...

Tone: ${tone}
Language: ${language}
        
Company info:
${companyInfo || "None"}
        
OPENAI_API_KEY is not set, so no real API generation was performed.
            `.trim(),
        };

        return Response.json({
            result: mockResult,
            meta: { mock: true },
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

                    Output format:
                    - Return structured JSON with:
                        - subject: a concise email subject line.
                        - body: the full email reply text.
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
            text: {
                format: {
                    type: "json_schema",
                    name: "email_reply",
                    schema: {
                        type: "object",
                        properties: {
                            subject: { type: "string" },
                            body: { type: "string" },
                        },
                        required: ["subject", "body"],
                        additionalProperties: false,
                    },
                },
            },
        });

        const message = response.output?.find(
            (item) => item.type === "message"
        );

        if (!message || message.type !== "message") {
            throw new Error("No message output returned from OpenAI");
        }

        const textContent = message.content.find(
            (c) => c.type === "output_text"
        );

        const rawText = textContent?.text;

        if (!rawText) {
            console.error("Full OpenAI response:", JSON.stringify(response, null, 2));
            throw new Error("No text output returned from OpenAI");
        }

        let parsed: EmailReplyResult;

        try {
            parsed = JSON.parse(rawText);
        } catch (err) {
            console.error("JSON parse failed:", rawText);
            throw new Error("Invalid JSON returned from OpenAI");
        }


        return Response.json({
            result: parsed,
            meta: { mock: false },
        });

    } catch (error: any) {
        console.error("OpenAI API error:", error);

        return Response.json( { error: "Failed to generate email reply" }, { status: 500 });
    }
}
