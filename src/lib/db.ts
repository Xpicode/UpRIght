import postgres from "postgres";

/**
 * Postgres access via postgres.js. Works with:
 *   - the local Docker database from docker-compose.yml
 *   - Neon / Supabase / any hosted Postgres (paste their connection string)
 *
 * Set DATABASE_URL in .env.local (see .env.example) and run `schema.sql` once.
 * (docker compose runs schema.sql automatically on first start.)
 */
export type MessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

// Re-use one connection pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!globalForDb.__sql) {
    globalForDb.__sql = postgres(url, {
      max: 5,
      // Hosted providers (Neon, Supabase) need SSL; local Docker does not.
      ssl: /localhost|127\.0\.0\.1|@db[:/]/.test(url) ? false : "require",
      // Return timestamps as ISO strings so they serialise cleanly to the client.
      types: {
        date: {
          to: 1184,
          from: [1082, 1083, 1114, 1184],
          serialize: (v: Date | string) => (v instanceof Date ? v.toISOString() : v),
          parse: (v: string) => new Date(v).toISOString(),
        },
      },
    });
  }
  return globalForDb.__sql;
}

export async function insertMessage(data: {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}) {
  const rows = await sql()`
    INSERT INTO contact_messages (name, email, company, service, message)
    VALUES (${data.name}, ${data.email}, ${data.company ?? null}, ${data.service ?? null}, ${data.message})
    RETURNING id
  `;
  return rows[0]?.id as number;
}

export async function listMessages(status?: MessageStatus): Promise<ContactMessage[]> {
  const q = sql();
  const rows = status
    ? await q`SELECT * FROM contact_messages WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
    : await q`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200`;
  return rows as unknown as ContactMessage[];
}

export async function countByStatus(): Promise<Record<MessageStatus, number>> {
  const rows = (await sql()`
    SELECT status, COUNT(*)::int AS count FROM contact_messages GROUP BY status
  `) as unknown as { status: MessageStatus; count: number }[];
  const out: Record<MessageStatus, number> = { new: 0, read: 0, replied: 0, archived: 0 };
  for (const r of rows) out[r.status] = r.count;
  return out;
}

export async function updateStatus(id: number, status: MessageStatus) {
  await sql()`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
}

export async function deleteMessage(id: number) {
  await sql()`DELETE FROM contact_messages WHERE id = ${id}`;
}
