import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { message, flowId, apiKey } = await req.json();

        // Use provided keys or fall back to env vars / defaults
        // The user provided snippet has placeholders. We'll use env vars if not provided.
        const LANGFLOW_ID = flowId || process.env.LANGFLOW_FLOW_ID || "PASTE_YOUR_FLOW_ID";
        const LANGFLOW_API_KEY = apiKey || process.env.LANGFLOW_API_KEY || "PASTE_YOUR_LANGFLOW_API_KEY";
        // Use 127.0.0.1 to avoid resolution issues with Node.js fetch
        const LANGFLOW_URL = `http://127.0.0.1:7860/api/v1/run/${LANGFLOW_ID}`;

        console.log("Processing Langflow request:", { message, flowId: LANGFLOW_ID, url: LANGFLOW_URL });

        const payload = {
            "input_value": message,
            "output_type": "chat",
            "input_type": "chat"
        };

        const response = await fetch(LANGFLOW_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${LANGFLOW_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Langflow Error:", response.status, errorText);
            throw new Error(`Langflow API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Extract the text based on the python snippet structure:
        // data["outputs"][0]["outputs"][0]["results"]["message"]["text"]
        let botResponse = "No response from Langflow.";
        try {
            botResponse = data["outputs"][0]["outputs"][0]["results"]["message"]["text"];
        } catch (e) {
            console.error("Error parsing Langflow response structure:", e);
            botResponse = "Error parsing Langflow response.";
        }

        return NextResponse.json({ message: botResponse });

    } catch (error) {
        console.error("Langflow Route Error:", error);
        if (error.cause) console.error("Error Cause:", error.cause);

        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
