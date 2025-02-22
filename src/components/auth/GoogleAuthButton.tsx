import { signInWithGoogle } from "@/actions/authActions";
import { motion } from "motion/react";

export default function GoogleAuthButton() {
  return (
    <form action={signInWithGoogle}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="px-4 py-2 border flex gap-2 bg-neutral-200 text-[#0a0a0a] font-bold rounded-lg hover:shadow w-full justify-center items-center"
      >
        <img
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Sign in with Google</span>
      </motion.button>
    </form>
  );
}
