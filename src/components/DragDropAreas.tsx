import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { DraggableTile } from './Tiles';
import Droppable from './Droppable';
import WordBank from './WordBank';
import { useGameContext, Tile } from '@/context/GameContext';

function DragDropAreas() {
  const containers = [1, 2, 3, 4];
  const { tiles, setTiles } = useGameContext();
  const [activeTileId, setActiveTileId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

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

  const getWordBankTiles = () => {
    return Array.from({ length: 4 }, (_, position) => {
      const tile = tiles.find(t => t.rank === undefined && t._id === position);
      if (tile) {
        return <DraggableTile key={position} tile={tile} />;
      } else {
        const assignedTile = tiles.find(t => t._id === position);
        return <div key={`empty-${position}`} className='h-12'></div>;
      }
    });
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className='w-full px-8 md:max-w-lg'>
        <div className='flex flex-col gap-2 mb-10'>
          {containers.map((containerId) => (
            <Droppable key={containerId} id={containerId}>
              {tiles
                .filter(tile => tile.rank === containerId)
                .map((tile) => (
                  <DraggableTile key={tile._id} tile={tile} />
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
          {activeTile && <DraggableTile tile={activeTile} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default DragDropAreas;