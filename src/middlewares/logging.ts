import type { NextFunction, Request, Response } from "express";

/**
 * Logging middleware that logs each request with timestamp, method, route, and response status
 */
export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  const timestamp = new Date().toLocaleString();
  
  // Log the incoming request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.url}`);

  // Capture the original res.end to log when response is sent
  const originalEnd = res.end.bind(res);
  
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    const endTimestamp = new Date().toLocaleString();
    
    // Log the response
    console.log(
      `[${endTimestamp}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`
    );
    
    // Call the original end method and return its result
    return originalEnd(...args);
  };

  next();
}