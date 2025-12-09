import { type Request, type Response, Router } from "express";
import { query } from "../db";
import type { ErrorResponse, ShoeParams, ShoeStats } from "../types";

const router = Router();

/**
 * GET /shoes
 * Summary per shoe: total_km, runs_count, last_run_date
 */
router.get("/", async (_req: Request<{}, ShoeStats[] | ErrorResponse>, res: Response<ShoeStats[] | ErrorResponse>) => {
  try {
    const rows = await query<ShoeStats>(
      `
      SELECT
        s.id AS shoe_id,
        s.brand,
        s.model,
        COALESCE(SUM(r.distance_km), 0)::float AS total_km,
        COUNT(r.id) AS runs_count,
        MAX(r.date) AS last_run_date
      FROM smt.shoes s
      LEFT JOIN smt.runs r ON r.shoe_id = s.id
      GROUP BY s.id, s.brand, s.model
      ORDER BY total_km DESC, s.brand, s.model
      `
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching shoe stats:", err);
    return res.status(500).json({ error: "Failed to fetch shoe stats" });
  }
});

/**
 * GET /shoes/:id
 * Stats for a single shoe by id.
 */
router.get("/:id", async (req: Request<ShoeParams, ShoeStats | ErrorResponse>, res: Response<ShoeStats | ErrorResponse>) => {
  const id = parseInt(req.params.id as string, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid shoe id" });
  }

  try {
    const rows = await query<ShoeStats>(
      `
      SELECT
        s.id AS shoe_id,
        s.brand,
        s.model,
        COALESCE(SUM(r.distance_km), 0)::float AS total_km,
        COUNT(r.id) AS runs_count,
        MAX(r.date) AS last_run_date
      FROM smt.shoes s
      LEFT JOIN smt.runs r ON r.shoe_id = s.id
      WHERE s.id = $1
      GROUP BY s.id, s.brand, s.model
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Shoe not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching shoe stats:", err);
    return res.status(500).json({ error: "Failed to fetch shoe stats" });
  }
});

export default router;
