import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";
import { GameDataRecord, Ranking } from "@/lib/interfaces";
import axios from "axios";
import { Button } from "./ui/Button";

export default function SubmitButton() {
  const { tiles, submitted, setSubmitted, consensus } = useGameContext();
  const { openModal } = useModal();

  const handleClick = () => {
    const ranking: Ranking = {
      [tiles[0].displayName]: tiles[0].rank!,
      [tiles[1].displayName]: tiles[1].rank!,
      [tiles[2].displayName]: tiles[2].rank!,
      [tiles[3].displayName]: tiles[3].rank!,
    };
    const today = new Date();
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const gameDataRecord: GameDataRecord = {
      metadata: {
        date: dateOnly,
        user: "johndoe",
      },
      consensusId: consensus?._id!,
      submission: ranking,
      location: null,
    };
    axios
      .post("/api/gameData", gameDataRecord)
      .then(function (response) {
        // successfully inserted user submission
        console.log(response);
        axios
          .post("/api/gameData/consensus", consensus)
          .then(function (response) {
            // successfully calculated consensus
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        setSubmitted(true);
      })
      .catch(function (error) {
        console.log(error);
      });

    // alpha beta chungus corporation stedman boston division creative director of rizz

    // gotta wait until the animation's done to open the modal
    setTimeout(() => openModal(), 1500);
  };

  return (
    <Button
      className="w-28"
      disabled={submitted || tiles.some((tile) => tile.rank === undefined)}
      onClick={handleClick}
    >
      Submit
    </Button>
  );
}
