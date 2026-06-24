import RegisterForm from "@/components/auth/RegisterForm";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Register",
  "Create your StudyNook account to list and book study rooms.",
);

export default function RegisterPage() {
  return <RegisterForm />;
}
