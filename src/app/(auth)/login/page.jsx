import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { createPageMetadata } from "@/lib/site";
export const metadata = createPageMetadata(
  "Login",
  "Log in to your StudyNook account to book and list study rooms.",
);

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
