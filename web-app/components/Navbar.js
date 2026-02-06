"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <Link href="/" className="nav-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">Mentality-AI</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
            Chat
          </Link>
          <Link href="/visualize" className={`nav-link ${isActive('/visualize') ? 'active' : ''}`}>
            Visualization
          </Link>
          <Link href="/insights" className={`nav-link ${isActive('/insights') ? 'active' : ''}`}>
            Insights
          </Link>
          <Link href="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
            Settings
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 1rem;
          margin: 0 1rem;
          z-index: 1000;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 17, 21, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo));
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-link.active {
          color: white;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo));
          border-radius: 2px;
        }
      `}</style>
    </nav>
  );
}
