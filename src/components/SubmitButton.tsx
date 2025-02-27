import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";
import { GameDataRecord, Ranking } from "@/lib/interfaces";
import { getDateString } from "@/utils/dateFormat";
import { getUserScore } from "@/utils/scoreUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function SubmitButton() {
  const { data: session } = useSession();
  const { tiles, submitted, setSubmitted, consensusTheme, setTodaysConsensus } =
    useGameContext();
  const { openModal } = useModal();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleClick = () => {
    // prevent button spam
    setButtonDisabled(true);

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
        setSubmitted(true);
        axios
          .post("/api/gameData/consensus", consensusTheme)
          .then(function (response) {
            // successfully calculated consensus
            const consensusObj = response.data.consensusData;
            let userSubmissionString = "";
            Object.entries(consensusObj.consensus).forEach(([key, _value]) => {
              userSubmissionString += String(ranking[key]);
            });
            // get user score
            const userScore = getUserScore(userSubmissionString);
            consensusObj.userScore = userScore;
            setTodaysConsensus(consensusObj);

            setButtonDisabled(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        // error inserting submission
        setButtonDisabled(false);
        console.log(error);
      })
      .finally(function () {
        setButtonDisabled(false);
      });

    // alpha beta chungus corporation stedman boston division creative director of rizz

    // gotta wait until the animation's done to open the modal
    // setTimeout(() => openModal("Statistics"), 1500);
  };

  return (
    <Button
      className="w-28"
      disabled={
        buttonDisabled ||
        submitted ||
        tiles.some((tile) => tile.rank === undefined)
      }
      onClick={handleClick}
    >
      Submit
    </Button>
  );
}
