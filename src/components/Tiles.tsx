import { useDraggable } from "@dnd-kit/core";
import React from 'react';
import clsx from "clsx";
import { useGameContext, Tile } from "@/context/GameContext";
import { motion } from "motion/react";

interface DraggableTileProps {
  tile: Tile;
}

const DraggableTile: React.FC<DraggableTileProps> = ({ tile }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tile._id });

  const colors = ["#118AB2", "#06D6A0", "#FFD166", "#EF476F"];
  const color = tile.rank ? colors[tile.rank-1] : "#E5E5E5"

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    backgroundColor: color,
  };

  const className = "w-full h-full rounded cursor-grab active:cursor-grabbing text-black font-bold text-lg uppercase flex justify-center items-center";

  if (tile.rank === undefined) {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={className}
      >
        {tile.displayName}
      </motion.div>
    );
  } else {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={className}
      >
        {tile.displayName}
      </motion.div>
    );
  }
};

export { DraggableTile };