import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortedTile, WordBankTile } from './Tiles';
import Droppable from './Droppable';
import WordBank from './WordBank';
import { useGameContext, Tile } from '@/context/GameContext';

function DragDropAreas() {
  const containers = [1, 2, 3, 4];
  const { tiles, setTiles } = useGameContext(); // get tiles

  useEffect(() => {
    console.log(tiles);
  }, [tiles]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeId = active.id as number;
    const overId = over ? (over.id as number) : undefined;
  
    setTiles((prevTiles) => {
      const draggedTile = prevTiles.find((tile) => tile._id === activeId);
      if (!draggedTile) return prevTiles;
  
      // Case 1: Dropped outside any valid container -> Move to Word Bank (rank: undefined)
      if (overId === undefined) {
        return prevTiles.map((tile) =>
          tile._id === activeId ? { ...tile, rank: undefined } : tile
        );
      }
  
      // Case 2 & 3: Dropped inside a container
      const occupiedTile = prevTiles.find((tile) => tile.rank === overId);
  
      return prevTiles.map((tile) => {
        if (tile._id === activeId) {
          // Move dragged tile to new container
          return { ...tile, rank: overId as 1 | 2 | 3 | 4 };
        } else if (occupiedTile && tile._id === occupiedTile._id) {
          // Swap places with the occupying tile
          return { ...tile, rank: draggedTile.rank };
        }
        return tile;
      });
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='w-full max-w-lg'>
        <div className='flex flex-col gap-2 mb-10'>
          {/* Map sorting containers into droppable areas, if the rank of the tile matches the container's id, render the tile at that location */}
          {containers.map((id) => (
            <Droppable key={id} id={id}>
              {tiles.map((tile) =>
                tile.rank === id ? <SortedTile key={tile._id} id={tile._id} displayName={tile.displayName} rank={id} /> : null
              )}
            </Droppable>
          ))}
        </div>
        {/* Map word bank tiles into word bank, if the tile is not in the word bank, it will render an invisible placeholder element */}
        <WordBank>
          {tiles.map((tile) =>
            tile.rank === undefined ? <WordBankTile key={tile._id} id={tile._id} displayName={tile.displayName} /> : <WordBankTile key={tile._id} />
          )}
        </WordBank>
      </div>
    </DndContext>
  );
}

export default DragDropAreas;