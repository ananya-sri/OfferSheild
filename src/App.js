import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Simple DB read/write test
const TestSchema = new mongoose.Schema({ name: String });
const TestModel = mongoose.model("Test", TestSchema);

app.get("/db-test", async (req, res) => {
  try {
    const doc = await TestModel.create({ name: "test" });
    const count = await TestModel.countDocuments();
    res.json({ ok: true, insertedId: doc._id, totalDocs: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default app;
