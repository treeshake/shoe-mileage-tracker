import { type Request, type Response, Router } from "express";
import { query } from "../db";
import { getOrCreateRunTypeId } from "../models/run-type";
import { getOrCreateShoeId } from "../models/shoe";
import type {
  ErrorResponse,
  Run,
  RunCreateInput,
  RunCreateResponse,
  RunDetailsViewRow,
  RunsQueryParams,
} from "../types";

const router = Router();

/**
 * POST /runs
 * Body:
 * {
 *   "date": "2025-11-25",
 *   "distance_km": 10,
 *   "brand": "Asics",
 *   "model": "Metaspeed Sky Tokyo",
 *   "run_type": "Tempo",
 *   "notes": "Felt good"
 * }
 */
router.post(
  "/",
  async (
    req: Request<{}, RunCreateResponse | ErrorResponse, RunCreateInput>,
    res: Response<RunCreateResponse | ErrorResponse>
  ) => {
    const { date, distance_km, brand, model, run_type, notes } =
      req.body as RunCreateInput;

    if (!date || !distance_km || !brand || !model || !run_type) {
      return res.status(400).json({
        error:
          "Missing required fields: date, distance_km, brand, model, run_type",
      });
    }

    if (distance_km <= 0) {
      return res.status(400).json({ error: "distance_km must be > 0" });
    }

    try {
      const shoeId = await getOrCreateShoeId(brand, model);
      const runTypeId = await getOrCreateRunTypeId(run_type);

      const rows = await query<
        Run & { brand: string; model: string; run_type_name: string }
      >(
        `
      INSERT INTO smt.runs (date, distance_km, shoe_id, run_type_id, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        date,
        distance_km,
        shoe_id,
        run_type_id,
        notes,
        created_at
      `,
        [date, distance_km, shoeId, runTypeId, notes || null]
      );

      // You can enrich the response if you want
      const run = rows[0] as Run;

      return res.status(201).json({
        id: run.id,
        date: run.date,
        distance_km: run.distance_km,
        shoe_id: run.shoe_id,
        run_type_id: run.run_type_id,
        notes: run.notes ?? null,
        created_at: run.created_at,
        brand,
        model,
        run_type,
      });
    } catch (err) {
      console.error("Error inserting run:", err);
      return res.status(500).json({ error: "Failed to create run" });
    }
  }
);

/**
 * GET /runs
 * Optional: ?limit=50
 * Returns rows from smt.run_details_view (joined data).
 */
router.get(
  "/",
  async (
    req: Request<{}, RunDetailsViewRow[] | ErrorResponse, {}, RunsQueryParams>,
    res: Response<RunDetailsViewRow[] | ErrorResponse>
  ) => {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 200);

    try {
      const rows = await query<RunDetailsViewRow>(
        `
      SELECT *
      FROM smt.run_details_view
      ORDER BY date DESC, run_id DESC
      LIMIT $1
      `,
        [limit]
      );

      return res.json(rows);
    } catch (err) {
      console.error("Error fetching runs:", err);
      return res.status(500).json({ error: "Failed to fetch runs" });
    }
  }
);

export default router;
