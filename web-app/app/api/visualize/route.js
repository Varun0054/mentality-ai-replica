import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const apiKey = process.env.STABILITY_API_KEY;
        console.log("Using Stability AI Key (prefix):", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Configuration Error", details: "Stability AI API Key is missing." },
                { status: 501 }
            );
        }

        console.log("Generating image with Stability AI (SDXL) for prompt:", prompt);

        // Usage of Stable Diffusion XL 1.0
        const engineId = "stable-diffusion-xl-1024-v1-0";
        const url = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: prompt,
                        weight: 1,
                    },
                ],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
            }),
        });

        const result = await response.json();
        // console.log("Stability AI Raw Response:", JSON.stringify(result, null, 2));

        if (!response.ok) {
            const errorMessage = result.message || `Stability API request failed: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        let imageUrl = null;

        if (result.artifacts && result.artifacts.length > 0) {
            const image = result.artifacts[0];
            // Stability returns base64 string
            imageUrl = `data:image/png;base64,${image.base64}`;
        }

        if (!imageUrl) {
            console.error("No image found in Stability response:", result);
            throw new Error("No image data found in the API response.");
        }

        return NextResponse.json({ imageUrl: imageUrl, rawResponse: result });

    } catch (error) {
        console.error("Image Generation Error:", error);
        return NextResponse.json(
            { error: "Image Generation Failed", details: `Stability AI API Error: ${error.message}` },
            { status: 500 }
        );
    }
}
