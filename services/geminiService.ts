
import { GoogleGenAI, Type } from "@google/genai";
import type { Task } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we assume the API key is set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function suggestTasks(goal: string): Promise<Pick<Task, 'text' | 'completed'>[]> {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a productivity assistant. Break down the following high-level goal into a simple, actionable list of tasks. Goal: "${goal}". Provide at least 3 tasks.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tasks: {
                        type: Type.ARRAY,
                        description: 'A list of task strings.',
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            },
        },
    });

    const responseText = response.text.trim();
    const parsedJson = JSON.parse(responseText);
    
    if (parsedJson.tasks && Array.isArray(parsedJson.tasks)) {
      return parsedJson.tasks.map((taskText: string) => ({
        text: taskText,
        completed: false,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get task suggestions from AI.");
  }
}
