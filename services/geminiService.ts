
import { GoogleGenAI, Modality, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateMeditationScript(topic: string, duration: string, style: string): Promise<string> {
    const prompt = `
      Create a detailed guided meditation script.
      The meditation's primary topic is: "${topic}".
      The desired style is: "${style}".
      The total duration should be approximately: ${duration}.
      
      Structure the script with clear sections:
      1.  **Introduction (approx. 15% of time):** Gently guide the listener to a comfortable position and focus on their breath.
      2.  **Main Body (approx. 70% of time):** Deeply explore the topic of "${topic}" using techniques from the "${style}" style. Use calming, evocative language.
      3.  **Conclusion (approx.15% of time):** Slowly bring the listener back to full awareness, encouraging them to carry the feeling of calm with them.
      
      The script should be a single block of text, written in a soothing and gentle tone. Do not include section headings like "Introduction" in the final output.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    
    return response.text;
}


export async function generateMeditationImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
}

export async function generateMeditationAudio(script: string): Promise<string> {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: script }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, soothing voice
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Could not extract audio data from TTS response.");
    }
    return base64Audio;
}

export function createChat(): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly, knowledgeable, and empathetic assistant for the Zenith Meditation app. Your goal is to support users on their mindfulness and well-being journey. Provide helpful, concise, and encouraging answers related to meditation, stress relief, mindfulness, and personal growth. Keep your tone calm and positive.',
        },
    });
}
