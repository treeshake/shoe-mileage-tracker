import type { NextFunction, Request, Response } from "express";
import { validateApiKey } from "../auth";

export async function apiKeyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  try {
    const valid = await validateApiKey(token);
    if (!valid) {
      return res.status(401).json({ error: "Invalid or expired API key" });
    }

    // Optionally attach info to req (e.g. req.apiKey = token)
    return next();
  } catch (err) {
    console.error("API key validation error:", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}
