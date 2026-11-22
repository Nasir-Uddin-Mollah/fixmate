/**
 * Browser-only helper: get the BetterAuth JWT for the signed-in user.
 * The cookie stays on localhost:3000; this endpoint returns a short-lived JWT.
 */
export async function getJwtToken(): Promise<string> {
  const response = await fetch("/api/auth/token", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Please sign in again to continue.");
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) {
    throw new Error("Could not get the auth token.");
  }

  return data.token;
}
