import { NextResponse } from "next/server";
import { createClient } from "./server";

/**
 * Verify the current request is from an authenticated user.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
