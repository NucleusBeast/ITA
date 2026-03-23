import { AuthFormCard } from "@/components/auth/auth-form-card";

export default function AuthPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8">
      <AuthFormCard
        allowSignup
        redirectTo="/profile"
        title="Sign in"
        subtitle="Use your existing account to access your profile, or create a new account."
      />
    </main>
  );
}
