import { GoogleGenAI, Type } from "@google/genai";
import { SignalMode, GeneratedCaption } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Image Analysis Function
export const analyzeImageAndGenerateCaptions = async (
  base64Image: string,
  mode: SignalMode
): Promise<{ context: string; captions: GeneratedCaption[] }> => {
  try {
    const prompt = `
      You are a crypto-native creative technologist.
      Analyze the image. Generate 6 witty, crypto-culture relevant captions for a "${mode}" post.
      
      Context for "GM": High energy, builder, "shipping", wagmi.
      Context for "GN": Hopium, reflection, "we made it", rest.
      
      Output JSON: { detectedContext: string, captions: [{text, mood}] }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image.split(",")[1] } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedContext: { type: Type.STRING },
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { text: { type: Type.STRING }, mood: { type: Type.STRING } },
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      context: parsed.detectedContext || "Visual Signal",
      captions: parsed.captions || [],
    };
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return fallbackResponse(mode);
  }
};

// Text-Only Generation Function
export const generateTextCaptions = async (
  tags: string[],
  mode: SignalMode
): Promise<GeneratedCaption[]> => {
  try {
    const context = tags.length > 0 ? tags.join(", ") : "General Crypto Vibes";
    const prompt = `
      Generate 6 witty, crypto-twitter style captions for a "${mode}" post.
      The user has selected these context tags: ${context}.
      
      If the tag includes a specific chain (e.g., gBase, gSol), make sure the lingo matches that ecosystem (e.g., "Based" for Base, "Solana summer" for Sol).
      Keep it short, punchy, and use slang (ser, fren, bags, LFG).
      
      Output JSON: { captions: [{text, mood}] }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is faster/cheaper for text-only
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { text: { type: Type.STRING }, mood: { type: Type.STRING } },
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return parsed.captions || [];
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return fallbackResponse(mode).captions;
  }
};

const fallbackResponse = (mode: SignalMode) => ({
  context: "Signal Interrupted",
  captions: [
    { text: `${mode}. Network congested. We build regardless.`, mood: "Stoic" },
    { text: `Manual ${mode} override initiated. Stay based.`, mood: "Manual" },
    { text: `Connection unstable. Conviction remains high. ${mode}.`, mood: "Glitch" },
    { text: `System reboot required. Still early. ${mode}.`, mood: "Tech" },
    { text: `Signals fading, but bags are heavy. ${mode}.`, mood: "Degen" },
    { text: `Offline mode active. Touch grass. ${mode}.`, mood: "Zen" },
  ],
});
