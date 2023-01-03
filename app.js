import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Helemt: API Security
app.use(helmet());

// CORS: Handle CORS Error
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));

// MongoDB Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  const db = mongoose.connection;
  db.on("open", () => {
    console.log("Mongodb database is conneted");
  });

  db.on("error", (error) => {
    console.log(error);
  });

  //Logger
  app.use(morgan("tiny"));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.json({ message: "Server Started Successfully..." });
});

app.use(async (req, res, next) => {
  //   const error = new Error("Not found");
  //   error.status = 404;
  //   next(error);
  next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, console.log(`Server running on port ${PORT}...`));
