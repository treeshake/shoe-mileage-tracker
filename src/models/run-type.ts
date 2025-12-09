import { query } from "../db";
import { type RunType } from "../types";

export async function findRunTypeByName(
  name: string
): Promise<RunType | null> {
  const rows = await query<RunType>(
    `
      SELECT id, name, created_at
      FROM smt.run_types
      WHERE name = $1
      LIMIT 1
    `,
    [name]
  );
  return rows[0] || null;
}

export async function createRunType(name: string): Promise<RunType> {
  const rows = await query<RunType>(
    `
      INSERT INTO smt.run_types (name)
      VALUES ($1)
      RETURNING id, name, created_at
    `,
    [name]
  );
  return rows[0] as RunType;
}

/**
 * Mandatory run_type: find or create and return id.
 */
export async function getOrCreateRunTypeId(name: string): Promise<number> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Run type name is required");
  }

  const existing = await findRunTypeByName(trimmed);
  if (existing) return existing.id;

  const created = await createRunType(trimmed);
  return created.id;
}