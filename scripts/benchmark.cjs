
const XLSX = require("xlsx");
const fs = require("fs");

const DATASET_PATH = "private/Website Data - Summary.xlsx";
const API_URL = "http://localhost:8788/api/grade";

function getAverageRanks(values) {
  const sorted = [...values].sort((a, b) => a - b);

  return values.map((value) => {
    const first = sorted.indexOf(value);
    const last = sorted.lastIndexOf(value);

    return (first + last + 2) / 2;
  });
}

function pearsonCorrelation(x, y) {
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;

    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  const denominator = Math.sqrt(denominatorX * denominatorY);

  return denominator === 0 ? null : numerator / denominator;
}

function calculateSpearman(scores, rates) {
  const scoreRanks = getAverageRanks(scores);
  const rateRanks = getAverageRanks(rates);

  return pearsonCorrelation(scoreRanks, rateRanks);
}

function calculateKendall(scores, rates) {
  let concordant = 0;
  let discordant = 0;
  let tiedScores = 0;
  let tiedRates = 0;

  for (let i = 0; i < scores.length; i++) {
    for (let j = i + 1; j < scores.length; j++) {
      const scoreDiff = scores[i] - scores[j];
      const rateDiff = rates[i] - rates[j];

      if (scoreDiff === 0 && rateDiff === 0) continue;
      if (scoreDiff === 0) {
        tiedScores++;
      } else if (rateDiff === 0) {
        tiedRates++;
      } else if (scoreDiff * rateDiff > 0) {
        concordant++;
      } else {
        discordant++;
      }
    }
  }

  const denominator = Math.sqrt(
    (concordant + discordant + tiedScores) *
    (concordant + discordant + tiedRates)
  );

  return denominator === 0
    ? null
    : (concordant - discordant) / denominator;
}

async function main() {
  const workbook = XLSX.readFile(DATASET_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet);

  const results = [];

  for (const row of rows) {
    const url = row["Page URL"];
    const sessions = Number(row["Sessions"]);
    const formFills = Number(row["Form fills"]);
    const conversionRate = formFills / sessions;

    console.log(`\nGrading: ${url}`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `API returned ${response.status}`);
      }

      const score = data.grading.score;

      results.push({
  url,
  pageType: row["Page type"],
  sessions,
  formFills,
  conversionRate,
  graderScore: score,
  audience: data.grading.audience,
  audienceWeights: data.grading.audienceWeights,
  breakdown: data.grading.breakdown,
  performanceAvailable: data.pagespeed.available
});

      console.log(`Grader score: ${score}/100`);
      console.log(`Form-fill rate: ${(conversionRate * 100).toFixed(4)}%`);
    } catch (error) {
      console.error(`Failed: ${error.message}`);

      results.push({
        url,
        pageType: row["Page type"],
        sessions,
        formFills,
        conversionRate,
        error: error.message
      });
    }
  }

  const successful = results.filter(
    (result) => Number.isFinite(result.graderScore)
  );

  let spearman = null;
  let kendall = null;

  if (successful.length >= 2) {
    const scores = successful.map((item) => item.graderScore);
    const rates = successful.map((item) => item.conversionRate);

    spearman = calculateSpearman(scores, rates);
    kendall = calculateKendall(scores, rates);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalPages: rows.length,
    successfullyGraded: successful.length,
    failedPages: rows.length - successful.length,
    spearman,
    kendall,
    results
  };

  fs.writeFileSync(
    "private/benchmark-results.json",
    JSON.stringify(report, null, 2)
  );

  console.log("\n========== BENCHMARK SUMMARY ==========");
  console.log(`Pages in dataset: ${rows.length}`);
  console.log(`Successfully graded: ${successful.length}`);
  console.log(`Spearman correlation: ${spearman ?? "Unavailable"}`);
  console.log(`Kendall correlation: ${kendall ?? "Unavailable"}`);
  console.log("\nSaved: private/benchmark-results.json");

  if (successful.length !== rows.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Benchmark failed:", error.message);
  process.exitCode = 1;
});
