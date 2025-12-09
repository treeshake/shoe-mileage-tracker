
import crypto from "crypto";
import { query } from "./db";

export interface ApiKeyRecord {
  id: number;
  key_hash: string;
  label: string | null;
  created_at: string;
  expires_at: string | null;
  revoked: boolean;
}

/**
 * Hash a plaintext API key using SHA-256.
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

/**
 * Generate a new opaque API key to give to a client (e.g. GPT Action).
 * This value is only shown once and never stored in plaintext.
 */
export function generateApiKey(): string {
  const randomPart = crypto.randomBytes(32).toString("hex");
  return `sk_smt_${randomPart}`; // prefix just for easy identification
}

/**
 * Create a new API key record in api.api_keys.
 * Returns the plaintext apiKey (ONLY once) and the DB record (without key_hash).
 */
export async function createApiKey(
  label?: string,
  ttlHours?: number
): Promise<{
  apiKey: string;
  record: Omit<ApiKeyRecord, "key_hash">;
}> {
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  let expiresAt: string | null = null;
  if (ttlHours && ttlHours > 0) {
    const expires = new Date();
    expires.setHours(expires.getHours() + ttlHours);
    expiresAt = expires.toISOString();
  }

  const rows = await query<ApiKeyRecord>(
    `
      INSERT INTO api.api_keys (key_hash, label, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, key_hash, label, created_at, expires_at, revoked
    `,
    [keyHash, label || null, expiresAt]
  );

  const record = rows[0] as ApiKeyRecord;

  return {
    apiKey,
    record: {
      id: record.id,
      label: record.label,
      created_at: record.created_at,
      expires_at: record.expires_at,
      revoked: record.revoked,
    },
  };
}

/**
 * Validate an incoming plaintext API key:
 * - Find matching key_hash in api.api_keys
 * - Check revoked flag
 * - Check expiry if set
 */
export async function validateApiKey(plaintextKey: string): Promise<boolean> {
  const keyHash = hashApiKey(plaintextKey);

  const rows = await query<ApiKeyRecord>(
    `
      SELECT id, key_hash, label, created_at, expires_at, revoked
      FROM api.api_keys
      WHERE key_hash = $1
      LIMIT 1
    `,
    [keyHash]
  );

  if (rows.length === 0) return false;

  const key = rows[0] as ApiKeyRecord;

  if (key.revoked) return false;

  if (key.expires_at) {
    const now = new Date();
    const expires = new Date(key.expires_at);
    if (now > expires) return false;
  }

  return true;
}