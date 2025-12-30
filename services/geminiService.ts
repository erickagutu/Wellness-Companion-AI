
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, HealthLogEntry, AIResponse, ProductRecommendation } from '../types';
import { mockProducts } from '../data/mockProducts';

// FIX: The API key must be obtained exclusively from `process.env.API_KEY` as per the coding guidelines. This also resolves the TypeScript error "Property 'env' does not exist on type 'ImportMeta'".
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Updated the error message to reflect the correct environment variable.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIRecommendations = async (userProfile: UserProfile, latestLog: HealthLogEntry): Promise<AIResponse> => {
  const moodMap: { [key: number]: string } = {
    1: 'Very Unhappy',
    2: 'Unhappy',
    3: 'Neutral',
    4: 'Happy',
    5: 'Very Happy',
  };

  const energyMap: { [key: number]: string } = {
    1: 'Very Low Energy',
    2: 'Low Energy',
    3: 'Moderate Energy',
    4: 'High Energy',
    5: 'Very High Energy',
  };

  const prompt = `
    Based on the following user profile and their latest health check-in, act as a compassionate and knowledgeable wellness coach.
    Provide actionable health tips and mental wellness suggestions. 
    Also, provide a list of relevant product *categories* that could help the user.

    User Profile:
    - Age: ${userProfile.age}
    - Height: ${userProfile.height} cm
    - Weight: ${userProfile.weight} kg
    - Occupation: ${userProfile.occupation}

    Today's Check-in:
    - Mood: ${moodMap[latestLog.mood]} (on a scale of 1-5)
    - Energy Level: ${energyMap[latestLog.energy]} (on a scale of 1-5)
    ${latestLog.bloodSugar ? `- Blood Sugar: ${latestLog.bloodSugar} mg/dL` : ''}
    - Notes: "${latestLog.notes}"

    Your response must be a JSON object.
    Provide 3 items for each list: healthTips, mentalWellnessSuggestions, and productCategories.
    The categories should be general (e.g., "Sleep Aid", "Vitamin D Supplement", "Stress Relief Toy").
  `;

  try {
    // FIX: Switched to calling `ai.models.generateContent` directly as recommended by the guidelines, removing the intermediate `model` constant.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable physical health tips.",
            },
            mentalWellnessSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggestions for improving mental well-being.",
            },
            productCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "General categories for relevant health and wellness products.",
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
    
    const cleanedJsonText = jsonText.replace(/```json|```/g, '').trim();
    const aiResult = JSON.parse(cleanedJsonText) as { healthTips: string[], mentalWellnessSuggestions: string[], productCategories: string[]};

    // Process categories into a mix of internal and external recommendations
    const productRecommendations: ProductRecommendation[] = aiResult.productCategories.flatMap(category => {
      const internalProduct = mockProducts.find(p => p.category.toLowerCase() === category.toLowerCase());
      const recommendations: ProductRecommendation[] = [];

      if (internalProduct) {
        recommendations.push({
          ...internalProduct,
          source: 'internal',
          link: `/product/${internalProduct.id}`, // A dummy link for internal product
        });
      }

      recommendations.push({
        name: `Shop for ${category}`,
        description: `Find ${category.toLowerCase()} on Google Shopping.`,
        category: category,
        source: 'external',
        link: `https://www.google.com/search?q=${encodeURIComponent(category)}&tbm=shop`,
      });
      
      return recommendations;
    });


    return {
      ...aiResult,
      productRecommendations,
    };

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    // Provide a fallback response on error
    return {
      healthTips: ["Stay hydrated by drinking plenty of water.", "Aim for 7-8 hours of quality sleep per night.", "Incorporate a 30-minute walk into your daily routine."],
      mentalWellnessSuggestions: ["Practice mindfulness or meditation for 5-10 minutes.", "Connect with a friend or loved one.", "Jot down three things you're grateful for."],
      productRecommendations: [
        { name: "Yoga Mat", description: "For stretching and light exercise at home.", category: "Fitness", source: 'internal', link: '#' },
        { name: "Search for Yoga Mats", description: "Find yoga mats online.", category: "Fitness", source: 'external', link: 'https://www.google.com/search?q=Yoga+Mat&tbm=shop' },
        { name: "Journal", description: "To practice gratitude and process thoughts.", category: "Mental Wellness", source: 'internal', link: '#' },
      ]
    };
  }
};
