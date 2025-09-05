
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeAndTag({ title, content }) {
  const prompt = `
You are helping with a team knowledge base.
1) Provide a crisp summary (max 80 words) of the text.
2) Provide 5-8 short tags (single or two words), lowercase.
Return JSON with keys: summary, tags (array).
TEXT TITLE: ${title}
TEXT: ${content}
`;

  try {
    const r = await textModel.generateContent(prompt);
    const txt = r.response.text();

    try {
      const parsed = JSON.parse(txt.replace(/json|```/gi, "").trim());
      return { summary: parsed.summary || "", tags: parsed.tags || [] };
    } catch {
     
      const summary = txt.split("\n")[0].trim();
      const tags =
        (txt.match(/\b[a-z0-9\-]+(?:\s[a-z0-9\-]+)?/gi) || []).slice(0, 6);
      return { summary, tags };
    }
  } catch (err) {
    console.error("summarizeAndTag error:", err.message);
    return { summary: "", tags: [] };
  }
}

export async function getEmbedding(text) {
  try {
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await embedModel.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.error("getEmbedding error:", err.message);
    return [];
  }
}

function cosineSimilarity(a, b) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function semanticSearch(queryEmbedding, docs) {
  return docs
    .map((doc) => {
      if (!doc.embedding?.length) return null;
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc.toObject(), score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
export async function askQuestion(question, context) {
  try {
    const prompt = `
You are a helpful assistant for a software dev team.
Use the following document context to answer the question:

${context}

Question: ${question}
Answer:
`;

    const result = await textModel.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Q/A error:", err);
    return "Sorry, I couldn't generate an answer.";
  }
}
