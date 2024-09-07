import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Log request body if it exists
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
  }

  // Capture response
  const originalJson = res.json;
  res.json = function (body) {
    console.log("Response Body:", JSON.stringify(body, null, 2));
    return originalJson.call(this, body);
  };

  next();
};
