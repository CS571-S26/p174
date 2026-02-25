export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.stack || err.message}`);

  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({ error: `${field} already exists` });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
