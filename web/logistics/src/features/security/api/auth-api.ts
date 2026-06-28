/**
 * auth.api.ts
 * Typed API layer for the two-phase login flow.
 * Replace the mock implementations with your real fetch/axios calls.
 */

// ── Response types ────────────────────────────────────────────────────────────

export interface CredentialCheckResponse {
  /** Whether the account has MFA enabled. */
  requiresMFA: boolean
  /**
   * Short-lived opaque token issued after successful credential verification.
   * Only present when requiresMFA is true; sent back with the TOTP code.
   */
  partialToken?: string
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Verifies email + password.
 * Throws on invalid credentials so the caller can catch and set a store error.
 */
export async function checkCredentials(
  email: string,
  password: string,
): Promise<CredentialCheckResponse> {
  // ── Replace with real fetch ──────────────────────────────────────────────
  // const res = await fetch("/api/auth/login", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, password }),
  // })
  // if (!res.ok) {
  //   const body = await res.json().catch(() => ({}))
  //   throw new Error(body.message ?? "Invalid email or password")
  // }
  // return res.json()
  // ────────────────────────────────────────────────────────────────────────

  await simulateLatency(800)

  // Demo accounts for local testing
  if (email === "mfa@example.com" && password === "Password1!") {
    return { requiresMFA: true, partialToken: "tok_partial_demo_abc123" }
  }
  if (email === "nomfa@example.com" && password === "Password1!") {
    return { requiresMFA: false }
  }

  throw new Error("Invalid email or password")
}

/**
 * POST /auth/mfa/verify
 * Verifies the 6-digit TOTP code against the partial session.
 * Throws on invalid/expired code.
 */
export async function verifyTOTP(
  partialToken: string,
  code: string,
): Promise<void> {
  // ── Replace with real fetch ──────────────────────────────────────────────
  // const res = await fetch("/api/auth/mfa/verify", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ partialToken, code }),
  // })
  // if (!res.ok) {
  //   const body = await res.json().catch(() => ({}))
  //   throw new Error(body.message ?? "Invalid or expired authentication code")
  // }
  // ────────────────────────────────────────────────────────────────────────

  await simulateLatency(800)

  if (!partialToken) throw new Error("Session expired. Please sign in again.")
  // Demo: any code other than "123456" fails
  if (code !== "123456") {
    throw new Error("Invalid or expired authentication code")
  }
}

const simulateLatency = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))
