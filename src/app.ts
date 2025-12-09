import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

import { apiKeyAuthMiddleware } from "./middlewares/api-key-auth";
import adminApiKeysRouter from "./routes/admin";
import runsRouter from "./routes/runs";
import shoesRouter from "./routes/shoes";

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Public healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Admin API key management (protected by x-admin-secret)
app.use("/admin", adminApiKeysRouter);

// All routes below require a valid API key (Authorization: Bearer <key>)
app.use(apiKeyAuthMiddleware);

app.use("/runs", runsRouter);
app.use("/shoes", shoesRouter);

// Local dev server (Vercel will ignore this and use api/index.ts)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;