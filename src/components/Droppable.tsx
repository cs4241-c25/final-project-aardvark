import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const {isOver, setNodeRef} = useDroppable({ id: id });

  const colors = ["#118AB2", "#06D6A0", "#FFD166", "#EF476F"];
  const color = colors[(id as unknown as number)-1];

  return (
    <div
      ref={setNodeRef}
      className={`border h-16 flex justify-center items-center rounded-md font-bold text-xl transition-all`}
      style={{
        borderColor: isOver ? color : 'gray',
        borderWidth: isOver ? '4px' : '2px',
      }}
    >
      {children}
    </div>
  );
};

export default Droppable;