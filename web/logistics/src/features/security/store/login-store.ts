import { createStore } from '@tanstack/react-store';

export type LoginStage = 'credentials' | 'mfa' | 'authenticated';

export interface LoginState {
  stage: LoginStage;

  /**
   * Opaque token returned by the credential-check endpoint.
   * Required for the subsequent MFA verification call so the server can
   * correlate the two requests without a full session.
   */
  partialToken: string | null;

  /** Email shown inside the MFA dialog ("Enter the code for user@…") */
  email: string | null;

  /**
   * Top-level server error unrelated to field-level validation
   * (wrong credentials, expired code, network failure).
   * Displayed as an alert banner above the submit button.
   */
  serverError: string | null;
}

const INITIAL_STATE: LoginState = {
  stage: 'credentials',
  partialToken: null,
  email: null,
  serverError: null,
};

export const loginStore = createStore<LoginState>(INITIAL_STATE);

// ── Actions ───────────────────────────────────────────────────────────────────

/**
 * Centralised mutations. Keeping them beside the store instead of scattered
 * across components makes the state machine easy to reason about and test.
 */
export const loginActions = {
  /** Credentials verified — transition to the MFA dialog. */
  requireMFA(partialToken: string, email: string): void {
    loginStore.setState(() => ({
      stage: 'mfa',
      partialToken,
      email,
      serverError: null,
    }));
  },

  /** MFA verified — mark user as fully authenticated. */
  authenticate(): void {
    loginStore.setState((prev) => ({
      ...prev,
      stage: 'authenticated',
      serverError: null,
    }));
  },

  setServerError(message: string): void {
    loginStore.setState((prev) => ({ ...prev, serverError: message }));
  },

  clearServerError(): void {
    loginStore.setState((prev) => ({ ...prev, serverError: null }));
  },

  /** Go back to the credentials form from the MFA dialog. */
  backToCredentials(): void {
    loginStore.setState((prev) => ({
      ...prev,
      stage: 'credentials',
      partialToken: null,
      serverError: null,
    }));
  },

  /** Hard reset — useful for "sign out and sign in as different user" flows. */
  reset(): void {
    loginStore.setState(() => INITIAL_STATE);
  },
};
