
import { calculateScore } from "../scoring/score.js";

const signals = {
  hasCTA: true,
  hasSpecificCTA: true,
  hasForm: true,
  formFieldCount: 7,

  hasH1: true,
  hasDescription: true,
  hasSubheading: true,

  hasTestimonials: true,
  hasCustomerLogos: true,
  hasCaseStudy: true,

  performanceScore: 90,
  performanceAvailable: true,

  hasTitle: true,
  hasMetaDescription: true,
  hasViewport: true,
  hasAltText: true,

  hasPopup: false
};

const audiences = ["enterprise", "self-serve", "learner"];

console.log("\n========== TEST 1: PAGESPEED AVAILABLE ==========");

for (const audience of audiences) {
  const result = calculateScore(signals, audience);

  console.log("\nAudience:", audience);
  console.log("Score:", result.score);
  console.log("Breakdown:", result.breakdown);
  console.log("Performance included:",
    "performance" in result.breakdown
  );
}

console.log("\n========== TEST 2: PAGESPEED UNAVAILABLE ==========");

const signalsWithoutPerformance = {
  ...signals,
  performanceScore: null,
  performanceAvailable: false
};

for (const audience of audiences) {
  const result = calculateScore(
    signalsWithoutPerformance,
    audience
  );

  console.log("\nAudience:", audience);
  console.log("Score:", result.score);
  console.log("Breakdown:", result.breakdown);
  console.log("Performance included:",
    "performance" in result.breakdown
  );
}
