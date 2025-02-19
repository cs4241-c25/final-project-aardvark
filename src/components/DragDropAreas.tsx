import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SortedTile, WordBankTile } from './Tiles';
import Droppable from './Droppable';
import WordBank from './WordBank';
import { useGameContext, Tile } from '@/context/GameContext';

function DragDropAreas() {
  const containers = [1, 2, 3, 4];
  const { tiles, setTiles } = useGameContext();
  const [activeTileId, setActiveTileId] = useState<number | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTileId(event.active.id as number);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTileId(null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as number;
    const overId = over ? (over.id as number) : undefined;
    
    setActiveTileId(null);
    
    setTiles((prevTiles) => {
      const draggedTile = prevTiles.find((tile) => tile._id === activeId);
      if (!draggedTile) return prevTiles;
  
      if (overId === undefined) {
        return prevTiles.map((tile) =>
          tile._id === activeId ? { ...tile, rank: undefined } : tile
        );
      }
  
      const occupiedTile = prevTiles.find((tile) => tile.rank === overId);
  
      return prevTiles.map((tile) => {
        if (tile._id === activeId) {
          return { ...tile, rank: overId as 1 | 2 | 3 | 4 };
        } else if (occupiedTile && tile._id === occupiedTile._id) {
          return { ...tile, rank: draggedTile.rank };
        }
        return tile;
      });
    });
  }, [setTiles]);

  const activeTile = tiles.find(tile => tile._id === activeTileId);

  // Render word bank tiles in their designated positions
  const getWordBankTiles = () => {
    // Create array of 4 positions
    return Array.from({ length: 4 }, (_, position) => {
      // Find the tile that belongs in this position
      const tile = tiles.find(
        t => t.rank === undefined && t._id === position
      );

      if (tile) {
        return (
          <WordBankTile 
            key={position}
            id={tile._id} 
            displayName={tile.displayName}
          />
        );
      } else {
        // Find if any tile belongs in this position (even if currently ranked)
        const assignedTile = tiles.find(t => t._id === position);
        // If a tile belongs here but is currently ranked, show empty tile
        return (
          <WordBankTile 
            key={position}
            // Pass the assigned tile's id as a className to style differently if needed
          />
        );
      }
    });
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className='w-full max-w-lg'>
        <div className='flex flex-col gap-2 mb-10'>
          {containers.map((containerId) => (
            <Droppable key={containerId} id={containerId}>
              {tiles
                .filter(tile => tile.rank === containerId)
                .map((tile) => (
                  <SortedTile 
                    key={tile._id} 
                    id={tile._id} 
                    displayName={tile.displayName} 
                    rank={containerId}
                  />
                ))
              }
            </Droppable>
          ))}
        </div>
        <WordBank>
          {getWordBankTiles()}
        </WordBank>
      </div>

      {createPortal(
        <DragOverlay>
          {activeTile && activeTile.rank !== undefined ? (
            <SortedTile 
              id={activeTile._id} 
              displayName={activeTile.displayName} 
              rank={activeTile.rank} 
            />
          ) : activeTile ? (
            <WordBankTile 
              id={activeTile._id} 
              displayName={activeTile.displayName} 
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default DragDropAreas;