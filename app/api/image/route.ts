import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`--- /api/image HIT --- Minimal Version --- ${timestamp} ---`);
  return new NextResponse(`Image Route OK - Minimal Version - ${timestamp}`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
