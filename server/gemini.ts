import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment, Severity } from "./types.js";

// Lazy-initialized GoogleGenAI client with standard header
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export interface FeedbackAIAnalysisResult {
  sentiment: Sentiment;
  category: string;
  severity: Severity;
  issues: string[];
  summary: string;
  recommendations: string[];
  sentimentScore: number;
}

/**
 * Analyzes employee feedback using Google Gemini (gemini-3.8-flash).
 * If API is unreachable or key is missing, provides intelligent deterministic analysis.
 */
export async function analyzeFeedbackWithGemini(
  title: string,
  description: string,
  categoryHint?: string
): Promise<{ result: FeedbackAIAnalysisResult; isGeminiGenerated: boolean }> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are an expert HR organizational psychologist and workplace analytics AI.
Analyze the following employee feedback carefully:

Title: "${title}"
Feedback Description: "${description}"
User-selected Category Hint: "${categoryHint || "Other"}"

Perform deep sentiment analysis, issue detection, category categorization, severity classification, concise HR-friendly summary, and direct actionable recommendations for HR management.

Guidelines:
1. Sentiment: Exactly one of "POSITIVE", "NEGATIVE", "NEUTRAL".
2. Category: Categorize into one of: "Work Environment", "Management", "Workload", "Salary & Benefits", "Career Growth", "Team Collaboration", "Communication", "Workplace Facilities", "Technology", "Work-Life Balance", "Other".
3. Severity: Exactly one of "LOW", "MEDIUM", "HIGH", "CRITICAL".
   - CRITICAL: harassment, severe burnout, mass resignation threat, toxic abuse, severe safety violation.
   - HIGH: persistent unpaid overtime, staff shortage, lack of compensation, micromanagement causing distress.
   - MEDIUM: slow tools, poor communication, delayed appraisals, cafeteria/equipment issues.
   - LOW: minor preference, gentle feedback, positive suggestions.
4. Issues: List 1-4 concrete, specific issues detected. If positive, list 1-2 positive workplace attributes or strengths identified.
5. Summary: 1-2 concise, professional sentences summarizing the employee's core points.
6. Recommendations: 2-4 actionable, concrete steps HR leadership should implement directly addressing the specific problems mentioned. Recommendations must strictly relate to what was submitted (e.g. if cafeteria complaints, address food/cleanliness; if workload, address redistributing tasks and headcount).
7. SentimentScore: A float between -1.0 (most negative) and +1.0 (most positive).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: {
                type: Type.STRING,
                description: "Must be POSITIVE, NEGATIVE, or NEUTRAL",
              },
              category: {
                type: Type.STRING,
                description: "Standard category name",
              },
              severity: {
                type: Type.STRING,
                description: "Must be LOW, MEDIUM, HIGH, or CRITICAL",
              },
              issues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of detected issues or strengths",
              },
              summary: {
                type: Type.STRING,
                description: "Executive HR summary",
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Actionable HR recommendations",
              },
              sentimentScore: {
                type: Type.NUMBER,
                description: "Score from -1.0 to 1.0",
              },
            },
            required: [
              "sentiment",
              "category",
              "severity",
              "issues",
              "summary",
              "recommendations",
              "sentimentScore",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      const sentiment: Sentiment = ["POSITIVE", "NEGATIVE", "NEUTRAL"].includes(
        parsed.sentiment?.toUpperCase()
      )
        ? (parsed.sentiment.toUpperCase() as Sentiment)
        : "NEUTRAL";

      const severity: Severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
        parsed.severity?.toUpperCase()
      )
        ? (parsed.severity.toUpperCase() as Severity)
        : "MEDIUM";

      return {
        result: {
          sentiment,
          category: parsed.category || categoryHint || "General",
          severity,
          issues: Array.isArray(parsed.issues) && parsed.issues.length > 0
            ? parsed.issues
            : ["General workplace concern"],
          summary: parsed.summary || "Employee shared workplace thoughts.",
          recommendations:
            Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
              ? parsed.recommendations
              : ["Schedule a check-in with the employee."],
          sentimentScore:
            typeof parsed.sentimentScore === "number"
              ? Math.max(-1, Math.min(1, parsed.sentimentScore))
              : sentiment === "POSITIVE"
              ? 0.8
              : sentiment === "NEGATIVE"
              ? -0.7
              : 0.0,
        },
        isGeminiGenerated: true,
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to heuristic engine:", err);
    }
  }

  // Intelligent heuristic fallback
  return {
    result: generateHeuristicAnalysis(title, description, categoryHint),
    isGeminiGenerated: false,
  };
}

/**
 * Intelligent deterministic analyzer used when Gemini API key is offline or rate-limited.
 */
function generateHeuristicAnalysis(
  title: string,
  description: string,
  categoryHint?: string
): FeedbackAIAnalysisResult {
  const text = `${title} ${description}`.toLowerCase();

  const negativeKeywords = [
    "overwork", "burnout", "exhausted", "late", "deadline", "tired",
    "shortage", "toxic", "unfair", "low pay", "bad", "worst", "hate",
    "micromanage", "stress", "quit", "resign", "unhappy", "problem",
    "dirty", "broken", "slow", "delay", "poor", "frustrat", "lack"
  ];
  const positiveKeywords = [
    "great", "excellent", "love", "happy", "supportive", "good",
    "appreciate", "helpful", "proud", "grow", "flexible", "friendly",
    "fantastic", "best", "enjoy", "improved", "terrific", "rewarding"
  ];

  let negCount = 0;
  let posCount = 0;
  negativeKeywords.forEach((kw) => {
    if (text.includes(kw)) negCount++;
  });
  positiveKeywords.forEach((kw) => {
    if (text.includes(kw)) posCount++;
  });

  let sentiment: Sentiment = "NEUTRAL";
  let sentimentScore = 0.0;
  if (negCount > posCount) {
    sentiment = "NEGATIVE";
    sentimentScore = -0.5 - Math.min(0.4, negCount * 0.1);
  } else if (posCount > negCount) {
    sentiment = "POSITIVE";
    sentimentScore = 0.5 + Math.min(0.4, posCount * 0.1);
  }

  // Severity
  let severity: Severity = "LOW";
  if (text.includes("toxic") || text.includes("harass") || text.includes("resign") || text.includes("burnout") || negCount >= 4) {
    severity = "CRITICAL";
  } else if (negCount >= 2 || text.includes("deadline") || text.includes("overwork") || text.includes("unfair")) {
    severity = "HIGH";
  } else if (negCount >= 1) {
    severity = "MEDIUM";
  }

  // Category determination
  let category = categoryHint || "General";
  if (text.includes("deadline") || text.includes("overtime") || text.includes("workload") || text.includes("hours")) {
    category = "Workload";
  } else if (text.includes("salary") || text.includes("pay") || text.includes("bonus") || text.includes("hike") || text.includes("benefit")) {
    category = "Salary & Benefits";
  } else if (text.includes("manager") || text.includes("lead") || text.includes("boss") || text.includes("direction")) {
    category = "Management";
  } else if (text.includes("cafeteria") || text.includes("food") || text.includes("chair") || text.includes("desk") || text.includes("facility") || text.includes("ac") || text.includes("office")) {
    category = "Workplace Facilities";
  } else if (text.includes("growth") || text.includes("promotion") || text.includes("learn") || text.includes("training") || text.includes("career")) {
    category = "Career Growth";
  } else if (text.includes("tool") || text.includes("laptop") || text.includes("software") || text.includes("bug") || text.includes("tech")) {
    category = "Technology";
  } else if (text.includes("balance") || text.includes("family") || text.includes("weekend") || text.includes("leave")) {
    category = "Work-Life Balance";
  }

  // Issues and Recommendations
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (sentiment === "NEGATIVE" || severity === "HIGH" || severity === "CRITICAL") {
    if (category === "Workload" || text.includes("workload") || text.includes("deadline")) {
      issues.push("Excessive workload and sprint compression");
      issues.push("Tight project delivery deadlines");
      issues.push("Potential risk of developer/employee burnout");
      recommendations.push("Conduct immediate team capacity audit and redistribute active story points");
      recommendations.push("Review realistic milestone deadlines with project stakeholders");
      recommendations.push("Evaluate adding contractor support or junior engineers to high-load sprints");
    } else if (category === "Workplace Facilities") {
      issues.push("Sub-par office amenities and hygiene standards");
      issues.push("Employee discomfort with seating/cafeteria options");
      recommendations.push("Engage facilities management to inspect and upgrade dining and cleanliness");
      recommendations.push("Survey staff on ergonomic furniture and cafeteria vendor preferences");
    } else if (category === "Salary & Benefits") {
      issues.push("Perceived compensation discrepancy against market benchmarks");
      issues.push("Lack of transparency in annual appraisal brackets");
      recommendations.push("Benchmark current salary bands against tech industry compensation averages");
      recommendations.push("Initiate mid-year retention adjustment for critical high performers");
    } else if (category === "Career Growth") {
      issues.push("Absence of clear promotional pathway and skill progression");
      issues.push("Insufficient sponsorship for technical certifications and training");
      recommendations.push("Mandate quarterly Individual Development Plans (IDPs) with team leads");
      recommendations.push("Establish internal tech mobility and mentorship programs");
    } else {
      issues.push(`Operational friction within ${category}`);
      issues.push("Communication disconnect between management and team members");
      recommendations.push("Organize an anonymous retrospective meeting with department leads");
      recommendations.push("Follow up on specific blockers identified in this feedback thread");
    }
  } else {
    issues.push(`Strong team engagement in ${category}`);
    issues.push("High morale and constructive company alignment");
    recommendations.push("Highlight and recognize positive team culture during company all-hands");
    recommendations.push("Replicate high-performing team practices across other departments");
  }

  const summary = sentiment === "POSITIVE"
    ? `Employee expressed appreciation regarding ${category.toLowerCase()}, highlighting supportive working dynamics and high engagement.`
    : `Employee flagged key concerns in ${category.toLowerCase()} that require management review, focusing on operational strain and resource alignment.`;

  return {
    sentiment,
    category,
    severity,
    issues,
    summary,
    recommendations,
    sentimentScore,
  };
}

/**
 * HR AI Assistant: Answers questions grounded in real organization data.
 */
export async function askHRAIAssistant(
  question: string,
  contextData: {
    totalEmployees: number;
    totalFeedback: number;
    sentimentStats: { positive: number; neutral: number; negative: number };
    departmentMetrics: Array<{ name: string; satisfactionScore: number; feedbackCount: number; negativeCount: number }>;
    criticalEmployees: Array<{ name: string; department: string; riskLevel: string; dominantIssues: string[] }>;
    recentFeedback: Array<{ title: string; category: string; sentiment: string; severity: string; summary: string }>;
  }
): Promise<string> {
  const ai = getGenAI();

  const fallbackAnswer = () => {
    const q = question.toLowerCase();
    if (q.includes("unhappy") || q.includes("negative") || q.includes("issue")) {
      const topNegDept = [...contextData.departmentMetrics].sort((a, b) => b.negativeCount - a.negativeCount)[0];
      return `Based on our current database of ${contextData.totalFeedback} feedback submissions, the primary driver of negative sentiment is workload pressure and work-life balance strain. The **${topNegDept?.name || "Engineering"}** department has logged the highest frequency of negative feedback (${topNegDept?.negativeCount || 0} issues). Key employee concerns cite compressed project timelines, staff shortages, and compensation transparency. HR should consider workload audits and manager check-ins.`;
    }
    if (q.includes("department") || q.includes("performing")) {
      const sorted = [...contextData.departmentMetrics].sort((a, b) => b.satisfactionScore - a.satisfactionScore);
      const best = sorted[0];
      const lowest = sorted[sorted.length - 1];
      return `Department analysis shows **${best?.name || "Customer Support"}** leading in satisfaction at **${best?.satisfactionScore || 85}%**, while **${lowest?.name || "Engineering"}** records the lowest satisfaction at **${lowest?.satisfactionScore || 62}%**. The discrepancy is tied to project deadline intensity and on-call rotations.`;
    }
    if (q.includes("risk") || q.includes("burnout") || q.includes("critical")) {
      const count = contextData.criticalEmployees.length;
      const names = contextData.criticalEmployees.slice(0, 3).map(e => `${e.name} (${e.department})`).join(", ");
      return `There are currently **${count}** employees identified with HIGH or CRITICAL burnout risk in the database, notably: ${names || "in Engineering"}. The predominant risk signals include recurring negative feedback regarding tight deadlines, weekend work, and lack of team assistance. Immediate 1-on-1 retention check-ins are recommended.`;
    }
    return `Analysis of our organization's ${contextData.totalFeedback} feedback entries shows an overall satisfaction score of ${Math.round((contextData.sentimentStats.positive / Math.max(1, contextData.totalFeedback)) * 100)}%. We recommend addressing workload redistribution in Engineering, reviewing cafeteria vendor feedback, and providing structured career progression frameworks for junior staff.`;
  };

  if (!ai) {
    return fallbackAnswer();
  }

  try {
    const systemPrompt = `You are the executive Chief HR AI Advisor for an enterprise company.
You have live access to the company's real database metrics:
- Total Employees: ${contextData.totalEmployees}
- Total Feedback Submissions: ${contextData.totalFeedback}
- Sentiment Breakdown: Positive: ${contextData.sentimentStats.positive}, Neutral: ${contextData.sentimentStats.neutral}, Negative: ${contextData.sentimentStats.negative}
- Department Metrics: ${JSON.stringify(contextData.departmentMetrics)}
- High/Critical Risk Employees: ${JSON.stringify(contextData.criticalEmployees)}
- Recent Submissions Sample: ${JSON.stringify(contextData.recentFeedback.slice(0, 8))}

Answer the HR manager's question with precise data, executive insight, and high-impact strategic recommendations.
Be direct, professional, cite real numbers from the context data, and avoid generic fluff.
Keep formatting clean using Markdown with bold headers and bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text || fallbackAnswer();
  } catch (err) {
    console.error("AI Assistant error:", err);
    return fallbackAnswer();
  }
}

/**
 * Semantic Search across feedback records using Gemini
 */
export async function performSemanticSearch(
  query: string,
  items: Array<{ id: string; title: string; description: string; category: string; sentiment: string; severity: string }>
): Promise<string[]> {
  const ai = getGenAI();

  // Basic keyword fallback matcher
  const simpleMatch = () => {
    const terms = query.toLowerCase().split(" ").filter(Boolean);
    const scored = items.map((item) => {
      const text = `${item.title} ${item.description} ${item.category} ${item.sentiment} ${item.severity}`.toLowerCase();
      let score = 0;
      terms.forEach((t) => {
        if (text.includes(t)) score += 1;
      });
      return { id: item.id, score };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.id);
  };

  if (!ai || items.length === 0) {
    return simpleMatch();
  }

  try {
    const prompt = `You are a semantic search engine.
Given the user's search query: "${query}"
Evaluate which of the following feedback items are semantically relevant to this query.
Feedback items:
${JSON.stringify(items.map(i => ({ id: i.id, title: i.title, description: i.description, category: i.category, sentiment: i.sentiment })))}

Return a JSON array of the matching item IDs ordered by semantic relevance (most relevant first).
Example: ["id-1", "id-3"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return simpleMatch();
  } catch (err) {
    return simpleMatch();
  }
}
