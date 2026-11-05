
// import { calculateScore } from "../../scoring/score.js";
// export async function onRequestPost({ request, env }) {
//   try {
//     const { url } = await request.json();

//     if (!url) {
//       return Response.json(
//         { error: "URL is required" },
//         { status: 400 }
//       );
//     }

//     let parsedUrl;

//     try {
//       parsedUrl = new URL(url);
//     } catch {
//       return Response.json(
//         { error: "Invalid URL" },
//         { status: 400 }
//       );
//     }

//     if (!["http:", "https:"].includes(parsedUrl.protocol)) {
//       return Response.json(
//         { error: "Only HTTP and HTTPS URLs are allowed" },
//         { status: 400 }
//       );
//     }

//     // 1. Fetch the actual webpage
//     const response = await fetch(parsedUrl.toString(), {
//       headers: {
//         "User-Agent": "Mozilla/5.0 LandingPageGrader/1.0"
//       },
//       redirect: "manual"
//     });

//     if (!response.ok) {
//       return Response.json(
//         { error: `Website returned status ${response.status}` },
//         { status: 400 }
//       );
//     }

//     const html = await response.text();

//     // 2. Extract basic webpage information
//     const title = extractElementText(html, "title")[0] || "";

//   const metaTags = html.match(/<meta\b[^>]*>/gi) || [];

// const getAttribute = (tag, attribute) => {
//   const match = tag.match(
//     new RegExp(
//       `\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
//       "i"
//     )
//   );

//   return match
//     ? (match[1] ?? match[2] ?? match[3] ?? "")
//     : "";
// };

// let description = "";

// for (const tag of metaTags) {
//   const name = getAttribute(tag, "name").toLowerCase();
//   const content = getAttribute(tag, "content");

//   if (name === "description" && content) {
//     description = content;
//     break;
//   }
// }

//     const headings = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)]
//       .map(match => match[1].replace(/<[^>]*>/g, "").trim());

//     const buttons = [...html.matchAll(/<button[^>]*>(.*?)<\/button>/gis)]
//       .map(match => match[1].replace(/<[^>]*>/g, "").trim());

//     // 3. Fetch Google PageSpeed Insights data
//     let pagespeed = {
//       available: false,
//       error: "PageSpeed API unavailable"
//     };

//     if (env.PAGESPEED_API_KEY) {
//       try {
//         const params = new URLSearchParams({
//           url: parsedUrl.toString(),
//           key: env.PAGESPEED_API_KEY,
//           strategy: "mobile"
//         });

//         params.append("category", "performance");
//         params.append("category", "accessibility");
//         params.append("category", "seo");

//         const psiResponse = await fetch(
//           `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`
//         );

//         if (!psiResponse.ok) {
//           throw new Error(`Google API returned ${psiResponse.status}`);
//         }

//         const psiData = await psiResponse.json();

//         const categories = psiData.lighthouseResult.categories;
//         const audits = psiData.lighthouseResult.audits;

//         pagespeed = {
//           available: true,

//           scores: {
//             performance: Math.round(
//               categories.performance.score * 100
//             ),
//             accessibility: Math.round(
//               categories.accessibility.score * 100
//             ),
//             seo: Math.round(
//               categories.seo.score * 100
//             )
//           },

//           metrics: {
//             lcp: audits["largest-contentful-paint"]?.numericValue,
//             cls: audits["cumulative-layout-shift"]?.numericValue,
//             tbt: audits["total-blocking-time"]?.numericValue
//           }
//         };
//       } catch (error) {
//         pagespeed = {
//           available: false,
//           error: error.message
//         };
//       }
//     }

    
//     // 4. Detect basic conversion signals from HTML

//     const lowerHtml = html.toLowerCase();

//     const clickableElements = [
//       ...html.matchAll(
//         /<(?:a|button)\b[^>]*>([\s\S]*?)<\/(?:a|button)>/gi
//       )
//     ];

//     const clickableText = clickableElements
//       .map(match => match[1].replace(/<[^>]*>/g, " ").trim())
//       .join(" ");

    
// const conversionIntentRegex =
//   /\b(book (a )?demo|request (a )?demo|contact sales|get started|start (a )?free trial|start free|sign up|sign up free|try (it )?free|buy now|subscribe|register now|schedule (a )?call|talk to sales|request pricing|download (now|free))\b/i;

// const conversionCTAs = [
//   ...new Set(
//     clickableElements
//       .map(match => extractText(match[1]))
//       .filter(text => conversionIntentRegex.test(text))
//   )
// ];

// const hasCTA = conversionCTAs.length > 0;

// const specificCTARegex =
//   /\b(book (a )?demo|request (a )?demo|contact sales|start free|start (a )?free trial|try (it )?free|request pricing|schedule (a )?call|talk to sales|buy now|sign up free)\b/i;

// const hasSpecificCTA = conversionCTAs.some(text =>
//   specificCTARegex.test(text)
// );

//  const formBlocks = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/gi) || [];

// const conversionForms = formBlocks.filter(form => {
//   const formText = extractText(form).toLowerCase();
//   const formHTML = form.toLowerCase();

//   const isSearchForm =
//     /type=["']search["']/.test(formHTML) ||
//     /name=["']search["']/.test(formHTML) ||
//     /search/.test(formText);

//   const hasConversionIntent =
//     /demo|contact|sales|trial|register|subscribe|download|request|signup|sign up/i
//       .test(formText + " " + formHTML);

//   return !isSearchForm && hasConversionIntent;
// });

// const formFields = conversionForms.flatMap(form =>
//   form.match(/<(?:input|select|textarea)\b[^>]*>/gi) || []
// );
// const hasForm = formFields.length > 0;
//     const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)];

//     // 5. Detect the likely audience using simple rules

// let audience = "self-serve";

// const pagePath = parsedUrl.pathname.toLowerCase();

// const isLearningPage =
//   /webinar|blog|article|guide|whitepaper|learning|resource/.test(
//     pagePath
//   );

// const isEnterprisePage =
//   /book a demo|request demo|contact sales|enterprise/i.test(
//     clickableText + " " + lowerHtml.slice(0, 5000)
//   );

// if (isLearningPage) {
//   audience = "learner";
// } else if (isEnterprisePage) {
//   audience = "enterprise";
// }

//     // Extract readable text from HTML
// function extractText(html) {
//   return html
//     .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
//     .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
//     .replace(/<[^>]+>/g, " ")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/&amp;/gi, "&")
//     .replace(/&quot;/gi, '"')
//     .replace(/&#39;/gi, "'")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // Extract text from elements matching a tag
// function extractElementText(html, tag) {
//   const matches = [
//     ...html.matchAll(
//       new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi")
//     )
//   ];

//   return matches
//     .map(match => extractText(match[1]))
//     .filter(Boolean);
// }
// const pageText = extractText(html);
// const sectionHeadings = extractElementText(html, "h2");
// const paragraphTexts = extractElementText(html, "p");

// const lowerPageText = pageText.toLowerCase();

// // 3. Detect trust signals using actual HTML elements

// // Testimonials: detect meaningful customer quotes in common HTML structures.
// const testimonialQuotes = [
//   ...html.matchAll(
//     /<(?:blockquote|div|section|p)\b[^>]*>([\s\S]*?)<\/(?:blockquote|div|section|p)>/gi
//   )
// ]
//   .map(match => extractText(match[1]))
//   .filter(text =>
//     text.length >= 80 &&
//     /\b(we|our|us|chose|helped|transformed|experience|solution)\b/i.test(text)
//   );

// const hasTestimonials = testimonialQuotes.length > 0;


// // Customer logos: detect customer and partner logo assets.
// const hasCustomerLogos = imageTags.some(image => {
//   const tag = image[0];

//   const label = (
//     getAttribute(tag, "alt") + " " +
//     getAttribute(tag, "title") + " " +
//     getAttribute(tag, "src")
//   ).toLowerCase();

//   return /\b(customer|client|partner|trusted[-_ ]?by|logo)\b/i.test(label);
// });


// // Case studies: require a real link to a case study or
// // customer story, rather than just a keyword on the page.
// const caseStudyLinks = [
//   ...html.matchAll(
//     /<a\b[^>]*href=["'][^"']*(?:case[-_/]?stud(?:y|ies)|customer[-_/]?stor(?:y|ies)|success[-_/]?stor(?:y|ies))[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi
//   )
// ].map(match => {
//     const openingTag = match[0].match(/<a\b[^>]*>/i)?.[0] || "";
//     const rawHref = getAttribute(openingTag, "href");

//     let href = rawHref;

//     try {
//       href = new URL(rawHref, parsedUrl).toString();
//     } catch {
//       // Keep the original href if it cannot be resolved.
//     }

//     return {
//       text: extractText(match[1]),
//       href
//     };
//   })
//   .filter(item => item.text.length >= 3);
//   const individualCaseStudyLinks = caseStudyLinks.filter((link) => {
//   let pathname = "";

//   try {
//     pathname = new URL(link.href, url).pathname.replace(/\/+$/, "");
//   } catch {
//     return false;
//   }

//   // Require an individual story URL, not a listing page.
//   const isIndividualStory =
//     /\/(case-studies|customer-stories|customers)\/[^/]+$/i.test(pathname);

//   const isGenericLink =
//     /\b(all|view|see|browse)\b.*\b(case studies|customer stories)\b/i.test(
//       link.text
//     );

//   return isIndividualStory && !isGenericLink;
// });

// const hasCaseStudy = individualCaseStudyLinks.length > 0 ||
//   caseStudyLinks.some(link =>
//     /\b(CHRISTUS Health|customer story|case study|success story)\b/i.test(link.text)
//   );
//     // 6. Build observable signals

//     const signals = {
//       hasCTA,
//       hasSpecificCTA,
//       hasForm: hasForm,
//       formFieldCount: formFields.length,

//       hasH1: headings.length > 0,
//       hasDescription: description.length > 0,
//       hasSubheading: /<h2\b/i.test(html),

//     hasTestimonials,
// hasCustomerLogos,
// hasCaseStudy,

//       performanceScore: pagespeed.available
//   ? pagespeed.scores.performance
//   : null,

// performanceAvailable: pagespeed.available,

//       hasTitle: /<title\b/i.test(html),
//       hasMetaDescription: description.length > 0,
//       hasViewport: /name=["']viewport["']/i.test(html),
//       hasAltText: imageTags.some(image =>
//         /\balt=["'][^"']+["']/i.test(image[0])
//       ),

//      hasPopup: false
//     };
//    const extractedEvidence = {
//   h1: headings,
//   sectionHeadings,
//   paragraphs: paragraphTexts.slice(0, 15),
//   pageTextPreview: pageText.slice(0, 1500),

//   trustDiagnostics: {
//     testimonialQuotes,

//     logoCandidates: imageTags.map(image => {
//       const tag = image[0];

//       return {
//         alt: getAttribute(tag, "alt"),
//         title: getAttribute(tag, "title"),
//         src: getAttribute(tag, "src")
//       };
//     }).slice(0, 30),

//     caseStudyLinks,
//     individualCaseStudyLinks
//   }
// };

//     // 7. Calculate the conversion-focused score

//     const grading = calculateScore(signals, audience);
//     // Attach the actual page evidence to each scoring signal.
// grading.evidence = grading.evidence.map(item => {
//   const message = item.message.toLowerCase();
//   let detail = "";

//   if (message.includes("conversion call-to-action")) {
//     detail = [...new Set(conversionCTAs)].slice(0, 3).join(" | ");
//   } else if (message.includes("specific action-oriented")) {
//     detail = [...new Set(conversionCTAs)].slice(0, 3).join(" | ");
//   } else if (message.includes("primary heading")) {
//     detail = headings[0] || "";
//   } else if (message.includes("page description")) {
//     detail = description || "";
//   } else if (message.includes("supporting heading")) {
//     detail = sectionHeadings[0] || "";
//   } else if (message.includes("customer case study")) {
//   const study = individualCaseStudyLinks[0];
//   detail = study ? `${study.text} — ${study.href}` : "";
// }

//   return {
//     ...item,
//     detail
//   };
// });

//     // 8. Return combined results
//     return Response.json({
//       success: true,
//       url: parsedUrl.toString(),
//       status: response.status,
//       htmlLength: html.length,
//       title,
//       description,
//       h1Headings: headings,
//       buttons,
//       detectedCTAs: conversionCTAs,
//       extractedEvidence,
//       pagespeed,
//       grading,
//       signals
//     });

//   } catch (error) {
//     return Response.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }






import { calculateScore } from "../../scoring/score.js";

const MAX_HTML_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 15_000;

function decodeEntities(value = "") {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function extractText(value = "") {
  return decodeEntities(value
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(tag = "", attribute) {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : "";
}

function getElements(html, tag) {
  const regex = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}\\s*>`, "gi");
  return [...html.matchAll(regex)].map((match) => ({
    open: `<${tag}${match[1]}>`,
    inner: match[2],
    text: extractText(match[2]),
    html: match[0]
  })).filter((item) => item.text);
}

function getMeta(html, wantedName) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((item) => getAttribute(item, "name").toLowerCase() === wantedName);
  return tag ? getAttribute(tag, "content").trim() : "";
}

function getAnchors(html, baseUrl) {
  const matches = [...html.matchAll(/<a\b[^>]*href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)[^>]*>[\s\S]*?<\/a\s*>/gi)];
  return matches.map((match) => {
    const opening = match[0].match(/<a\b[^>]*>/i)?.[0] || "";
    const rawHref = getAttribute(opening, "href");
    let href = "";
    try { href = new URL(rawHref, baseUrl).toString(); } catch { /* ignore invalid links */ }
    return { text: extractText(match[0].replace(/^<a\b[^>]*>/i, "").replace(/<\/a\s*>$/i, "")), href, opening, html: match[0] };
  }).filter((link) => link.href && link.text);
}

function isListingUrl(url) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/+$/, "").toLowerCase();
  return /\/(case-studies|case-study|customer-stories|customer-story|success-stories|success-story|customers|clients)$/.test(path);
}

function detectCaseStudies(anchors) {
  const storyPath = /\/(?:case-studies?|customer-stories?|success-stories?|stories)\/[^/?#]+/i;
  const storyLanguage = /\b(case study|customer story|success story|customer spotlight|customer success)\b/i;
  const narrativeTitle = /^how\s+.{3,100}\s+(?:uses?|used|achieved|reduced|increased|improved|transformed|drove|built|scaled|implemented|saved|automated|deployed)\b/i;

  return anchors.filter((link) => {
    if (isListingUrl(link.href)) return false;
    const parsed = new URL(link.href);
    const hasIndividualPath = storyPath.test(parsed.pathname);
    const hasStoryLabel = storyLanguage.test(`${link.text} ${parsed.pathname}`);
    const hasNarrativeTitle = narrativeTitle.test(link.text) && parsed.pathname !== "/";
    return (hasIndividualPath && link.text.length >= 8 && !/^(read more|learn more|view|details)$/i.test(link.text)) || hasStoryLabel || hasNarrativeTitle;
  }).map(({ text, href }) => ({ text: text.slice(0, 240), href }));
}

function detectTestimonials(html) {
  const quotes = getElements(html, "blockquote")
    .map((item) => item.text)
    .filter((text) => text.length >= 60);

  // Some sites render testimonial cards without blockquote elements. Associate
  // long quote-like paragraphs with a nearby author/title inside a section
  // whose heading explicitly indicates customer voices or testimonials.
  const headings = getElements(html, "h2").concat(getElements(html, "h3"));
  const testimonialHeading = /testimonial|what (?:our )?customers say|customer voices|customer stories|client stories|on the record|customer reviews|hear from our customers|leaders speak/i;
  for (const heading of headings) {
    if (!testimonialHeading.test(heading.text)) continue;
    const index = html.indexOf(heading.html);
    if (index < 0) continue;
    const tail = html.slice(index, index + 18_000);
    const headingEnd = heading.html.length;
    const nextHeading = tail.slice(headingEnd).search(/<h[23]\b/i);
    const sectionHtml = nextHeading >= 0 ? tail.slice(0, headingEnd + nextHeading) : tail;
    const paragraphs = getElements(sectionHtml, "p").map((item) => item.text);
    const candidates = paragraphs.filter((text) => text.length >= 100 && /\b(we|our|us|I|my)\b/i.test(text));
    const attribution = /\b(CEO|CTO|CIO|COO|CMO|CHRO|Chief Executive Officer|Chief Operating Officer|Chief Technology Officer|Chief Information Officer|Vice President|VP|Director|Head of|Founder|Manager|President)\b/i.test(sectionHtml);
    if (attribution) quotes.push(...candidates);
  }
  return [...new Set(quotes)].slice(0, 8);
}

function detectCustomerLogos(html, imageTags, parsedUrl, title) {
  const headings = getElements(html, "h2").concat(getElements(html, "h3"));
  const trustHeading = /trusted by|our customers|customers include|customer logos|clients include|leading companies|companies that trust|powering .* employees|teams at/i;
  const hostBrand = parsedUrl.hostname.replace(/^www\./, "").split(".")[0].toLowerCase();
  const titleBrand = (title.split(/[|–—-]/)[0] || "").toLowerCase();
  const candidates = [];

  for (const heading of headings) {
    if (!trustHeading.test(heading.text)) continue;
    const index = html.indexOf(heading.html);
    if (index < 0) continue;
    const tail = html.slice(index, index + 24_000);
    const headingEnd = heading.html.length;
    const nextHeading = tail.slice(headingEnd).search(/<h[23]\b/i);
    const sectionHtml = nextHeading >= 0 ? tail.slice(0, headingEnd + nextHeading) : tail;
    const sectionImages = [...sectionHtml.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    for (const tag of sectionImages) {
      const alt = getAttribute(tag, "alt").trim();
      const src = getAttribute(tag, "src").trim();
      const label = `${alt} ${getAttribute(tag, "title")} ${getAttribute(tag, "aria-label")}`.trim();
      const generic = /^(icon|image|logo|img|banner|illustration|decoration)[-_ ]?\d*$/i.test(alt) || !label;
      const ownBrand = (hostBrand && label.toLowerCase().includes(hostBrand)) || (titleBrand.length > 2 && label.toLowerCase().includes(titleBrand));
      const logoAsset = /logo/i.test(`${src} ${label}`);
      if (!generic && !ownBrand && (logoAsset || alt.length >= 2)) {
        candidates.push({ label: alt || label, src });
      }
    }
  }
  const unique = [...new Map(candidates.map((item) => [item.src || item.label, item])).values()];
  return unique.length >= 3 ? unique.slice(0, 12) : [];
}

function classifyAudience({ pageText, title, description, forms, anchors }) {
  const text = `${title} ${description} ${pageText.slice(0, 12_000)}`.toLowerCase();
  const formText = forms.join(" ").toLowerCase();
  const ctaText = anchors.map((item) => item.text).join(" ").toLowerCase();
  const enterprise = /enterprise|request a demo|book a demo|contact sales|talk to sales|procurement|implementation|deployment/.test(`${text} ${formText} ${ctaText}`);
  const selfServe = /start free|free trial|create account|sign up|pricing|buy now|start building/.test(`${text} ${formText} ${ctaText}`);
  const learning = /webinar|whitepaper|ebook|guide|report|course|event|watch now|download the report/.test(text);
  const matches = [enterprise, selfServe, learning].filter(Boolean).length;
  if (matches !== 1) return { audience: "mixed-or-unknown", confidence: "low" };
  if (enterprise) return { audience: "enterprise", confidence: "medium" };
  if (selfServe) return { audience: "self-serve", confidence: "medium" };
  return { audience: "learner", confidence: "medium" };
}

function validatePublicUrl(parsed) {
  const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!["http:", "https:"].includes(parsed.protocol)) return "Only HTTP and HTTPS URLs are allowed.";
  if (parsed.username || parsed.password) return "URLs containing credentials are not allowed.";
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return "Private or local network addresses are not allowed.";
  }
  if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host === "0.0.0.0") {
    return "Private or local network addresses are not allowed.";
  }
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) {
    return "Private or local network addresses are not allowed.";
  }
  return "";
}

async function readLimited(response, limit) {
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > limit) throw new Error("The webpage is too large to grade (2 MB limit).");
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new Error("The webpage is too large to grade (2 MB limit).");
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(merged);
}

export async function onRequestPost({ request, env }) {
  try {
    let body;
    try { body = await request.json(); } catch { return Response.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
    const inputUrl = body?.url;
    if (typeof inputUrl !== "string" || !inputUrl.trim()) {
      return Response.json({ error: "A valid URL is required." }, { status: 400 });
    }

    let parsedUrl;
    try { parsedUrl = new URL(inputUrl.trim()); }
    catch { return Response.json({ error: "Invalid URL. Include https:// or http://" }, { status: 400 }); }
    const urlError = validatePublicUrl(parsedUrl);
    if (urlError) return Response.json({ error: urlError }, { status: 400 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(parsedUrl.toString(), {
        headers: { "User-Agent": "Mozilla/5.0 LandingPageGrader/2.0", Accept: "text/html,application/xhtml+xml" },
        redirect: "manual",
        signal: controller.signal
      });
    } finally { clearTimeout(timeout); }

    if (response.status >= 300 && response.status < 400) {
      return Response.json({ error: "The website redirected this request. Submit the final destination URL." }, { status: 400 });
    }
    if (!response.ok) return Response.json({ error: `Website returned status ${response.status}.` }, { status: 400 });
    const contentType = response.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      return Response.json({ error: "The submitted URL did not return an HTML webpage." }, { status: 400 });
    }
    const html = await readLimited(response, MAX_HTML_BYTES);

    const title = getElements(html, "title")[0]?.text || "";
    const description = getMeta(html, "description");
    const headings = getElements(html, "h1").map((item) => item.text);
    const sectionHeadings = getElements(html, "h2").map((item) => item.text);
    const paragraphs = getElements(html, "p").map((item) => item.text);
    const pageText = extractText(html);
    const anchors = getAnchors(html, parsedUrl);
    const buttons = getElements(html, "button").map((item) => item.text);
    const clickable = anchors.map((item) => item.text).concat(buttons);

    const ctaPattern = /\b(book\s+(?:a\s+)?demo|request\s+(?:a\s+)?demo|contact\s+sales|talk\s+to\s+sales|get\s+started|start\s+(?:a\s+)?free\s+trial|start\s+free|sign\s+up(?:\s+free)?|try\s+(?:it\s+)?free|buy\s+now|subscribe|register(?:\s+now)?|schedule\s+(?:a\s+)?call|request\s+pricing|download\s+(?:now|free|the\s+\w+)|watch\s+now|request\s+access)\b/i;
    const specificCtaPattern = /\b(book\s+(?:a\s+)?demo|request\s+(?:a\s+)?demo|contact\s+sales|talk\s+to\s+sales|start\s+(?:a\s+)?free\s+trial|start\s+free|try\s+(?:it\s+)?free|buy\s+now|request\s+pricing|schedule\s+(?:a\s+)?call)\b/i;
    const conversionCTAs = [...new Set(clickable.map((text) => text.trim()).filter((text) => text && ctaPattern.test(text)))].slice(0, 12);

    const formBlocks = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form\s*>/gi)].map((match) => match[0]);
    const conversionForms = formBlocks.filter((form) => {
      const open = form.match(/<form\b[^>]*>/i)?.[0] || "";
      const formText = extractText(form).toLowerCase();
      const formHtml = form.toLowerCase();
      const searchForm = /type\s*=\s*["']search["']|name\s*=\s*["']q["']/.test(formHtml) || /^\s*search\b/.test(formText);
      const hasUserInput = /<input\b[^>]*type\s*=\s*["'](?:email|text|tel|url|number)["']|<textarea\b|<select\b/i.test(form);
      const intent = /demo|contact|sales|trial|register|subscribe|download|request|sign\s?up|quote|newsletter/i.test(`${formText} ${formHtml} ${open}`);
      return !searchForm && hasUserInput && intent;
    });
    const visibleFields = conversionForms.flatMap((form) => [...form.matchAll(/<(input|select|textarea)\b[^>]*>/gi)])
      .filter((match) => {
        const tag = match[0];
        const type = getAttribute(tag, "type").toLowerCase();
        return !["hidden", "submit", "button", "reset", "image"].includes(type) && !/\bhidden\b/i.test(tag) && getAttribute(tag, "aria-hidden").toLowerCase() !== "true";
      });
    const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    const testimonialQuotes = detectTestimonials(html);
    const caseStudyLinks = detectCaseStudies(anchors);
    const customerLogoEvidence = detectCustomerLogos(html, imageTags, parsedUrl, title);
    const audienceInfo = classifyAudience({ pageText, title, description, forms: conversionForms, anchors });

    let pagespeed = { available: false, error: "PageSpeed API key is not configured." };
    if (env.PAGESPEED_API_KEY) {
      try {
        const params = new URLSearchParams({ url: parsedUrl.toString(), key: env.PAGESPEED_API_KEY, strategy: "mobile" });
        ["performance", "accessibility", "seo"].forEach((category) => params.append("category", category));
        const psiResponse = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
        if (!psiResponse.ok) throw new Error(`Google PageSpeed returned ${psiResponse.status}`);
        const psiData = await psiResponse.json();
        const categories = psiData.lighthouseResult?.categories || {};
        const audits = psiData.lighthouseResult?.audits || {};
        if (typeof categories.performance?.score !== "number") throw new Error("PageSpeed did not return a performance score.");
        pagespeed = {
          available: true,
          scores: {
            performance: Math.round(categories.performance.score * 100),
            accessibility: typeof categories.accessibility?.score === "number" ? Math.round(categories.accessibility.score * 100) : null,
            seo: typeof categories.seo?.score === "number" ? Math.round(categories.seo.score * 100) : null
          },
          metrics: {
            lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
            cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
            tbt: audits["total-blocking-time"]?.numericValue ?? null
          }
        };
      } catch (error) {
        pagespeed = { available: false, error: error.message || "PageSpeed request failed." };
      }
    }

    const viewportTag = (html.match(/<meta\b[^>]*name\s*=\s*(?:"viewport"|'viewport')[^>]*>/i) || [])[0] || "";
    const imagesWithAlt = imageTags.filter((tag) => getAttribute(tag, "alt").trim());
    const signals = {
      hasCTA: conversionCTAs.length > 0,
      hasSpecificCTA: conversionCTAs.some((text) => specificCtaPattern.test(text)),
      hasForm: conversionForms.length > 0 && visibleFields.length > 0,
      formFieldCount: visibleFields.length,
      hasH1: headings.length > 0,
      hasDescription: Boolean(description),
      hasSubheading: sectionHeadings.length > 0,
      hasTestimonials: testimonialQuotes.length > 0,
      hasCustomerLogos: customerLogoEvidence.length >= 3,
      hasCaseStudy: caseStudyLinks.length > 0,
      performanceScore: pagespeed.available ? pagespeed.scores.performance : null,
      performanceAvailable: pagespeed.available,
      hasTitle: Boolean(title),
      hasMetaDescription: Boolean(description),
      hasViewport: Boolean(viewportTag),
      hasAltText: imagesWithAlt.length > 0,
      // No popup penalty: static HTML cannot reliably prove popup behavior.
      ctaEvidence: conversionCTAs.slice(0, 4).join(" | "),
      specificCtaEvidence: conversionCTAs.filter((text) => specificCtaPattern.test(text)).slice(0, 3).join(" | "),
      formEvidence: conversionForms.length ? `${conversionForms.length} likely conversion form(s), ${visibleFields.length} visible field(s)` : "",
      h1Evidence: headings[0] || "",
      descriptionEvidence: description,
      subheadingEvidence: sectionHeadings[0] || "",
      testimonialEvidence: testimonialQuotes[0]?.slice(0, 220) || "",
      customerLogoEvidence: customerLogoEvidence.slice(0, 6).map((item) => item.label).join("; "),
      caseStudyEvidence: caseStudyLinks[0] ? `${caseStudyLinks[0].text} — ${caseStudyLinks[0].href}` : "",
      titleEvidence: title,
      metaDescriptionEvidence: description,
      viewportEvidence: getAttribute(viewportTag, "content"),
      altTextEvidence: imagesWithAlt.slice(0, 3).map((tag) => getAttribute(tag, "alt")).join("; ")
    };

    const grading = calculateScore(signals, audienceInfo.audience);
    const extractedEvidence = {
      h1: headings,
      sectionHeadings,
      paragraphs: paragraphs.slice(0, 20),
      pageTextPreview: pageText.slice(0, 1800),
      trust: {
        testimonials: testimonialQuotes.map((text) => text.slice(0, 300)),
        customerLogos: customerLogoEvidence,
        individualCaseStudies: caseStudyLinks
      },
      audience: audienceInfo
    };

    return Response.json({
      success: true,
      url: parsedUrl.toString(),
      status: response.status,
      htmlLength: html.length,
      title,
      description,
      h1Headings: headings,
      buttons,
      detectedCTAs: conversionCTAs,
      extractedEvidence,
      pagespeed,
      grading,
      signals
    });
  } catch (error) {
    const message = error.name === "AbortError" ? "The website took too long to respond." : (error.message || "Something went wrong.");
    return Response.json({ error: message }, { status: 500 });
  }
}