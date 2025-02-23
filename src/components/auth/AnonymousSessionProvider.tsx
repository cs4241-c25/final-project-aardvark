"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

function AnonymousSessionProvider(props: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      // login as anonymous
      signIn("credentials").then((data) => {});
    }
  }, [status]);

  return props.children;
}

export default AnonymousSessionProvider;
