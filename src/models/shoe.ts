import { query } from "../db";
import { type Shoe } from "../types";

export async function findShoe(
  brand: string,
  model: string
): Promise<Shoe | null> {
  const rows = await query<Shoe>(
    `
      SELECT id, brand, model, retired, created_at
      FROM smt.shoes
      WHERE brand = $1 AND model = $2
      LIMIT 1
    `,
    [brand, model]
  );
  return rows[0] || null;
}

export async function createShoe(
  brand: string,
  model: string
): Promise<Shoe> {
  const rows = await query<Shoe>(
    `
      INSERT INTO smt.shoes (brand, model)
      VALUES ($1, $2)
      RETURNING id, brand, model, retired, created_at
    `,
    [brand, model]
  );
  return rows[0] as Shoe;
}

/**
 * Get an existing shoe_id for brand+model, or create it.
 */
export async function getOrCreateShoeId(
  brand: string,
  model: string
): Promise<number> {
  const b = brand.trim();
  const m = model.trim();
  if (!b || !m) {
    throw new Error("Shoe brand and model are required");
  }

  const existing = await findShoe(b, m);
  if (existing) return existing.id;

  const created = await createShoe(b, m);
  return created.id;
}
