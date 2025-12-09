export interface Shoe {
  id: number;
  brand: string | null;
  model: string | null;
  retired: boolean;
  created_at: string;
}

export interface RunType {
  id: number;
  name: string;
  created_at: string;
}

export interface Run {
  id: number;
  date: string;          // YYYY-MM-DD
  distance_km: number;
  shoe_id: number;
  run_type_id: number;
  notes?: string | null;
  created_at: string;
}

/**
 * What the API expects when logging a run.
 */
export interface RunCreateInput {
  date: string;          // "2025-11-25"
  distance_km: number;
  brand: string;         // "Asics"
  model: string;         // "Metaspeed Sky Tokyo"
  run_type: string;      // "Tempo", "Race", etc.
  notes?: string;
}

/**
 * Aggregated stats per shoe.
 */
export interface ShoeStats {
  shoe_id: number;
  brand: string | null;
  model: string | null;
  total_km: number;
  runs_count: number;
  last_run_date: string | null;
}

/**
 * Row from smt.run_details_view
 */
export interface RunDetailsViewRow {
  run_id: number;
  date: string;
  distance_km: number;
  notes: string | null;
  created_at: string;

  shoe_id: number;
  shoe_brand: string | null;
  shoe_model: string | null;
  shoe_retired: boolean;
  shoe_created_at: string;

  run_type_id: number;
  run_type_name: string;
  run_type_created_at: string;
}

/**
 * Response type for successful run creation
 */
export interface RunCreateResponse {
  id: number;
  date: string;
  distance_km: number;
  shoe_id: number;
  run_type_id: number;
  notes: string | null;
  created_at: string;
  brand: string;
  model: string;
  run_type: string;
}

/**
 * Query parameters for GET /runs
 */
export interface RunsQueryParams {
  limit?: string;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Request body for creating API keys
 */
export interface ApiKeyCreateInput {
  label?: string;
  ttlHours?: number;
}

/**
 * Response for API key creation
 */
export interface ApiKeyCreateResponse {
  apiKey: string;
  record: {
    id: number;
    label: string | null;
    created_at: string;
    expires_at: string | null;
    revoked: boolean;
  };
}

/**
 * Route parameters for single shoe endpoint
 */
export interface ShoeParams {
  id: string;
}
