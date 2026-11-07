import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { evaluateFragranceRecommendation, QuizAnswers } from '@/lib/recommendation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: QuizAnswers = {
      occasion: body.occasion || 'Everyday',
      mood: body.mood || 'Fresh and Uplifting',
      notes: body.notes || 'Citrus and Fresh',
      direction: body.direction || 'Balanced and Unisex',
    };

    const db = getDb();
    const result = evaluateFragranceRecommendation(answers, db.products);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Recommendation API error:', err);
    return NextResponse.json(
      { error: 'Failed to process recommendation' },
      { status: 500 }
    );
  }
}
