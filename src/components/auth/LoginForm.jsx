"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { LOGIN_IMAGE } from "@/lib/images";
import { ROUTES, safeCallbackUrl } from "@/lib/routes";
import {
  Button,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const inputGroupClass =
  "rounded-full border-none bg-surface-variant shadow-none data-[focus-within=true]:ring-4 data-[focus-within=true]:ring-primary/20";

const inputClass =
  "rounded-full bg-transparent py-4 text-on-surface placeholder:text-[#907898]";

const slideInFromLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const iconColor = (field) =>
    focusedField === field ? "text-primary" : "text-[#907898]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error("Invalid email or password");
      return;
    }

    const tokenRes = await fetch("/api/auth/set-token", {
      method: "POST",
      credentials: "include",
    });

    if (!tokenRes.ok) {
      toast.error("Signed in, but could not start your session. Please try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });

    if (error) {
      toast.error(
        error.message?.includes("Provider not found")
          ? "Google sign-in is not configured. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, then restart the dev server."
          : "Could not sign in with Google. Please try again.",
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-h-[min(700px,calc(100vh-12rem))] flex-col overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_rgba(124,82,170,0.1)] md:flex-row">
        <motion.div
          className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-16"
          {...slideInFromLeft}
        >
        <div className="mb-8 md:mb-10">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
            Welcome Back!
          </h1>
          <p className="text-on-surface-variant">
            Log in to your cozy nook and start learning.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <TextField
            name="email"
            type="email"
            isRequired
            fullWidth
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          >
            <Label className="mb-2 ml-2 text-sm font-bold text-on-surface-variant">
              Email Address
            </Label>
            <InputGroup fullWidth className={inputGroupClass}>
              <InputGroup.Prefix className="pl-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={`h-4 w-4 transition-colors ${iconColor("email")}`}
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                name="email"
                type="email"
                placeholder="hello@studynook.com"
                className={inputClass}
                autoComplete="email"
              />
            </InputGroup>
          </TextField>

          <TextField
            name="password"
            type="password"
            isRequired
            fullWidth
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
          >
            <Label className="mb-2 ml-2 text-sm font-bold text-on-surface-variant">
              Password
            </Label>
            <InputGroup fullWidth className={inputGroupClass}>
              <InputGroup.Prefix className="pl-4">
                <FontAwesomeIcon
                  icon={faLock}
                  className={`h-4 w-4 transition-colors ${iconColor("password")}`}
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                name="password"
                type="password"
                placeholder="••••••••"
                className={inputClass}
                autoComplete="current-password"
              />
            </InputGroup>
          </TextField>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              fullWidth
              isDisabled={isSubmitting || isGoogleLoading}
              className="candy-shadow-primary h-auto rounded-full bg-primary py-4 text-base font-black text-on-primary transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="flex items-center justify-center gap-2">
                Login
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
              </span>
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#dcc8e0]" />
              <span className="mx-4 shrink-0 text-xs font-bold uppercase tracking-widest text-[#907898]">
                or
              </span>
              <div className="flex-grow border-t border-[#dcc8e0]" />
            </div>

            <Button
              type="button"
              fullWidth
              variant="secondary"
              isDisabled={isSubmitting || isGoogleLoading}
              onPress={handleGoogleSignIn}
              className="h-auto rounded-full border border-[#dcc8e0] bg-[#fbf2fb] py-4 text-base font-bold text-on-surface-variant transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="flex items-center justify-center gap-3">
                <GoogleIcon />
                Continue with Google
              </span>
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center font-medium text-on-surface-variant md:mt-12">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.register}
            className="ml-1 font-black text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>

      <motion.div
        className="relative hidden w-1/2 overflow-hidden bg-[#eedcff] md:flex md:items-center md:justify-center md:p-12"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        <div
          className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#0096cc]/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          <motion.div
            className="w-full max-w-md rotate-2 rounded-xl border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-sm"
            whileHover={{
              rotate: 0,
              scale: 1.04,
              y: -8,
            }}
            transition={{
              duration: 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-inner">
              <Image
                src={LOGIN_IMAGE}
                alt="A cozy and modern study nook in a library"
                fill
                priority
                sizes="(max-width: 768px) 0vw, 400px"
                className="object-contain object-center"
              />
            </div>
          </motion.div>

          <div className="mt-10 space-y-4 text-center">
            <motion.span
              className="inline-block rounded-full bg-[#ffd6ee] px-6 py-2 text-sm font-black uppercase tracking-widest text-[#a02070]"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Productive Vibes
            </motion.span>
            <h2 className="text-2xl font-black leading-tight text-[#2e2040] lg:text-3xl">
              Find your perfect <br />
              <span className="italic text-primary">Learning Space.</span>
            </h2>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
