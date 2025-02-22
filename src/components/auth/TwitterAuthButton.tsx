import { signInWithTwitter } from "@/actions/authActions";
import { motion } from "motion/react";
// test

export default function GoogleAuthButton() {
  return (
    <form action={signInWithTwitter}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="px-4 py-2 border flex gap-2 bg-neutral-200 text-[#0a0a0a] font-bold rounded-lg hover:shadow w-full justify-center items-center"
      >
        <img
          className="w-6 h-6"
          src="https://static.cdnlogo.com/logos/x/9/x.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Sign in with X</span>
      </motion.button>
    </form>
  );
}
