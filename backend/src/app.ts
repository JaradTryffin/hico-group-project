import express from "express";
import employeeRoute from "./routes/employeeRoute";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use("/api/employees", employeeRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
