import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: number;
  children: React.ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const {isOver, setNodeRef} = useDroppable({ id: id });

  const colors = ["#118AB2", "#06D6A0", "#FFD166", "#EF476F"];
  const color = colors[id-1];

  return (
    <div
      ref={setNodeRef}
      className="bg-inset h-12 md:h-16 flex justify-center items-center rounded-md transition-all"
      style={{
        borderColor: color,
        borderWidth: isOver ? '6px' : '2px',
      }}
    >
      {children}
    </div>
  );
};

export default Droppable;