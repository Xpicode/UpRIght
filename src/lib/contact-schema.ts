import { z } from "zod";

/** Shared between the form (client) and the API route (server). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  service: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(4000),
  // Honeypot — real users never fill this in.
  // Accept anything here so bots get a normal-looking "ok" instead of a validation
  // error they could learn from; the API route drops filled-in submissions silently.
  website: z.string().max(500).optional().or(z.literal("")),
  // Cloudflare Turnstile token (present only when the widget is configured).
  turnstileToken: z.string().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
