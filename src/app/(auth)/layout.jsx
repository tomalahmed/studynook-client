import AppShellLayout from "@/components/layout/AppShellLayout";

export default function AuthLayout({ children }) {
  return (
    <AppShellLayout
      mainClassName="flex items-center justify-center px-4 py-8 sm:px-6 md:py-12 lg:px-10"
      pageShellClassName="w-full max-w-6xl"
    >
      {children}
    </AppShellLayout>
  );
}
