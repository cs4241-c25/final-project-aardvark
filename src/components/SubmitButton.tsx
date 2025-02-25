import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";
import { GameDataRecord, Ranking } from "@/lib/interfaces";
import { getDateString } from "@/utils/dateFormat";
import { getUserScore } from "@/utils/scoreMap";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";

export default function SubmitButton() {
  const { data: session } = useSession();
  const { tiles, submitted, setSubmitted, consensusTheme, setTodaysConsensus } =
    useGameContext();
  const { openModal } = useModal();

  const handleClick = () => {
    const ranking: Ranking = {
      [tiles[0].displayName]: tiles[0].rank!,
      [tiles[1].displayName]: tiles[1].rank!,
      [tiles[2].displayName]: tiles[2].rank!,
      [tiles[3].displayName]: tiles[3].rank!,
    };
    const today = getDateString(new Date());
    const gameDataRecord: GameDataRecord = {
      metadata: {
        date: today,
        user: String(session?.user?.email),
      },
      consensusId: consensusTheme?._id || null,
      submission: ranking,
      location: null,
    };
    axios
      .post("/api/gameData", gameDataRecord)
      .then(function (response) {
        // successfully inserted user submission
        console.log(response);
        axios
          .post("/api/gameData/consensus", consensusTheme)
          .then(function (response) {
            // successfully calculated consensus
            const consensusObj = response.data.consensusData;
            let userSubmissionString = "";
            Object.entries(consensusObj.consensus).forEach(([key, _value]) => {
              userSubmissionString += String(ranking[key]);
            });
            const userScore = getUserScore(userSubmissionString);
            consensusObj.userScore = userScore;
            setTodaysConsensus(consensusObj);
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
