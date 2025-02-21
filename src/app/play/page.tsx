'use client'

import { useState } from 'react';

import { useGameContext } from '@/context/GameContext';
import { ModalProvider, useModal } from '@/context/ModalContext';
import Button from '@/components/ui/Button';
import GameHeader from '@/components/GameHeader';
import GameArea from '@/components/GameArea';
import SubmitButton from '@/components/SubmitButton';
import StatsModal from '@/components/StatsModal';

export default function Play() {
  const { tiles, setTiles } = useGameContext();

  return (
    <div className="flex flex-col min-h-screen">
      <ModalProvider>
        <StatsModal />
        <GameHeader category="Seasons" />
        <div className="flex flex-col flex-grow items-center justify-center">
          <GameArea />
          <div className='flex gap-16 justify-center mt-20'>
            <Button
              className='w-28'
              variant='secondary'
              onClick={() => setTiles((prevTiles) => prevTiles.map((tile) => ({ ...tile, rank: undefined })))}
              disabled={tiles.every((tile) => tile.rank === undefined)}
            >
              Clear
            </Button>
            <SubmitButton />
          </div>
        </div>
      </ModalProvider>
    </div>
  );
}
