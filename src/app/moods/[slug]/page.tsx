import React from 'react';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import MoodDetailPageClient from './MoodDetailPageClient';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const db = getDb();
  return db.moods.map((m) => ({ slug: m.slug }));
}

export default function MoodRecommendationPage({ params }: Props) {
  const db = getDb();
  const mood = db.moods.find((m) => m.slug === params.slug);

  if (!mood) {
    notFound();
  }

  const productIds = mood.recommendedProductIds || (mood.recommendedProductId ? [mood.recommendedProductId] : []);
  const recommendedProducts = db.products.filter((p) => productIds.includes(p.id));

  return <MoodDetailPageClient mood={mood} recommendedProducts={recommendedProducts} />;
}
