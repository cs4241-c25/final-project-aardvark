import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.get("/", async (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
  try {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");
    } else {
      console.error("Mongo URI is not provided. Add it to your .env file");
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
