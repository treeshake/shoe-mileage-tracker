import { type Request, type Response, Router } from "express";
import { query, queryResult } from "../db";
import { getOrCreateRunTypeId } from "../models/run-type";
import { getOrCreateShoeId } from "../models/shoe";
import type {
  ErrorResponse,
  Run,
  RunCreateInput,
  RunCreateResponse,
  RunDateParams,
  RunDateRangeQueryParams,
  RunDeleteResponse,
  RunDetailsViewRow,
  RunIdParams,
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

/**
 * GET /runs/date/:date
 * Returns all runs for a specific date (YYYY-MM-DD format)
 */
router.get(
  "/date/:date",
  async (
    req: Request<RunDateParams, RunDetailsViewRow[] | ErrorResponse>,
    res: Response<RunDetailsViewRow[] | ErrorResponse>
  ) => {
    const { date } = req.params;

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    try {
      const rows = await query<RunDetailsViewRow>(
        `
      SELECT *
      FROM smt.run_details_view
      WHERE date = $1
      ORDER BY run_id DESC
      `,
        [date]
      );

      return res.json(rows);
    } catch (err) {
      console.error("Error fetching runs by date:", err);
      return res.status(500).json({ error: "Failed to fetch runs" });
    }
  }
);

/**
 * GET /runs/date-range?startDate=2025-12-01&endDate=2025-12-11&limit=50
 * Returns all runs within a date range
 */
router.get(
  "/date-range",
  async (
    req: Request<{}, RunDetailsViewRow[] | ErrorResponse, {}, RunDateRangeQueryParams>,
    res: Response<RunDetailsViewRow[] | ErrorResponse>
  ) => {
    const { startDate, endDate, limit } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required query parameters: startDate and endDate",
      });
    }

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD for both startDate and endDate",
      });
    }

    // Validate date range (startDate should be <= endDate)
    if (startDate > endDate) {
      return res.status(400).json({
        error: "startDate must be less than or equal to endDate",
      });
    }

    const queryLimit = Math.min(parseInt(limit as string, 10) || 50, 200);

    try {
      const rows = await query<RunDetailsViewRow>(
        `
      SELECT *
      FROM smt.run_details_view
      WHERE date >= $1 AND date <= $2
      ORDER BY date DESC, run_id DESC
      LIMIT $3
      `,
        [startDate, endDate, queryLimit]
      );

      return res.json(rows);
    } catch (err) {
      console.error("Error fetching runs by date range:", err);
      return res.status(500).json({ error: "Failed to fetch runs" });
    }
  }
);

/**
 * DELETE /runs/:id
 * Deletes a run by its ID
 */
router.delete(
  "/:id",
  async (
    req: Request<RunIdParams, RunDeleteResponse | ErrorResponse>,
    res: Response<RunDeleteResponse | ErrorResponse>
  ) => {
    const runId = parseInt(req.params.id, 10);

    if (isNaN(runId) || runId <= 0) {
      return res.status(400).json({ error: "Invalid run ID" });
    }

    try {
      const result = await queryResult(
        "DELETE FROM smt.runs WHERE id = $1",
        [runId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Run not found" });
      }

      return res.json({
        message: "Run deleted successfully",
        deletedCount: result.rowCount,
      });
    } catch (err) {
      console.error("Error deleting run by ID:", err);
      return res.status(500).json({ error: "Failed to delete run" });
    }
  }
);

/**
 * DELETE /runs/date/:date
 * Deletes all runs for a specific date (YYYY-MM-DD format)
 */
router.delete(
  "/date/:date",
  async (
    req: Request<RunDateParams, RunDeleteResponse | ErrorResponse>,
    res: Response<RunDeleteResponse | ErrorResponse>
  ) => {
    const { date } = req.params;

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    try {
      const result = await queryResult(
        "DELETE FROM smt.runs WHERE date = $1",
        [date]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "No runs found for the specified date",
        });
      }

      return res.json({
        message: `Deleted all runs for ${date}`,
        deletedCount: result.rowCount,
      });
    } catch (err) {
      console.error("Error deleting runs by date:", err);
      return res.status(500).json({ error: "Failed to delete runs" });
    }
  }
);

export default router;
