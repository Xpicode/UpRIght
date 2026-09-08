import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/images/logo.svg" alt="" width={36} height={24} className="h-6 w-auto" />
          <span className="font-display font-bold">Upright Admin</span>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
          <h1 className="font-display text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-white/55">Access the inquiries dashboard.</p>
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </main>
  );
}
