import test from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../scoring/score.js";

const completeSignals = {
  hasCTA: true,
  hasSpecificCTA: true,
  hasForm: true,
  formFieldCount: 3,
  hasH1: true,
  hasDescription: true,
  hasSubheading: true,
  hasTestimonials: true,
  hasCustomerLogos: true,
  hasCaseStudy: true,
  performanceScore: 100,
  performanceAvailable: true,
  hasTitle: true,
  hasMetaDescription: true,
  hasViewport: true,
  hasAltText: true
};

test("all available positive signals produce a complete score of 100", () => {
  const result = calculateScore(completeSignals, "enterprise");
  assert.equal(result.score, 100);
  assert.equal(result.coverage, 100);
  assert.equal(result.provisional, false);
});

test("missing PageSpeed data is excluded and reduces score coverage", () => {
  const result = calculateScore({ ...completeSignals, performanceAvailable: false, performanceScore: null });
  assert.equal(result.score, 100);
  assert.equal(result.coverage, 85);
  assert.equal(result.provisional, true);
  assert.equal(result.breakdown.performance, null);
});

test("audience does not change the numeric score", () => {
  const enterprise = calculateScore(completeSignals, "enterprise");
  const learner = calculateScore(completeSignals, "learner");
  assert.equal(enterprise.score, learner.score);
});

test("customer-logo points are not awarded without an explicit signal", () => {
  const result = calculateScore({ ...completeSignals, hasCustomerLogos: false });
  assert.equal(result.breakdown.trustAndProof, 10);
  assert.equal(result.evidence.some((item) => item.message.includes("logo evidence")), false);
});