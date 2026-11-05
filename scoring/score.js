
// const CATEGORY_MAX = {
//   conversionPath: 25,
//   messageClarity: 20,
//   trustAndProof: 15,
//   performance: 15,
//   contentHygiene: 10,
//   friction: 15
// };

// const AUDIENCE_WEIGHTS = {
//   enterprise: {
//     conversionPath: 1.0,
//     messageClarity: 1.0,
//     trustAndProof: 1.3,
//     performance: 0.8,
//     contentHygiene: 0.8,
//     friction: 1.1
//   },
//   "self-serve": {
//     conversionPath: 1.3,
//     messageClarity: 1.0,
//     trustAndProof: 0.8,
//     performance: 1.3,
//     contentHygiene: 1.0,
//     friction: 1.3
//   },
//   learner: {
//     conversionPath: 0.7,
//     messageClarity: 1.3,
//     trustAndProof: 0.8,
//     performance: 1.0,
//     contentHygiene: 1.2,
//     friction: 0.8
//   }
// };

// function clamp(value, min, max) {
//   return Math.max(min, Math.min(max, value));
// }

// export function calculateScore(signals, audience) {
//   const weights =
//     AUDIENCE_WEIGHTS[audience] ||
//     AUDIENCE_WEIGHTS["self-serve"];

//   const raw = {
//     conversionPath: 0,
//     messageClarity: 0,
//     trustAndProof: 0,
//     performance: 0,
//     contentHygiene: 0,
//     friction: 0
//   };

//   const evidence = [];

//   function award(category, points, condition, message) {
//   if (condition) {
//     const actualPoints = Math.min(
//       points,
//       CATEGORY_MAX[category] - raw[category]
//     );

//     if (actualPoints <= 0) return;

//     raw[category] += actualPoints;

//     evidence.push({
//       category,
//       points: actualPoints,
//       message
//     });
//   }
// }

//   // 1. Conversion path: 25 points

//   award(
//     "conversionPath",
//     10,
//     signals.hasCTA,
//     "A conversion call-to-action was detected."
//   );

//   award(
//     "conversionPath",
//     10,
//     signals.hasForm,
//     "A form was detected."
//   );

//   award(
//     "conversionPath",
//     5,
//     signals.hasSpecificCTA,
//     "Specific action-oriented CTA wording was detected."
//   );

//   // 2. Message clarity: 20 points

//   award(
//     "messageClarity",
//     10,
//     signals.hasH1,
//     "A primary heading was detected."
//   );

//   award(
//     "messageClarity",
//     5,
//     signals.hasDescription,
//     "A page description was detected."
//   );

//   award(
//     "messageClarity",
//     5,
//     signals.hasSubheading,
//     "A supporting heading was detected."
//   );

//   // 3. Trust and proof: 15 points

//   award(
//     "trustAndProof",
//     5,
//     signals.hasTestimonials,
//     "Customer testimonials or reviews were detected."
//   );

//   award(
//     "trustAndProof",
//     5,
//     signals.hasCustomerLogos,
//     "Customer or brand proof was detected."
//   );

//   award(
//     "trustAndProof",
//     5,
//     signals.hasCaseStudy,
//     "A customer case study was detected."
//   );

//  // 4. Performance: 15 points

// const performanceAvailable =
//   signals.performanceAvailable !== false &&
//   Number.isFinite(signals.performanceScore);

// if (performanceAvailable) {
//   raw.performance = Math.round(
//     (clamp(signals.performanceScore, 0, 100) / 100) * 15
//   );
// }

//   // 5. Content hygiene: 10 points

//   award(
//     "contentHygiene",
//     3,
//     signals.hasTitle,
//     "A page title was detected."
//   );

//   award(
//     "contentHygiene",
//     3,
//     signals.hasMetaDescription,
//     "A meta description was detected."
//   );

//   award(
//     "contentHygiene",
//     2,
//     signals.hasViewport,
//     "A mobile viewport declaration was detected."
//   );

//   award(
//     "contentHygiene",
//     2,
//     signals.hasAltText,
//     "At least one image with non-empty alt text was detected."
//   );

//   // 6. Friction: 15 points

//   raw.friction = 15;

//   if (!signals.hasCTA) {
//     raw.friction -= 5;

//     evidence.push({
//       category: "friction",
//       points: -5,
//       message: "No conversion CTA was detected."
//     });
//   }

//   if (signals.formFieldCount > 5) {
//     const penalty = audience === "enterprise" ? 2 : 5;

//     raw.friction -= penalty;

//     evidence.push({
//       category: "friction",
//       points: -penalty,
//       message: `The form contains ${signals.formFieldCount} fields.`
//     });
//   }

//   if (signals.hasPopup) {
//     raw.friction -= 3;

//     evidence.push({
//       category: "friction",
//       points: -3,
//       message: "A popup or interstitial was detected."
//     });
//   }

//   // Redistribute points across available categories.
// const activeCategories = Object.keys(CATEGORY_MAX).filter(
//   category => category !== "performance" || performanceAvailable
// );

// const weightedTotal = activeCategories.reduce(
//   (sum, category) =>
//     sum + CATEGORY_MAX[category] * weights[category],
//   0
// );

// const breakdown = {};
// const adjustedMaximums = {};

// for (const category of activeCategories) {
//   const adjustedMaximum =
//     (CATEGORY_MAX[category] * weights[category] /
//       weightedTotal) * 100;

//   adjustedMaximums[category] = Number(
//     adjustedMaximum.toFixed(2)
//   );

//   const cappedRawScore = clamp(
//   raw[category],
//   0,
//   CATEGORY_MAX[category]
// );

// const completionRatio =
//   cappedRawScore / CATEGORY_MAX[category];

// breakdown[category] = Math.round(
//   completionRatio * adjustedMaximum
// );
// }

// if (!performanceAvailable) {
//   evidence.push({
//     category: "performance",
//     points: null,
//     message: "Performance was not scored because PageSpeed data was unavailable."
//   });
// }

// const total = Object.values(breakdown).reduce(
//   (sum, value) => sum + value,
//   0
// );

//   return {
//     score: total,
//     breakdown,
//     evidence,
//     audience,
//     audienceWeights: weights,
//     categoryMaximums: adjustedMaximums
//   };
// }



const CATEGORY_MAX = {
  conversionPath: 25,
  messageClarity: 20,
  trustAndProof: 15,
  performance: 15,
  contentHygiene: 10,
  friction: 15
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Scores observable landing-page signals only. Audience classification is
 * returned as context, but deliberately does not change the numeric score.
 * Missing PageSpeed data is excluded and reported through coverage.
 */
export function calculateScore(signals, audience = "unknown") {
  const points = Object.fromEntries(
    Object.entries(CATEGORY_MAX).map(([key]) => [key, 0])
  );
  const evidence = [];

  function award(category, amount, message, detail = "") {
    const remaining = CATEGORY_MAX[category] - points[category];
    const awarded = clamp(Math.min(amount, remaining), 0, amount);
    if (awarded <= 0) return;
    points[category] += awarded;
    evidence.push({ category, points: awarded, message, detail: detail || "" });
  }

  // Conversion path: a conversion-oriented CTA, a usable form, and clarity
  // about the action. Navigation links and generic buttons are not signals.
  if (signals.hasCTA) {
    award("conversionPath", 10, "A conversion-oriented call-to-action was detected.", signals.ctaEvidence);
  }
  if (signals.hasForm) {
    award("conversionPath", 10, "A likely conversion form was detected.", signals.formEvidence);
  }
  if (signals.hasSpecificCTA) {
    award("conversionPath", 5, "A specific, action-oriented CTA was detected.", signals.specificCtaEvidence);
  }

  // Message clarity: presence and specificity are assessed separately by
  // extraction. This version scores presence, not an unvalidated AI judgment.
  if (signals.hasH1) {
    award("messageClarity", 10, "A primary page heading was detected.", signals.h1Evidence);
  }
  if (signals.hasDescription) {
    award("messageClarity", 5, "A page description was detected.", signals.descriptionEvidence);
  }
  if (signals.hasSubheading) {
    award("messageClarity", 5, "A supporting section heading was detected.", signals.subheadingEvidence);
  }

  // Trust is awarded only when the extractor can provide inspectable evidence.
  if (signals.hasTestimonials) {
    award("trustAndProof", 5, "Customer testimonial evidence was detected.", signals.testimonialEvidence);
  }
  if (signals.hasCustomerLogos) {
    award("trustAndProof", 5, "Customer or partner logo evidence was detected.", signals.customerLogoEvidence);
  }
  if (signals.hasCaseStudy) {
    award("trustAndProof", 5, "An individual customer story or case study was detected.", signals.caseStudyEvidence);
  }

  if (signals.performanceAvailable && Number.isFinite(signals.performanceScore)) {
    const performancePoints = CATEGORY_MAX.performance * clamp(signals.performanceScore, 0, 100) / 100;
    award("performance", performancePoints, "Google PageSpeed mobile performance score was measured.", `PageSpeed mobile performance: ${signals.performanceScore}/100`);
  }

  if (signals.hasTitle) {
    award("contentHygiene", 3, "A document title was detected.", signals.titleEvidence);
  }
  if (signals.hasMetaDescription) {
    award("contentHygiene", 3, "A meta description was detected.", signals.metaDescriptionEvidence);
  }
  if (signals.hasViewport) {
    award("contentHygiene", 2, "A mobile viewport declaration was detected.", signals.viewportEvidence);
  }
  if (signals.hasAltText) {
    award("contentHygiene", 2, "At least one image with non-empty alternative text was detected.", signals.altTextEvidence);
  }

  // Friction deductions are limited to things that static HTML can establish.
  // Popup behavior is not penalized because a static fetch cannot reliably see it.
  let friction = CATEGORY_MAX.friction;
  const frictionNotes = [];
  if (!signals.hasCTA) {
    friction -= 5;
    frictionNotes.push("No conversion-oriented CTA was found (-5)");
  }
  if (signals.hasForm && signals.formFieldCount > 5) {
    friction -= 5;
    frictionNotes.push(`The detected conversion form has ${signals.formFieldCount} visible fields (-5)`);
  } else if (signals.hasForm && signals.formFieldCount > 3) {
    friction -= 2;
    frictionNotes.push(`The detected conversion form has ${signals.formFieldCount} visible fields (-2)`);
  }
  award("friction", friction, "Static friction checks were applied.", frictionNotes.length ? frictionNotes.join("; ") : "No measurable static friction penalty was detected. Dynamic interaction friction was not assessed.");

  const availableCategories = Object.keys(CATEGORY_MAX).filter(
    (category) => category !== "performance" || signals.performanceAvailable
  );
  const availableMaximum = availableCategories.reduce(
    (sum, category) => sum + CATEGORY_MAX[category], 0
  );
  const earnedPoints = availableCategories.reduce(
    (sum, category) => sum + points[category], 0
  );
  const score = availableMaximum > 0
    ? Math.round((earnedPoints / availableMaximum) * 100)
    : 0;

  const breakdown = Object.fromEntries(
    Object.keys(CATEGORY_MAX).map((category) => [
      category,
      availableCategories.includes(category)
        ? Math.round((points[category] / CATEGORY_MAX[category]) * CATEGORY_MAX[category] * 10) / 10
        : null
    ])
  );

  return {
    score,
    rawPoints: Math.round(earnedPoints * 10) / 10,
    availablePoints: availableMaximum,
    coverage: Math.round(availableMaximum),
    provisional: availableMaximum < 100,
    breakdown,
    categoryMaximums: Object.fromEntries(
      Object.entries(CATEGORY_MAX).map(([category, maximum]) => [
        category,
        availableCategories.includes(category) ? maximum : null
      ])
    ),
    evidence,
    audience,
    scoringNote: "The score measures observable page-quality signals. Audience classification does not alter the score. Unavailable measurements are excluded and reduce coverage."
  };
}

export { CATEGORY_MAX };