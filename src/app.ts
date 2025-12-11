import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

import { apiKeyAuthMiddleware } from "./middlewares/api-key-auth";
import { loggingMiddleware } from "./middlewares/logging";
import adminApiKeysRouter from "./routes/admin";
import runsRouter from "./routes/runs";
import shoesRouter from "./routes/shoes";

dotenv.config();

const app = express();

// Add logging middleware first to capture all requests
app.use(loggingMiddleware);

app.use(bodyParser.json());

// Public healthcheck
app.get("/health", (_req: any, res: any) => {
  res.json({ status: "ok" });
});

// Admin API key management (protected by x-admin-secret)
app.use("/admin", adminApiKeysRouter);

// All routes below require a valid API key (Authorization: Bearer <key>)
app.use(apiKeyAuthMiddleware);

app.use("/runs", runsRouter);
app.use("/shoes", shoesRouter);

// Local dev server (Vercel will ignore this and use api/index.ts)
// Only start server if not in Vercel environment and running directly
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

if (!isVercel) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;
