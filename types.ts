
export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  occupation: string;
}

export interface HealthLogEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  bloodSugar?: number; // optional
  notes: string;
}

export interface ProductRecommendation {
  name: string;
  description: string;
  category: string;
  source: 'internal' | 'external';
  link: string;
}

export interface AIResponse {
  healthTips: string[];
  mentalWellnessSuggestions: string[];
  productRecommendations: ProductRecommendation[];
}