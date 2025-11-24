import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

// Middleware - must be before routes
app.use(cors());
app.use(express.json());

// Import admin routes
import adminRoutes from "./apis/modules/routes/admin";

// Import routes
import authRoutes from "./apis/modules/routes/authRoute";

// Use admin routes
app.use("/api/admin", adminRoutes);

// Use routes
app.use("/api/auth", authRoutes);
// app.use('/api/business', businessRoutes);

// Health check
app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({
    message: "pong",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// 404 handler - catches all unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: true,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: true,
    message: "Internal server error!",
  });
});

// Start server
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📧 Email service: ${
      process.env.SMTP_USER ? "Configured" : "Not configured"
    }`
  );
  console.log(
    `🗄️  Database: ${process.env.DB_HOST ? "Configured" : "Using defaults"}`
  );
});
