import { Router, type Request, type Response } from "express";
import { createApiKey } from "../auth";
import { type ApiKeyCreateInput, type ApiKeyCreateResponse, type ErrorResponse } from "../types";

const router = Router();

const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

if (!ADMIN_SECRET) {
  console.warn(
    "ADMIN_API_SECRET is not set. /admin/api-keys endpoint will accept any caller!"
  );
}

/**
 * POST /admin/api-keys
 * Headers:
 *   x-admin-secret: <ADMIN_API_SECRET>
 *
 * Body (optional):
 * {
 *   "label": "chatgpt-shoe-tracker",
 *   "ttlHours": 24
 * }
 */
router.post("/api-keys", async (req: Request<{}, ApiKeyCreateResponse | ErrorResponse, ApiKeyCreateInput>, res: Response<ApiKeyCreateResponse | ErrorResponse>) => {
  if (ADMIN_SECRET) {
    const adminHeader = req.headers["x-admin-secret"];
    if (adminHeader !== ADMIN_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  const { label, ttlHours } = req.body;

  try {
    const { apiKey, record } = await createApiKey(label, ttlHours);
    // Plaintext apiKey is ONLY returned here; never stored in DB.
    return res.status(201).json({
      apiKey,
      record,
    });
  } catch (err) {
    console.error("Error creating API key:", err);
    return res.status(500).json({ error: "Failed to create API key" });
  }
});

export default router;
