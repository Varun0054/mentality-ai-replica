import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", textAlign: "center", color: "#2D3748", padding: "40px" }}>
        <div style={{ background: "linear-gradient(135deg, #E0F7FA 0%, #E6FFFA 100%)", padding: "60px", borderRadius: "20px", marginBottom: "40px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
          <h1 style={{ fontSize: "3.5em", fontWeight: "700", color: "#2C7A7B", marginBottom: "20px" }}>Welcome to Mentality Ai</h1>
          <p style={{ fontSize: "1.4em", color: "#4A5568", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
            Your peaceful mental health companion. We are here to listen, understand, and help you find your calm through advanced AI and serene visualizations.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "50px", flexWrap: "wrap" }}>
          <Link href="/chat" style={{ textDecoration: 'none' }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "300px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", transition: "transform 0.3s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🧠</div>
              <h3 style={{ color: "#2C7A7B", fontSize: "1.5em", marginBottom: "10px" }}>Empathic Chat</h3>
              <p style={{ color: "#718096", lineHeight: "1.5" }}>Express your thoughts freely. Our AI listens with empathy and understanding.</p>
            </div>
          </Link>

          <Link href="/visualize" style={{ textDecoration: 'none' }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "300px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", transition: "transform 0.3s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🎨</div>
              <h3 style={{ color: "#2C7A7B", fontSize: "1.5em", marginBottom: "10px" }}>Visual Serenity</h3>
              <p style={{ color: "#718096", lineHeight: "1.5" }}>Generate calming images based on your description to soothe your mind.</p>
            </div>
          </Link>

          <Link href="/chat" style={{ textDecoration: 'none' }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "300px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", transition: "transform 0.3s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🗣️</div>
              <h3 style={{ color: "#2C7A7B", fontSize: "1.5em", marginBottom: "10px" }}>Voice Interaction</h3>
              <p style={{ color: "#718096", lineHeight: "1.5" }}>Speak naturally to Mentality Ai. We listen to your voice.</p>
            </div>
          </Link>
        </div>

        <div style={{ backgroundColor: "#F7FAFC", padding: "40px", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <h2 style={{ color: "#2D3748", marginBottom: "30px", fontSize: "2em" }}>Meet the Creators</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", fontSize: "1.2em" }}>
            <div style={{ background: "white", padding: "15px 30px", borderRadius: "50px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "#2C7A7B", fontWeight: "600" }}>Varun Bhagwat</div>
            <div style={{ background: "white", padding: "15px 30px", borderRadius: "50px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "#2C7A7B", fontWeight: "600" }}>Arjun</div>
            <div style={{ background: "white", padding: "15px 30px", borderRadius: "50px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "#2C7A7B", fontWeight: "600" }}>Ishwar</div>
          </div>
          <p style={{ marginTop: "30px", color: "#718096" }}>
            <strong>Contact:</strong> <a href="mailto:varunbhagwat948@gmail.com" style={{ color: "#38B2AC", textDecoration: "none" }}>varunbhagwat948@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
