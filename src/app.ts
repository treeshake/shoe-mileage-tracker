import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

import runsRouter from "./routes/runs";
import shoesRouter from "./routes/shoes";

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/runs", runsRouter);
app.use("/shoes", shoesRouter);

// Only listen in dev mode; on Vercel we export a handler instead.
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;