import React from 'react';
import { getDb } from '@/lib/db';
import MoodsClientView from './MoodsClientView';

export const metadata = {
  title: 'Explore By Moods | VALCURA',
  description: 'Discover your signature fragrance through personal moments, emotions, and our interactive fragrance quiz.',
};

export default function ExploreMoodPage() {
  const db = getDb();
  return <MoodsClientView moods={db.moods} products={db.products} />;
}
