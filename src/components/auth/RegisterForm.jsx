"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button, InputGroup, Label, TextField } from "@heroui/react";
import {
  ArrowRight,
  AtSign,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Share2,
  User,
} from "lucide-react";

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
  "rounded-full border-2 border-surface-variant bg-[#f8eef8] shadow-none data-[focus-within=true]:border-primary data-[focus-within=true]:ring-0";

const inputClass =
  "rounded-full bg-transparent py-4 text-on-surface placeholder:text-[#907898]";

const slideInFromLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

function FieldIcon({ icon: Icon, field, focusedField }) {
  return (
    <Icon
      className={`h-5 w-5 transition-colors ${
        focusedField === field ? "text-primary" : "text-[#907898]"
      }`}
      strokeWidth={2}
      aria-hidden
    />
  );
}

export default function RegisterForm() {
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
      <motion.div
        className="relative hidden flex-col items-center justify-center p-8 lg:flex"
        {...slideInFromLeft}
      >
        <div
          className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#ffd6ee]/30 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-[#c8eaff]/30 blur-3xl"
          aria-hidden
        />

        <motion.div
          className="relative z-10 aspect-square w-full max-w-md"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(124,82,170,0.12)]">
            <Image
              src="/images/register.png"
              alt="Students collaborating in a modern library study space"
              fill
              priority
              sizes="(max-width: 1024px) 0vw, 480px"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        <div className="relative z-10 mt-8 space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tight text-[#7c52aa]">
            Discover your perfect study spot.
          </h2>
          <p className="max-w-sm text-on-surface-variant">
            Join a community of learners dedicated to focus and productivity in
            beautiful environments.
          </p>
        </div>
      </motion.div>

      <motion.div className="w-full" {...slideInFromLeft} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
        <div className="rounded-lg border border-[#dcc8e0]/30 bg-white p-8 shadow-[0_8px_40px_rgba(124,82,170,0.08)] md:p-12">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-black text-primary italic sm:text-4xl">
              Start your journey!
            </h1>
            <p className="text-on-surface-variant">
              Create your StudyNook account in seconds.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <TextField
              name="fullName"
              isRequired
              fullWidth
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
            >
              <Label className="mb-2 block px-2 text-sm font-bold text-[#4a3068]">
                Full Name
              </Label>
              <InputGroup fullWidth className={inputGroupClass}>
                <InputGroup.Prefix className="pl-4">
                  <FieldIcon
                    icon={User}
                    field="fullName"
                    focusedField={focusedField}
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </InputGroup>
            </TextField>

            <TextField
              name="email"
              type="email"
              isRequired
              fullWidth
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            >
              <Label className="mb-2 block px-2 text-sm font-bold text-[#4a3068]">
                Email Address
              </Label>
              <InputGroup fullWidth className={inputGroupClass}>
                <InputGroup.Prefix className="pl-4">
                  <FieldIcon
                    icon={AtSign}
                    field="email"
                    focusedField={focusedField}
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="email"
                  placeholder="hello@studynook.com"
                  className={inputClass}
                />
              </InputGroup>
            </TextField>

            <TextField
              name="photoUrl"
              type="url"
              isRequired
              fullWidth
              onFocus={() => setFocusedField("photoUrl")}
              onBlur={() => setFocusedField(null)}
            >
              <Label className="mb-2 block px-2 text-sm font-bold text-[#4a3068]">
                Profile Photo URL
              </Label>
              <InputGroup fullWidth className={inputGroupClass}>
                <InputGroup.Prefix className="pl-4">
                  <FieldIcon
                    icon={Camera}
                    field="photoUrl"
                    focusedField={focusedField}
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </InputGroup>
            </TextField>

            <TextField
              name="password"
              isRequired
              fullWidth
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            >
              <Label className="mb-2 block px-2 text-sm font-bold text-[#4a3068]">
                Password
              </Label>
              <InputGroup fullWidth className={inputGroupClass}>
                <InputGroup.Prefix className="pl-4">
                  <FieldIcon
                    icon={Lock}
                    field="password"
                    focusedField={focusedField}
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <InputGroup.Suffix className="pr-4">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[#907898] transition-colors hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={2} />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                className="h-auto rounded-full bg-primary py-4 text-lg font-black text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(224,64,160,0.3)] active:scale-[0.97]"
              >
                <span className="flex items-center justify-center gap-2">
                  Register Now
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </span>
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary decoration-2 underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px grow bg-[#dcc8e0]" />
            <span className="text-xs font-bold tracking-widest text-[#907898] uppercase">
              Or join with
            </span>
            <div className="h-px grow bg-[#dcc8e0]" />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-surface-variant transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] hover:border-[#7c52aa] hover:bg-[#eedcff] active:scale-[0.97]"
              aria-label="Continue with Google"
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-surface-variant text-[#907898] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] hover:border-[#7c52aa] hover:bg-[#eedcff] hover:text-[#7c52aa] active:scale-[0.97]"
              aria-label="Join with network"
            >
              <Share2 className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
