'use client'

import { useEffect } from 'react';

import { useGameContext } from '@/context/GameContext';
import DragDropAreas from '@/components/DragDropAreas';

export default function Home() {
  const { items } = useGameContext();

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DragDropAreas />
    </div>
  );
}
