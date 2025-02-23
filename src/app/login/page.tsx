"use client";

import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-neutral-900 border-neutral-800">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-neutral-200">
            Log in or create an account
          </h1>
          <div className="space-y-4 md:space-y-6 w-full">
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
