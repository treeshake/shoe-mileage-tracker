# shoe-mileage-tracker

Tracks shoe running mileage and API to ChatGPT Actions to log runs.

# Prerequisites

ChatGPT
Supabase

# Environment

.env

```
DATABASE_URL=postgresql://postgres:${SUPERBASE_PASSWORD}@db.tgbakcnkypnmlwuexoir.supabase.co:5432/postgres
PORT=4000
ADMIN_API_SECRET=<set-a-random-secret>
```
# Running Locally

```
npm run dev
```

# API Authentication

Most API endpoints require authentication with an API key. First create an API key using the admin endpoint, then include it in the `Authorization` header for all requests.

## Test health
```
curl http://localhost:4000/health
```

## Admin: Create API Key

```
curl -X POST http://localhost:4000/admin/api-keys \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: 30f2afad6a464b6b9e2c3f4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7" \
  -d '{"label": "shoe-mileage-tracker", "ttlHours": 7200 }'
```

This will return an API key that you can use for the following endpoints.

## List recent runs (from view)
```
curl "http://localhost:4000/runs?limit=10" \
  -H "Authorization: Bearer sk_smt_e075cac0444f485ca60b921f06c9aa51fffd6a45f54c4ff251915e12909b739f"
```

## Log a new run
```
curl -X POST http://localhost:4000/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_smt_e075cac0444f485ca60b921f06c9aa51fffd6a45f54c4ff251915e12909b739f" \
  -d '{
    "date": "2025-12-09",
    "distance_km": 10,
    "brand": "Asics",
    "model": "Metaspeed Sky Tokyo",
    "run_type": "Easy",
    "notes": "Easy shakeout"
  }'
```

## Get shoe mileage summary
```
curl "http://localhost:4000/shoes" \
  -H "Authorization: Bearer sk_smt_e075cac0444f485ca60b921f06c9aa51fffd6a45f54c4ff251915e12909b739f"
```

