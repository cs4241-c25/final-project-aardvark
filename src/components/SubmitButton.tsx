import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";
import { GameDataRecord, Ranking } from "@/lib/interfaces";
import { getUserScore } from "@/utils/scoreUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function SubmitButton() {
  const { data: session } = useSession();
  const {
    tiles,
    setSubmitted,
    consensusTheme,
    setTodaysConsensus,
    userData,
    setUserData,
    doSubmissionAnimation,
  } = useGameContext();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const { openModal } = useModal();

  const handleClick = async () => {
    // prevent button spam
    setButtonDisabled(true);
    doSubmissionAnimation();

    const ranking: Ranking = {
      [tiles[0].displayName]: tiles[0].rank!,
      [tiles[1].displayName]: tiles[1].rank!,
      [tiles[2].displayName]: tiles[2].rank!,
      [tiles[3].displayName]: tiles[3].rank!,
    };
    // get date from server
    let today = "";
    try {
      const response = await axios.get("/api/date");
      today = response.data.date;
    } catch (error) {
      console.error(error);
    }

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
        setUserData((prevUserData) => ({
          ...prevUserData,
          played: gameDataRecord,
        }));
        setSubmitted(true);
        axios
          .get(`/api/gameData/consensus/${today}`)
          .then(function (response) {
            // successfully calculated consensus
            // set consensus in state
            const consensusObj = response.data.consensusData;
            setTodaysConsensus(consensusObj);

            const userScore = getUserScore(gameDataRecord, consensusObj);
            setUserData((prev) => ({ ...prev, score: userScore }));

            setTimeout(() => openModal("Statistics"), 1500);

            setButtonDisabled(false);
          })
          .catch(function (error) {
            // console.log(error);
          });
      })
      .catch(function (error) {
        // error inserting submission
        // showToast("Error", error, "error");
        setButtonDisabled(false);
      })
      .finally(function () {
        setButtonDisabled(false);
      });

    // alpha beta chungus corporation stedman boston division creative director of rizz

    // gotta wait until the animation's done to open the modal
  };

  return (
    <Button
      className="w-28"
      disabled={buttonDisabled || tiles.some((tile) => tile.rank === undefined)}
      onClick={() =>
        userData.played !== null ? openModal("Statistics") : handleClick()
      }
    >
      {userData.played !== null ? "See Stats" : "Submit"}
    </Button>
  );
}
