
import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("File could not be read as a data URL."));
      }
      // Split the base64 string from the data URL
      const base64Data = reader.result.split(',')[1];
      if (!base64Data) {
        return reject(new Error("Could not extract base64 data from file."));
      }
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generatePoster = async (imageFile: File, prompt: string): Promise<{ imageUrl: string | null; text: string | null }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
                text = part.text;
            }
        }
    }
    
    return { imageUrl, text };
};
