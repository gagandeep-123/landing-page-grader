
import { useState } from "react";
import "./App.css";

const categoryLabels = {
  conversionPath: "Conversion Path",
  messageClarity: "Message Clarity",
  trustAndProof: "Trust & Proof",
  performance: "Performance",
  contentHygiene: "Content Hygiene",
  friction: "User Friction",
};

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGrade = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to grade website.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const score = result?.grading?.score ?? 0;

  return (
    <main className="app">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">G</span>
          LandingPage<span>Grader</span>
        </div>
        <span className="nav-label">AI WEBSITE ANALYSIS</span>
      </nav>

      <section className="hero">
        <div className="tag">
          <span className="live-dot"></span>
          EVIDENCE-BASED WEBSITE GRADING
        </div>

        <h1>
          Is your landing page
          <span> built to convert?</span>
        </h1>

        <p>
          Enter any website URL. Get a detailed breakdown of its
          conversion experience, messaging, trust signals and performance.
        </p>

        <form className="url-box" onSubmit={handleGrade}>
          <span className="url-icon">↗</span>

          <input
            type="url"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading || !url.trim()}>
            {loading ? "Analyzing..." : "Grade my page →"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="hero-note">
          <span>✓</span> Live page analysis
          <span>✓</span> Performance data
          <span>✓</span> Evidence-backed scoring
        </div>
      </section>

      {loading && (
        <section className="loading-card">
          <div className="loader"></div>
          <h3>Analyzing your landing page</h3>
          <p>Fetching page content and measuring performance...</p>
        </section>
      )}

      {result && (
        <section className="results">
          <div className="report-heading">
            <div>
              <span className="section-label">YOUR REPORT</span>
              <h2>Landing Page Analysis</h2>
              <p className="report-url">{result.url}</p>
            </div>
            <span className="status-pill">Analysis complete</span>
          </div>

          <div className="overview-grid">
            <div className="main-score-card">
              <span className="card-label">OVERALL SCORE</span>

              <div className="score">
                {score}
                <span>/100</span>
              </div>

              <div className="score-track">
                <div
                  className="score-fill"
                  style={{ width: `${score}%` }}
                ></div>
              </div>

              <p>
                Based on observable page signals and measured performance.
              </p>
            </div>

            <div className="audience-card">
              <span className="card-label">DETECTED AUDIENCE</span>
              <div className="audience-icon">◎</div>

              <h3>
                {result.grading.audience.replace("-", " ")}
              </h3>

              <p>
                Scoring weights are adjusted for the detected audience.
              </p>

              <span className="audience-tag">Audience-adjusted rubric</span>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <span className="section-label">SCORING DETAILS</span>
              <h2>Where your page stands</h2>
            </div>
          </div>

          <div className="breakdown-grid">
            {Object.entries(result.grading.breakdown).map(
              ([category, points]) => {
                const maximum =
                  result.grading.categoryMaximums?.[category] ?? 0;

                const percentage =
                  maximum > 0 ? Math.min(100, (points / maximum) * 100) : 0;

                return (
                  <div className="category-card" key={category}>
                    <div className="category-top">
                      <span>{categoryLabels[category] || category}</span>
                      <strong>
                        {points}
                        <small> / {maximum.toFixed(0)}</small>
                      </strong>
                    </div>

                    <div className="category-track">
                      <div
                        className="category-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="section-heading">
            <div>
              <span className="section-label">WHY THIS SCORE?</span>
              <h2>Scoring evidence</h2>
              <p>Signals detected from the submitted page.</p>
            </div>
          </div>

          <div className="evidence-list">
            {result.grading.evidence.map((item, index) => (
              <div className="evidence-item" key={index}>
                <div className="evidence-indicator">
                  {item.points === null ? "–" : item.points < 0 ? "!" : "✓"}
                </div>

                <div className="evidence-content">
                  <strong>
                    {categoryLabels[item.category] || item.category}
                  </strong>
                  <p>{item.message}</p>
                  {item.detail && (
  <div className="evidence-detail">
    {item.detail}
  </div>
)}
                </div>

                <span className="evidence-points">
                  {item.points === null
                    ? "Not scored"
                    : `${item.points > 0 ? "+" : ""}${item.points} pts`}
                </span>
              </div>
            ))}

            {result.grading.evidence.length === 0 && (
              <p>No scoring evidence available.</p>
            )}
          </div>

          <div className="section-heading">
            <div>
              <span className="section-label">PAGE DETAILS</span>
              <h2>What we found</h2>
            </div>
          </div>

          <div className="info-card">
            <div>
              <span>PAGE TITLE</span>
              <p>{result.title || "Not found"}</p>
            </div>

            <div>
              <span>MAIN HEADING</span>
              <p>
                {result.h1Headings?.join(", ") || "Not found"}
              </p>
            </div>

            <div>
              <span>META DESCRIPTION</span>
              <p>{result.description || "Not found"}</p>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <span className="section-label">LIGHTHOUSE DATA</span>
              <h2>Technical performance</h2>
            </div>
          </div>

          {result.pagespeed?.available ? (
            <div className="performance-grid">
              {Object.entries(result.pagespeed.scores).map(
                ([metric, value]) => (
                  <div className="performance-card" key={metric}>
                    <span>{metric}</span>
                    <strong>{value}</strong>
                    <small>/100</small>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="muted">
              Performance data was unavailable for this analysis.
            </p>
          )}

          <button
            className="retry-button"
            onClick={() => {
              setResult(null);
              setUrl("");
              setError("");
            }}
          >
            Grade another page →
          </button>

          <p className="disclaimer">
            Scores represent observable page characteristics and
            performance measurements. They are not guaranteed conversion
            rates or causal predictions.
          </p>
        </section>
      )}

      <footer>
        Built for evidence-based landing page analysis.
      </footer>
    </main>
  );
}

export default App;
