"use client";

import { Suspense, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/admin";
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
          {error}
        </p>
      )}

      <div>
        <Label htmlFor="email" className="site-label">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 bg-trex-card border-0 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="password" className="site-label">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2 bg-trex-card border-0 rounded-xl"
        />
      </div>

      <InteractiveHoverButton
        type="submit"
        disabled={loading}
        text={loading ? "Signing in..." : "Sign in"}
        className="w-full"
      />
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-trex-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-center mb-8">
          Admin Login
        </h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
