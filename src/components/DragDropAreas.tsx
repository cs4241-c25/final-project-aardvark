import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortedTile, WordBankTile } from './Tiles';
import Droppable from './Droppable';
import WordBank from './WordBank';

function DragDropAreas() {
  const containers = ['1', '2', '3', '4'];
  const tiles = ['A', 'B', 'C', 'D'];

  const [tileParents, setTileParents] = useState<{ tile: string, parent: string | null }[]>(
    tiles.map((tile) => ({ tile, parent: null }))
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const tileId = active.id as string;

    setTileParents((prev) =>
      prev.map((t) => (t.tile === tileId ? { ...t, parent: over ? over.id as string : null } : t))
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='w-full max-w-lg'>
        <div className='flex flex-col gap-2 mb-10'>
          {containers.map((id) => (
            <Droppable key={id} id={id}>
              {tileParents.map((t) =>
                t.parent === id ? <SortedTile key={t.tile} id={t.tile} rank={t.parent as unknown as number}></SortedTile> : null
              )}
            </Droppable>
          ))}
        </div>
        <WordBank>
          {tileParents.map((t) =>
            t.parent === null ? <WordBankTile key={t.tile} id={t.tile}></WordBankTile> : <WordBankTile key={t.tile} />
          )}
        </WordBank>
      </div>
    </DndContext>
  );
}

export default DragDropAreas;