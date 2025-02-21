import Button from "./ui/Button";
import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";

export default function SubmitButton() {
  const { tiles } = useGameContext();
  const { openModal } = useModal();

  const handleClick = () => {
    
    // do some stuff here
    // once ranking is submitted, open modal
    openModal();
  }

  return (
    <Button
      className="w-28"
      disabled={tiles.some((tile) => tile.rank === undefined)}
      onClick={handleClick}
    >
      Submit
    </Button>
  );
}