
import { GoogleGenAI, Type } from "@google/genai";
import { SignalMode, GeneratedCaption, ImageStyle } from "../types";

// Initialize Gemini Client Lazily or Safely
const getAiClient = () => {
  try {
    // Check if process is defined to avoid ReferenceError in non-node environments
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.warn("API_KEY not found in process.env");
      // If we can't find the key, we might be in a different env or it's missing.
      // Returning null will trigger fallback.
      return null;
    }
  } catch (error) {
    console.error("Failed to initialize Gemini Client", error);
    return null;
  }
};

// Image Analysis Function
export const analyzeImageAndGenerateCaptions = async (
  base64Image: string,
  mode: SignalMode,
  tags: string[] = []
): Promise<{ context: string; captions: GeneratedCaption[] }> => {
  const ai = getAiClient();
  if (!ai) return fallbackResponse(mode);

  try {
    const contextStr = tags.length > 0 ? `User context tags: ${tags.join(", ")}.` : "";
    
    const prompt = `
      You are a crypto-native creative technologist.
      Analyze the image. Generate 6 witty, crypto-culture relevant captions for a "${mode}" post.
      ${contextStr}
      
      Context for "GM": High energy, builder, "shipping", wagmi.
      Context for "GN": Hopium, reflection, "we made it", rest.
      
      Output JSON: { detectedContext: string, captions: [{text, mood}] }
    `;

    // Using gemini-3-flash-preview for faster response on text/multimodal tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    let jsonString = response.text || "{}";
    // Clean up markdown if present
    jsonString = jsonString.replace(/```json|```/g, '').trim();
    
    const parsed = JSON.parse(jsonString);
    const captions = (parsed.captions || []).map((c: any, i: number) => ({
      ...c,
      id: `gen-${Date.now()}-${i}`
    }));

    return {
      context: parsed.detectedContext || "Visual Signal",
      captions,
    };
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return fallbackResponse(mode);
  }
};

// Image Generation Function
export const generateCryptoImage = async (
  captionText: string,
  contextTags: string[],
  mode: SignalMode,
  style: ImageStyle
): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const context = contextTags.length > 0 ? contextTags.join(", ") : "Crypto Culture";
    
    let stylePrompt = "";
    if (style === 'MEME') {
      stylePrompt = "Create a funny, viral crypto meme style image. Cartoonish, high contrast, internet culture aesthetic, pepe or doge vibes but original.";
    } else {
      stylePrompt = "Create a Beeple-style digital art masterpiece. Dystopian yet hopeful, cyberpunk, neon aesthetic, highly detailed, 3D render, surrealism, monumental scale.";
    }

    const prompt = `
      ${stylePrompt}
      Visualize this caption: "${captionText}"
      Context keywords: ${context}, ${mode}.
      Make it look amazing for Crypto Twitter.
      No text in the image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

const fallbackResponse = (mode: SignalMode) => ({
  context: "Signal Interrupted",
  captions: [
    { id: 'err1', text: `${mode}. Network congested. We build regardless.`, mood: "Stoic" },
    { id: 'err2', text: `Manual ${mode} override initiated. Stay based.`, mood: "Manual" },
    { id: 'err3', text: `Connection unstable. Conviction remains high. ${mode}.`, mood: "Glitch" },
    { id: 'err4', text: `System reboot required. Still early. ${mode}.`, mood: "Tech" },
    { id: 'err5', text: `Signals fading, but bags are heavy. ${mode}.`, mood: "Degen" },
    { id: 'err6', text: `Offline mode active. Touch grass. ${mode}.`, mood: "Zen" },
  ],
});
