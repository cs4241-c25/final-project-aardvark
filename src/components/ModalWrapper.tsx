// ModalWrapper.tsx
import { useModal } from "../context/ModalContext";
import StatsModal from "./StatsModal";
import HowToPlay from "./HowToPlayModal";

const ModalWrapper = () => {
  const { modalType } = useModal();

  if (!modalType) return null;

  return (
    <>
      {modalType === "Statistics" && <StatsModal />}
      {modalType === "How to Play" && <HowToPlay />}
    </>
  );
};

export default ModalWrapper;