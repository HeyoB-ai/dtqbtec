export const runtime = "nodejs";
// Read env vars at request time (not build time) so the health check reflects
// the values actually loaded in the Netlify runtime.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    hasKey: !!process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL ?? "not set",
    keyPrefix: process.env.ANTHROPIC_API_KEY?.slice(0, 12) ?? "missing",
  });
}
