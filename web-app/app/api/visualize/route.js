import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const apiKey = process.env.OPENROUTER_IMAGE_KEY;
        console.log("Using Image Key (prefix):", apiKey ? apiKey.substring(0, 15) + "..." : "undefined");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Configuration Error", details: "OpenRouter Image Key is missing." },
                { status: 501 }
            );
        }

        console.log("Generating image for prompt (using raw fetch):", prompt);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "bytedance-seed/seedream-4.5",
                messages: [
                    { role: "user", content: prompt }
                ],
                modalities: ["image", "text"]
            })
        });

        const completion = await response.json();
        console.log("OpenRouter Raw Response:", JSON.stringify(completion, null, 2));

        if (!response.ok) {
            throw new Error(completion.error?.message || "OpenRouter API request failed");
        }

        const message = completion.choices[0]?.message;
        let imageUrl = null;

        // Check for images in the message (non-standard field)
        if (message.images && message.images.length > 0) {
            imageUrl = message.images[0].url || message.images[0].image_url?.url;
        }

        // If still no image, check content for markdown image
        if (!imageUrl && message.content) {
            const match = message.content.match(/\((https?:\/\/.*?)\)/) || message.content.match(/(https?:\/\/[^\s]+)/);
            if (match) {
                imageUrl = match[1];
            }
        }

        return NextResponse.json({ imageUrl: imageUrl, rawResponse: completion });

    } catch (error) {
        console.error("Image Generation Error:", error);
        return NextResponse.json(
            { error: "Image Generation Failed", details: `OpenRouter API Error: ${error.message}` },
            { status: 500 }
        );
    }
}
