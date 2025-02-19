'use client'

import { useEffect } from 'react';

import { useGameContext } from '@/context/GameContext';
import DragDropAreas from '@/components/DragDropAreas';
import Button from '@/components/ui/Button';
import GameHeader from '@/components/GameHeader';

export default function Home() {
  const { tiles, setTiles } = useGameContext();

  return (
    <div className="flex flex-col min-h-screen">
      <GameHeader category='Seasons' />
      <div className='flex flex-col flex-grow items-center justify-center'>
        <DragDropAreas />
        <div className='flex gap-16 justify-center mt-20'>
          <Button
            className='w-28'
            variant='secondary'
            onClick={() => setTiles((prevTiles) => prevTiles.map((tile) => ({ ...tile, rank: undefined })))}
            disabled={tiles.every((tile) => tile.rank === undefined)}
          >
            Clear
          </Button>

          {/* submit button should be its own component eventually */}
          <Button
            className='w-28'
            disabled={tiles.some((tile) => tile.rank === undefined)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
