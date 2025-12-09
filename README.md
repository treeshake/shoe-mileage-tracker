# shoe-mileage-tracker

Tracks shoe running mileage and API to ChatGPT Actions to log runs.

# Prerequisites

ChatGPT
Supabase

# Environment

.env

SUPERBASE_PASSWORD=

DATABASE_URL=postgresql://postgres:${SUPERBASE_PASSWORD}@db.tgbakcnkypnmlwuexoir.supabase.co:5432/postgres
PORT=4000

ADMIN_API_SECRET=

# Running Locally

```
npm run dev
```

## Test health
```
curl http://localhost:4000/health
```

## List recent runs (from view)
```
curl "http://localhost:4000/runs?limit=10"
```

## Log a new run
```
curl -X POST http://localhost:4000/runs \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-09",
    "distance_km": 10,
    "brand": "Asics",
    "model": "Metaspeed Sky Tokyo",
    "run_type": "Easy",
    "notes": "Easy shakeout"
  }'
```





