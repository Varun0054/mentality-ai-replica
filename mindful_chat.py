import requests
import speech_recognition as sr
import pyttsx3
from PIL import Image
import gradio as gr
import threading
import queue
import time
import pythoncom  # Required for COM threading on Windows

# ================= CONFIG =================
LANGFLOW_API_KEY = "sk-NhQUJO4U67Q3ELoNudtOFB7zMEh4aKV1ED17B4K0x7s"
LANGFLOW_URL = "http://localhost:7860/api/v1/run/256c8204-b360-449c-a3f9-fd1437594502"
# ==========================================

# ================= TTS ENGINE =================
tts_queue = queue.Queue()

def tts_worker():
    """Worker thread that handles TTS queue items sequentially."""
    try:
        # Initialize COM library for this thread
        pythoncom.CoInitialize()
        
        engine = pyttsx3.init()
        while True:
            text = tts_queue.get()
            if text is None: 
                break
            try:
                print(f"🔹 AI Speaking: {text}")
                engine.say(text)
                engine.runAndWait()
            except Exception as e:
                print(f"TTS Error in worker: {e}")
                # Try to re-init engine on error
                try:
                    engine = pyttsx3.init()
                except:
                    pass
            finally:
                tts_queue.task_done()
    except Exception as e:
        print(f"Failed to initialize TTS engine in worker: {e}")
    finally:
        pythoncom.CoUninitialize()

# Start TTS Worker
tts_thread = threading.Thread(target=tts_worker, daemon=True)
tts_thread.start()

def speak(text):
    if text:
        tts_queue.put(text)
# ===============================================

# Voice Input with better error handling
def listen():
    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("🎤 Listening...")
            r.adjust_for_ambient_noise(source, duration=0.5)
            audio = r.listen(source, timeout=4, phrase_time_limit=8)
        text = r.recognize_google(audio)
        print(f"Recognized: {text}")
        return text
    except sr.WaitTimeoutError:
        print("Listening timed out")
        return ""
    except sr.UnknownValueError:
        print("Could not understand audio")
        return ""
    except Exception as e:
        print(f"Mic Error: {e}")
        return ""

def call_langflow(message):
    payload = {
        "input_value": message,
        "input_type": "chat",
        "output_type": "chat"
    }
    headers = {
        "Content-Type": "application/json",
        "x-api-key": LANGFLOW_API_KEY
    }
    try:
        print(f"Sending to Langflow: {message}")
        response = requests.post(LANGFLOW_URL, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            outputs = data.get("outputs", [])
            if outputs:
                first_output = outputs[0].get("outputs", [])
                if first_output:
                    results = first_output[0].get("results", {})
                    message_data = results.get("message", {})
                    response_text = message_data.get("text", "")
                    if response_text:
                        return response_text
            return "I heard you, but I'm having trouble thinking of a response."
        else:
            return f"My brain is unreachable currently (Status {response.status_code})."
    except Exception as e:
        print(f"API Connection Error: {e}")
        return "I am having trouble connecting to the server."

def generate_image(prompt):
    print(f"Generating image for: {prompt}")
    img = Image.new("RGB", (512, 512), color="#E0F7FA")
    return img

def mental_ai_chat(user_input, history, mode="text"):
    response = ""
    img = None
    
    # Handle Voice Mode
    if mode == "voice" or (user_input is None or user_input.strip() == ""):
        voice_text = listen()
        if voice_text:
            user_input = voice_text
        else:
             if mode == "voice":
                 return history, None, ""
             if not user_input:
                 return history, None, ""

    print("You:", user_input)

    # Keywords
    if "exit" in user_input.lower():
        response = "Goodbye! Take care of yourself."
    elif "generate image" in user_input.lower():
        img = generate_image(user_input)
        response = "I've created an image for you. Check the Visualization tab!"
    else:
        response = call_langflow(user_input)
    
    # Send to TTS queue
    speak(response)
    
    # Update history with Dictionary format for Gradio 6.0
    new_history = history + [
        {"role": "user", "content": user_input},
        {"role": "assistant", "content": response}
    ]
    
    return new_history, img, ""

def manual_generate_image(prompt):
    return generate_image(prompt)

custom_css = """
body { background-color: #f0f8ff; }
.gradio-container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
#title-header { text-align: center; margin-bottom: 20px; color: #2C7A7B; }
#chat-window { min-height: 400px; background-color: #ffffff; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.message { border-radius: 15px !important; }
"""

theme = gr.themes.Soft(
    primary_hue="teal",
    secondary_hue="cyan",
    neutral_hue="slate",
    text_size="lg"
)

with gr.Blocks(title="Mentality Ai", theme=theme, css=custom_css) as demo:
    gr.HTML("""
        <div id="title-header">
            <h1 style="font-size: 3em; font-weight: 300; margin: 0;">🧠 Mentality Ai</h1>
            <p style="font-size: 1.2em; color: #718096;">Your peaceful mental health companion</p>
        </div>
    """)
    
    with gr.Tabs():
        with gr.TabItem("🏠 Home"):
            gr.HTML("""
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; text-align: center; color: #2D3748; padding: 40px;">
                <div style="background: linear-gradient(135deg, #E0F7FA 0%, #E6FFFA 100%); padding: 60px; border-radius: 20px; margin-bottom: 40px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <h1 style="font-size: 3.5em; font-weight: 700; color: #2C7A7B; margin-bottom: 20px;">Welcome to Mentality Ai</h1>
                    <p style="font-size: 1.4em; color: #4A5568; max-width: 800px; margin: 0 auto; line-height: 1.6;">
                        Your peaceful mental health companion. We are here to listen, understand, and help you find your calm through advanced AI and serene visualizations.
                    </p>
                </div>

                <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 50px; flex-wrap: wrap;">
                    <div style="background: white; padding: 30px; border-radius: 15px; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
                        <div style="font-size: 3em; margin-bottom: 15px;">🧠</div>
                        <h3 style="color: #2C7A7B; font-size: 1.5em; margin-bottom: 10px;">Empathic Chat</h3>
                        <p style="color: #718096; line-height: 1.5;">Express your thoughts freely. Our AI listens with empathy and understanding.</p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 15px; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
                        <div style="font-size: 3em; margin-bottom: 15px;">🎨</div>
                        <h3 style="color: #2C7A7B; font-size: 1.5em; margin-bottom: 10px;">Visual Serenity</h3>
                        <p style="color: #718096; line-height: 1.5;">Generate calming images based on your description to soothe your mind.</p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 15px; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
                        <div style="font-size: 3em; margin-bottom: 15px;">🗣️</div>
                        <h3 style="color: #2C7A7B; font-size: 1.5em; margin-bottom: 10px;">Voice Interaction</h3>
                        <p style="color: #718096; line-height: 1.5;">Speak naturally to Mentality Ai. We listen to your voice.</p>
                    </div>
                </div>

                <div style="background-color: #F7FAFC; padding: 40px; border-radius: 20px; border: 1px solid #E2E8F0;">
                    <h2 style="color: #2D3748; margin-bottom: 30px; font-size: 2em;">Meet the Creators</h2>
                    <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; font-size: 1.2em;">
                        <div style="background: white; padding: 15px 30px; border-radius: 50px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #2C7A7B; font-weight: 600;">Varun Bhagwat</div>
                        <div style="background: white; padding: 15px 30px; border-radius: 50px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #2C7A7B; font-weight: 600;">Arjun</div>
                        <div style="background: white; padding: 15px 30px; border-radius: 50px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #2C7A7B; font-weight: 600;">Ishwar</div>
                    </div>
                    <p style="margin-top: 30px; color: #718096;">
                        <strong>Contact:</strong> <a href="mailto:varunbhagwat948@gmail.com" style="color: #38B2AC; text-decoration: none;">varunbhagwat948@gmail.com</a>
                    </p>
                </div>
            </div>
            """)

        with gr.TabItem("💬 Chat"):
             with gr.Row():
                with gr.Column():
                    chatbot = gr.Chatbot(
                        label="Conversation",
                        elem_id="chat-window",
                        avatar_images=(None, "https://api.iconify.design/noto:brain.svg"),
                        height=500
                    )
                    
                    with gr.Row():
                        msg_input = gr.Textbox(
                            show_label=False, 
                            placeholder="Type your thoughts here...",
                            container=False,
                            scale=4
                        )
                        voice_btn = gr.Button("🎤 Speak", variant="secondary", scale=1)
                        submit_btn = gr.Button("Send", variant="primary", scale=1)

        with gr.TabItem("🎨 Visualization"):
            gr.Markdown("### Visual Serenity")
            with gr.Row():
                with gr.Column():
                    viz_prompt = gr.Textbox(label="Describe a peaceful scene...", placeholder="A calm blue ocean at sunset")
                    viz_btn = gr.Button("Generate Visualization", variant="primary")
                with gr.Column():
                    image_output = gr.Image(label="Generated Image", type="pil", interactive=False)

    # Event handling
    submit_btn.click(
        fn=mental_ai_chat, 
        inputs=[msg_input, chatbot, gr.State("text")], 
        outputs=[chatbot, image_output, msg_input]
    )

    msg_input.submit(
        fn=mental_ai_chat, 
        inputs=[msg_input, chatbot, gr.State("text")], 
        outputs=[chatbot, image_output, msg_input]
    )

    voice_btn.click(
        fn=mental_ai_chat, 
        inputs=[gr.State(""), chatbot, gr.State("voice")], 
        outputs=[chatbot, image_output, msg_input]
    )

    viz_btn.click(
        fn=manual_generate_image,
        inputs=[viz_prompt],
        outputs=[image_output]
    )

if __name__ == "__main__":
    demo.launch(theme=theme, css=custom_css, server_port=7880)
