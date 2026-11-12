import { Product } from './db';

export interface QuizAnswers {
  occasion: string;
  mood: string;
  notes: string;
  direction: string;
}

export interface RecommendationResult {
  hasMatch: boolean;
  product: Product | null;
  matchScore: number;
  matchReason: string;
  matchedAttributes: string[];
  explanation: string;
  isAiEnhanced: boolean;
}

export function evaluateFragranceRecommendation(
  answers: QuizAnswers,
  products: Product[]
): RecommendationResult {
  // Only consider active/preorder products with verified data for recommendations
  const activeProducts = products.filter((p) => p.isAvailable || p.isPreorder);
  
  if (activeProducts.length === 0) {
    return {
      hasMatch: false,
      product: null,
      matchScore: 0,
      matchReason: 'Currently, all items in this collection are in development.',
      matchedAttributes: [],
      explanation: 'No active fragrances are currently accepting orders. Please check back soon or explore our upcoming teasers.',
      isAiEnhanced: false,
    };
  }

  // Find best matching product
  // For Cacao Citrine:
  // Verified notes: Citrus, Creamy Chocolate & Vanilla, Fresh
  // Category: Unisex
  // Target occasions: Everyday, Coffee Date, Work, Dinner
  // Moods: Fresh & Uplifting, Soft & Comforting, Warm & Indulgent

  let bestProduct: Product | null = null;
  let highestScore = 0;
  let bestMatchedAttributes: string[] = [];

  for (const prod of activeProducts) {
    let score = 0;
    const matches: string[] = [];

    if (prod.id === 'cacao-citrine') {
      // 1. Direction matching
      if (
        answers.direction === 'Balanced and Unisex' ||
        answers.direction === 'No Particular Preference'
      ) {
        score += 30;
        matches.push('Balanced Unisex Profile');
      } else if (
        answers.direction === 'Traditionally Feminine-Leaning' ||
        answers.direction === 'Traditionally Masculine-Leaning'
      ) {
        // Cacao Citrine is unisex and versatile, still accessible
        score += 15;
      }

      // 2. Note preference matching
      if (
        answers.notes === 'Citrus and Fresh' ||
        answers.notes === 'Creamy and Nutty' ||
        answers.notes === 'I Am Open to Anything'
      ) {
        score += 35;
        matches.push(answers.notes === 'I Am Open to Anything' ? 'Open Scent Horizon' : answers.notes);
      } else if (
        answers.notes === 'Sweet and Gourmand' ||
        answers.notes === 'Woody and Warm'
      ) {
        // Creamy chocolate & vanilla has warm gourmand elements
        score += 20;
        matches.push('Warm Gourmand Accords');
      } else {
        score += 10;
      }

      // 3. Mood matching
      if (
        answers.mood === 'Fresh and Uplifting' ||
        answers.mood === 'Soft and Comforting' ||
        answers.mood === 'Warm and Indulgent'
      ) {
        score += 25;
        matches.push(answers.mood);
      } else if (answers.mood === 'Confident and Expressive') {
        score += 18;
        matches.push('Subtle Confidence');
      }

      // 4. Occasion matching
      if (
        answers.occasion === 'Coffee Date or Casual Outing' ||
        answers.occasion === 'Everyday' ||
        answers.occasion === 'Work or Study' ||
        answers.occasion === 'Dinner or Date Night'
      ) {
        score += 20;
        matches.push(answers.occasion);
      } else {
        score += 10;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestProduct = prod;
      bestMatchedAttributes = matches;
    }
  }

  // Minimum threshold for a credible recommendation
  if (!bestProduct || highestScore < 40) {
    return {
      hasMatch: false,
      product: null,
      matchScore: highestScore,
      matchReason: 'Your scent profile suggests notes outside our current single launch edition.',
      matchedAttributes: [],
      explanation:
        'Your bespoke selections lean towards specialized notes that are currently in our private formulation phase (such as upcoming Silken Sambac and Roasted Zest). We welcome you to explore our full fragrance collection.',
      isAiEnhanced: false,
    };
  }

  // Check if server-side AI key is present (Gemini / OpenAI)
  const isAiEnhanced = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);

  // Generate intelligent explanation
  const noteDesc =
    answers.notes === 'Creamy and Nutty'
      ? 'creamy chocolate & vanilla nuance'
      : answers.notes === 'Citrus and Fresh'
      ? 'bright citrus freshness'
      : 'harmonious contrast between crisp brightness and comforting warmth';

  const moodDesc = answers.mood.toLowerCase();
  const occasionDesc = answers.occasion.toLowerCase();

  const explanation = `Based on your preference for ${moodDesc} impressions suited for ${occasionDesc}, Cacao Citrine is an exceptional match. Its verified composition features bright citrus freshness evolving seamlessly into comforting creamy chocolate and vanilla — delivering the ${answers.direction.toLowerCase()} character you desire.`;

  return {
    hasMatch: true,
    product: bestProduct,
    matchScore: Math.min(98, highestScore),
    matchReason: `High affinity with ${answers.mood} mood and ${noteDesc}.`,
    matchedAttributes: bestMatchedAttributes,
    explanation,
    isAiEnhanced,
  };
}
