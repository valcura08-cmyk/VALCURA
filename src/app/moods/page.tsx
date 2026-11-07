import React from 'react';
import { getDb } from '@/lib/db';
import MoodsClientView from './MoodsClientView';

export const metadata = {
  title: 'Explore By Moods | VALCURA Atelier',
  description: 'Discover your signature fragrance through personal moments, emotions, and our interactive Atelier fragrance quiz.',
};

export default function ExploreMoodPage() {
  const db = getDb();
  return <MoodsClientView moods={db.moods} products={db.products} />;
}
