
import YouTubeSubscribe from "./components/YouTubeSubscribe";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">▶</span>
          <span>Marbz<span className="brand-accent">Tube</span></span>
        </a>

        <span className="nav-label">OFFICIAL CHANNEL</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow" />

          <div className="channel-avatar">
            <span>M</span>
            <span className="avatar-dot">▶</span>
          </div>

          <p className="eyebrow">WELCOME TO MY CHANNEL</p>

          <h1>
            Stay connected.
            <br />
            <span>Subscribe to Marbz.</span>
          </h1>

          <p className="description">
            Join the community and stay updated with new videos,
            entertainment, and fresh content.
          </p>

          <div className="subscribe-area">
            <YouTubeSubscribe />
            <p className="privacy-note">
              <span className="status-dot" />
              Secure authorization through Google
            </p>
          </div>

          <div className="channel-id">
            <span>YOUTUBE CHANNEL</span>
            <code>UC9ybIb8ZWZ6vQ4dnIuzIKMQ</code>
          </div>
        </section>

        <section className="steps-section">
          <h2>Join the community</h2>
          <div className="steps">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Click Subscribe</h3>
              <p>Start from the button above.</p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Authorize Google</h3>
              <p>Sign in and grant permission when asked.</p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Get connected</h3>
              <p>Your subscription request is sent to YouTube.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} MarbzTube</span>
        <span>Powered by YouTube</span>
      </footer>
    </div>
  );
}
