# shoe-mileage-tracker

Tracks shoe running mileage and API to ChatGPT Actions to log runs.

# Prerequisites

ChatGPT
Supabase

# Environment

.env

```
SUPERBASE_PASSWORD=<your-supabase-db-password>
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
  -H "x-admin-secret: <ADMIN_API_SECRET>" \
  -d '{"label": "shoe-mileage-tracker", "ttlHours": 7200 }'
```

This will return an API key that you can use for the following endpoints.

## List recent runs (from view)
```
curl "http://localhost:4000/runs?limit=10" \
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

## Log a new run
```
curl -X POST http://localhost:4000/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
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
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

