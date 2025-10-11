import { GoogleGenAI } from "@google/genai";
import { useState, useCallback } from "react";

interface GenerateContentOptions {
  prompt: string;
  model?: string;
}

interface UseGoogleGenAIReturn {
  generateContent: (options: GenerateContentOptions) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useGoogleGenAI = (): UseGoogleGenAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  const generateContent = useCallback(
    async ({ prompt, model = "gemini-2.5-flash" }: GenerateContentOptions): Promise<string> => {
      if (!apiKey) {
        const errorMsg = "API key is not configured";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      if (!prompt || prompt.trim() === "") {
        const errorMsg = "Prompt cannot be empty";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setIsLoading(true);
      setError(null);

      try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        });

        const generatedText = response?.text || "";

        if (!generatedText) {
          throw new Error("No content generated from API");
        }
        console.log("generated response:",generatedText)

        return generatedText;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error generating content. Please try again.";
        setError(errorMessage);
        console.error("Google GenAI Error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateContent,
    isLoading,
    error,
    clearError,
  };
};