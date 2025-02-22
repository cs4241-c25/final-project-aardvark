import Button from "./ui/Button";
import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";

export default function SubmitButton() {
  const { tiles, submitted, setSubmitted } = useGameContext();
  const { openModal } = useModal();

  const handleClick = () => {
    setSubmitted(true);

    // alpha beta chungus corporation stedman boston division creative director of rizz

    // gotta wait until the animation's done to open the modal
    setTimeout(() => openModal(), 1500);
  }

  return (
    <Button
      className="w-28"
      disabled={submitted || (tiles.some((tile) => tile.rank === undefined))}
      onClick={handleClick}
    >
      Submit
    </Button>
  );
}