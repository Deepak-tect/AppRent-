import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
      "redirect",
    ],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // url handle spaces as %20 or sometime + , to understand this we use this line
app.use(cookieParser()); // perform CRUD operation in cookie

import userRouter from "./routes/users.routes.js";

import propertyRouter from "./routes/properties.route.js";
import interestRouter from "./routes/interest.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/interest", interestRouter);

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  statusCode = statusCode || 500;
  message = message || "Internal Server Error";
  res.status(statusCode).json(new ApiResponse(statusCode, null, message));
});
export { app };
