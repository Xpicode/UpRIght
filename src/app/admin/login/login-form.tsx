"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { login, type LoginState } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5 text-sm">
        <span className="text-white/70">Email</span>
        <input
          name="email"
          type="email"
          className="input"
          autoComplete="username"
          defaultValue={state.email ?? ""}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-white/70">Password</span>
        <input
          name="password"
          type="password"
          className="input"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error && (
        <p className="text-sm text-red-300" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-brand mt-2 w-full" disabled={pending}>
        {pending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        Sign in
      </button>
    </form>
  );
}
