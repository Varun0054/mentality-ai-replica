"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "🏠 Home", path: "/" },
    { name: "💬 Chat", path: "/chat" },
    { name: "🎨 Visualization", path: "/visualize" },
    { name: "⚙️ Settings", path: "/settings" },
  ];

  return (
    <div style={{ padding: "0 1rem" }}>
      <div id="title-header" style={{ textAlign: "center", marginBottom: "20px", color: "#2C7A7B" }}>
        <h1 style={{ fontSize: "3em", fontWeight: "300", margin: "0" }}>🧠 Mentality Ai</h1>
        <p style={{ fontSize: "1.2em", color: "#718096" }}>Your peaceful mental health companion</p>
      </div>

      <nav className="nav-tabs" style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e5e7eb", marginBottom: "2rem" }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-tab ${pathname === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
