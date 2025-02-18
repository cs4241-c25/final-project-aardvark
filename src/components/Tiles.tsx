import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from 'react';
import clsx from "clsx";

interface DraggableTileProps {
  id: string;
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
        "w-full cursor-grab active:cursor-grabbing"
      )}
    >
      {children}
    </div>
  );
};

const WordBankTile = ({id}: {id?: string}) => {
  if (!id) {
    return (
      <div className="h-12"></div>
    );
  } else {
    return (
      <DraggableTile id={id}>
        <div className="h-12 bg-neutral-300 border-2 border-neutral-400 text-black flex items-center justify-center font-bold rounded-md">
          {id}
        </div>
      </DraggableTile>
    );
  }
};

const SortedTile = ({id, rank}: {id: string, rank: number}) => {
  const colors = ["#118AB2", "#06D6A0", "#FFD166", "#EF476F"];
  const color = colors[rank-1];

  return (
    <DraggableTile id={id}>
      <div
        className={`h-16 flex items-center justify-center font-bold rounded-md text-black`}
        style={{ backgroundColor: color }}
      >
        {id}
      </div>
    </DraggableTile>
  );
}

export {SortedTile, WordBankTile};