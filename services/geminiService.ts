import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize } from "../types";

// Helper to get client with current key
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// 1. Badge Guide Generator (Text Generation)
export const generateBadgeGuide = async (): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
Create a comprehensive and well-organized \`README.md\` file for a GitHub repository titled **"A Complete List of GitHub Profile Badges and Achievements"**. The repository serves as an official-style guide and reference.

**Core Structure & Tone:**
The README should have a clean, professional, and informative tone, similar to official documentation. It should be structured with clear headers, tables, and bullet points for easy reading.

**Required Content Sections:**
1.  **Introduction:** Briefly explain that GitHub Achievements are digital badges displayed on a user's profile that celebrate milestones, contributions, and engagement on the platform. They act as a reflection of a developer's growth.
2.  **Active Achievements Table:** Create a detailed table of all badges that users can currently earn. For each, include:
    *   **Badge (Name & Emoji)**
    *   **How to Earn:** A concise description of the action required.
    *   **Tiers:** Specify the criteria for Base, Bronze, Silver, and Gold tiers where applicable. Clarify that tiers like "x2" or "x3" represent achievement levels (e.g., over 16 or 128 merged Pull Requests for Pull Shark) and not a simple count.
    *   **Earnable Status:** Mark as "✅ Yes".
    *   **Practical Guide Link:** Add a "Guide" column with a link to a detailed step-by-step guide for earning that specific badge (see "Detailed Guides" section below).
3.  **Retired & Unreleased Badges:** Include a separate section or table noting badges that are no longer earnable (e.g., Arctic Code Vault Contributor) and those that are listed but not yet released (e.g., Heart On Your Sleeve, Open Sourcerer). Clearly state their status.
4.  **Profile Highlights (Not Achievements):** Clearly distinguish these from Achievements. Explain that these are badges representing status or participation in programs. List examples: GitHub Pro, Developer Program Member, Security Bug Bounty Hunter.
5.  **Troubleshooting:** Add a section explaining common reasons why an earned badge might not appear.
6.  **Detailed Guides Section:** For each "Active Achievement," create a separate subsection with a practical, step-by-step guide on how to earn it. Use clear, numbered steps.
7.  **Repository Purpose & Contribution:** State that this is a community-maintained resource to catalog all GitHub profile decorations.

Format as pure Markdown.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "Failed to generate guide.";
};

// 2. Chat with Modes (Lite, Search, Thinking)
export const sendChatMessage = async (
  message: string,
  mode: 'fast' | 'search' | 'thinking',
  history: { role: string; parts: { text: string }[] }[]
) => {
  const ai = getAiClient();
  let model = 'gemini-2.5-flash-lite'; // Default Fast
  let config: any = {};

  if (mode === 'search') {
    model = 'gemini-2.5-flash';
    config.tools = [{ googleSearch: {} }];
  } else if (mode === 'thinking') {
    model = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 32768 };
  } else {
    // Fast mode
    model = 'gemini-2.5-flash-lite';
  }

  // Convert simple history to chat history format if needed, 
  // but here we will just use sendMessage on a fresh chat or manage history manually.
  // For simplicity in this demo, we'll create a new chat with history.
  const chat = ai.chats.create({
    model: model,
    config: config,
    history: history,
  });

  const response = await chat.sendMessage({ message });
  
  let sources: { uri: string; title: string }[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    sources = response.candidates[0].groundingMetadata.groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ uri: web.uri, title: web.title }));
  }

  return {
    text: response.text,
    sources,
  };
};

// 3. Image Generation (Pro)
export const generateBadgeImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAiClient();
  
  // Note: generateImages is for Imagen models. For gemini-3-pro-image-preview we use generateContent.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "1:1" 
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// 4. Image Editing (Flash Image)
export const editProfileImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png', // Assuming PNG input for simplicity, or we can detect
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image returned");
};
