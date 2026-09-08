import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Inbox, LogOut, Mail, Trash2, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { countByStatus, isDbConfigured, listMessages, type MessageStatus } from "@/lib/db";
import { logout, removeMessage, setMessageStatus } from "./actions";
import { ConfirmButton } from "./confirm-button";

export const metadata = { title: "Inquiries", robots: { index: false } };
export const dynamic = "force-dynamic";

const TABS: { key: MessageStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];

const badge: Record<MessageStatus, string> = {
  new: "bg-brand text-ink",
  read: "bg-white/10 text-white/80",
  replied: "bg-emerald-400/20 text-emerald-200",
  archived: "bg-white/5 text-white/40",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { status } = await searchParams;
  const filter = TABS.some((t) => t.key === status) && status !== "all" ? (status as MessageStatus) : undefined;

  if (!isDbConfigured()) {
    return (
      <Shell email={session.email}>
        <div className="rounded-[1.75rem] border border-amber-300/30 bg-amber-300/10 p-6 text-amber-100">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} /> Database not configured
          </div>
          <p className="mt-2 text-sm text-amber-100/80">
            Set <code>DATABASE_URL</code> in <code>.env.local</code> and run <code>schema.sql</code>{" "}
            against your Neon database. See README.md for the steps.
          </p>
        </div>
      </Shell>
    );
  }

  const [messages, counts] = await Promise.all([listMessages(filter), countByStatus()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Shell email={session.email}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Inquiries</h1>
          <p className="mt-1 text-sm text-white/55">
            {counts.new} new · {total} total
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
          {TABS.map((t) => {
            const active = (filter ?? "all") === t.key;
            const n = t.key === "all" ? total : counts[t.key];
            return (
              <Link
                key={t.key}
                href={t.key === "all" ? "/admin" : `/admin?status=${t.key}`}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                  active ? "bg-brand text-ink" : "text-white/70 hover:bg-white/10",
                ].join(" ")}
              >
                {t.label} <span className="opacity-60">{n}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {messages.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-[1.75rem] border border-dashed border-white/15 py-20 text-center">
          <Inbox size={28} className="text-white/40" />
          <p className="mt-3 text-white/60">No messages here yet.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-bold">{m.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badge[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">
                    <a href={`mailto:${m.email}`} className="hover:underline">
                      {m.email}
                    </a>
                    {m.company ? ` · ${m.company}` : ""}
                    {m.service ? ` · ${m.service}` : ""}
                  </p>
                </div>
                <time
                  dateTime={m.created_at}
                  className="shrink-0 text-xs text-white/45"
                >
                  {new Date(m.created_at).toLocaleString("en-PH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Manila",
                  })}
                </time>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                {m.message}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your inquiry to Upright Solutions")}`}
                  className="btn btn-brand !px-4 !py-2 text-xs"
                >
                  <Mail size={14} /> Reply
                </a>
                {(["new", "read", "replied", "archived"] as MessageStatus[])
                  .filter((s) => s !== m.status)
                  .map((s) => (
                    <form key={s} action={setMessageStatus}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value={s} />
                      <button className="btn btn-ghost !border-white/15 !px-3.5 !py-2 text-xs !text-white/80 hover:!bg-white/10">
                        Mark {s}
                      </button>
                    </form>
                  ))}
                <form action={removeMessage} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton
                    message={`Delete the inquiry from ${m.name}? This cannot be undone.`}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-red-300 hover:bg-red-400/10"
                    aria-label="Delete message"
                  >
                    <Trash2 size={14} /> Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

function Shell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/10">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="" width={36} height={24} className="h-6 w-auto" />
            <span className="font-display font-bold">Upright Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/50 sm:inline">{email}</span>
            <Link href="/" className="text-white/70 hover:text-white">
              View site
            </Link>
            <form action={logout}>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10">
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-x py-10">{children}</div>
    </main>
  );
}
