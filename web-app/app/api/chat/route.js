import { NextResponse } from "next/server";
import { OpenRouter } from "@openrouter/sdk";

export async function POST(req) {
    try {
        const { message } = await req.json();

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("Missing OPENROUTER_API_KEY in environment variables.");
            return NextResponse.json(
                { error: "Configuration Error", details: "OpenRouter API Key is missing. Please check .env.local." },
                { status: 501 }
            );
        }

        const openrouter = new OpenRouter({
            apiKey: apiKey,
        });

        const systemPrompt = `You are Mentality AI, a compassionate mental health companion. 
    Your sole purpose is to provide support, listening, and helpful tips for users experiencing sadness, depression, anxiety, or suicidal thoughts. 
    You must NOT engage in generic casual conversation (like sports, coding, trivial facts, math, general knowledge) unless it directly relates to the user's mental well-being or they are using metaphors to describe their feelings. 
    If a user asks about unrelated topics, gently steer the conversation back to how they are feeling or their mental health. 
    Always be empathetic, non-judgmental, and encourage professional help for serious issues.
    Keep your responses concise, warm, and supportive.`;

        console.log("Processing request with message:", message);

        const completion = await openrouter.chat.send({
            model: "nvidia/nemotron-3-nano-30b-a3b:free",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
        });

        console.log("OpenRouter Response:", JSON.stringify(completion, null, 2));

        let responseText = completion.choices[0]?.message?.content;

        if (!responseText || responseText.trim() === "") {
            responseText = "I'm listening, but I'm having trouble finding the right words. Could you say that again?";
        }

        return NextResponse.json({ message: responseText });

    } catch (error) {
        console.error("OpenRouter API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
