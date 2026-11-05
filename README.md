# Landing Page Grader

An AI-assisted landing page evaluation tool that analyzes a webpage and generates a scored teardown with actionable recommendations.

The goal is to go beyond visual feedback and evaluate the elements that influence landing page conversion: messaging, conversion paths, trust signals, performance, content hygiene, and user friction.

## Features

- **URL-based analysis:** Enter a publicly accessible webpage URL to analyze its landing page.
- **Conversion path evaluation:** Checks for calls to action, forms, and conversion opportunities.
- **Message clarity:** Evaluates headings, page descriptions, and content structure.
- **Trust and social proof:** Looks for testimonials, customer logos, and case studies.
- **Performance evaluation:** Uses PageSpeed performance data when available.
- **Content hygiene:** Checks page titles, meta descriptions, viewport configuration, and image alt text.
- **Actionable feedback:** Provides evidence-based observations and recommendations.
- **Audience classification:** Identifies potential enterprise, self-serve, and learning-oriented page characteristics.

## Scoring Methodology

The grader uses a weighted rubric with a maximum score of 100 points.

| Category | Maximum Points |
|---|---:|
| Conversion Path | 25 |
| Message Clarity | 20 |
| Trust & Proof | 15 |
| Performance | 15 |
| Content Hygiene | 10 |
| Friction | 15 |
| **Total** | **100** |

### What Each Category Evaluates

**1. Conversion Path — 25 points**
- Presence of calls to action.
- Availability of conversion forms.
- Specificity of conversion actions.

**2. Message Clarity — 20 points**
- Main headline (H1).
- Meta description and supporting messaging.
- Heading hierarchy and content structure.

**3. Trust & Proof — 15 points**
- Customer testimonials.
- Customer logos.
- Case-study evidence.

**4. Performance — 15 points**
- PageSpeed performance score when available.

**5. Content Hygiene — 10 points**
- Page title.
- Meta description.
- Responsive viewport configuration.
- Image alternative text.

**6. Friction — 15 points**
- Missing calls to action.
- Form complexity and field count.
- Other detectable static friction indicators.

### Scoring Considerations

- If PageSpeed data is unavailable, the grader excludes that category and normalizes the available score. The result should be treated as provisional because performance coverage is incomplete.
- Audience classification provides context and does not currently change numerical scoring weights.
- Friction checks are based on detectable page elements; they do not measure every dynamic interaction or actual user experience.

## Tech Stack

**Frontend**
- React
- JavaScript
- Vite
- CSS

**Backend**
- Cloudflare Pages Functions
- Node.js

**Scoring & Evaluation**
- JavaScript
- JSON-based scoring rubric
- PageSpeed performance data

**Testing & Benchmarking**
- Node.js test runner
- XLSX for benchmark dataset processing

## Project Structure

```text
landing-page-grader/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── functions/
│   └── api/
│       └── grade.js
│
├── scoring/
│   └── score.js
│
├── rubric/
│   └── v1.json
│
├── tests/
│   ├── score.test.js
│   └── test-scoring.js
│
├── scripts/
│   └── benchmark.cjs
│
├── private/
│   └── Website Data - Summary.xlsx
│
├── package.json
├── wrangler.toml
└── .gitignore
```

The `private/` directory contains the evaluation dataset and is intentionally excluded from version control.

## Getting Started

### Prerequisites

- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/gagandeep-123/landing-page-grader.git
cd landing-page-grader
```

### 2. Install dependencies

```bash
npm install
npm install --prefix frontend
```

### 3. Build the frontend

```bash
npm run build --prefix frontend
```

### 4. Run locally with Cloudflare Pages

```bash
npx wrangler pages dev frontend/dist
```

Open:

```text
http://localhost:8788
```

This runs the built frontend together with the Cloudflare Pages Functions API.

## Testing

Run the scoring unit tests:

```bash
node --test tests/score.test.js
```

The tests cover the scoring logic and expected scoring behavior.

## Benchmarking

The project includes a benchmark script for evaluating the grader against the provided landing-page dataset.

Run:

```bash
npm run benchmark
```

The benchmark compares grader scores with observed form-fill conversion rates and reports rank-correlation metrics.

**Note:** The benchmark requires the original evaluation spreadsheet at:

```text
private/Website Data - Summary.xlsx
```

The dataset is intentionally not committed to GitHub because it contains confidential evaluation data.

### Interpreting Benchmark Results

Observed form-fill conversion rates are useful directional signals, but they are not a perfect measure of landing-page quality.

Traffic sources, visitor intent, campaign targeting, and sample size can influence conversion rates. Rank correlation on a small dataset should therefore be treated as exploratory evidence, not proof of predictive accuracy or causation.

## Current Limitations

- Page content extraction relies on HTML-based heuristics and may miss content rendered dynamically by JavaScript.
- CTA, testimonial, logo, and case-study detection can produce false positives or false negatives.
- Friction evaluation focuses on statically detectable elements rather than complete interactive user journeys.
- PageSpeed data may not always be available.
- Audience classification is contextual and does not currently modify scoring weights.
- Benchmark conclusions are limited by the size and available metrics of the evaluation dataset.

## Future Improvements

- Improve semantic detection of primary conversion CTAs.
- Distinguish customer case studies from general resources and downloadable content.
- Improve detection of decorative images versus meaningful images requiring alt text.
- Add more robust analysis of dynamic page interactions.
- Expand benchmark coverage with more landing pages and downstream conversion-quality data.
- Introduce audience-specific scoring once sufficient evidence supports different scoring weights.

## Repository

GitHub: https://github.com/gagandeep-123/landing-page-grader

---

**Built as a landing page evaluation and conversion optimization project.**
