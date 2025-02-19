import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from 'react';
import clsx from "clsx";

interface DraggableTileProps {
  id: number;
  children: React.ReactNode;
}

const DraggableTile: React.FC<DraggableTileProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "w-full cursor-grab active:cursor-grabbing text-black font-bold text-lg uppercase",
        isDragging ? "z-50" : "z-10",
        isDragging ? "shadow-xl" : null,
      )}
    >
      {children}
    </div>
  );
};

const WordBankTile = ({id, displayName}: {id?: number, displayName?: string}) => {
  if (id === null || id === undefined) {
    return (
      <div className="h-12"></div>
    );
  } else {
    return (
      <DraggableTile id={id}>
        <div className="h-12 dark:bg-foreground bg-neutral-200 flex items-center justify-center rounded">
          {displayName}
        </div>
      </DraggableTile>
    );
  }
};

const SortedTile = ({id, displayName, rank}: {id: number, displayName: string, rank: number}) => {
  const colors = ["#118AB2", "#06D6A0", "#FFD166", "#EF476F"];
  const color = colors[rank-1];

  return (
    <DraggableTile id={id}>
      <div
        className="h-16 flex items-center justify-center rounded"
        style={{ backgroundColor: color }}
      >
        {displayName}
      </div>
    </DraggableTile>
  );
}

export {SortedTile, WordBankTile};