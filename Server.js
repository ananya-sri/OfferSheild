import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import reqAuth from "./src/middleware/auth.js";
import whoisRoutes from "./src/routes/whoisRoutes.js";

dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/whois", whoisRoutes);

app.get("/api/secure-data", reqAuth, (req, res) => {
  res.json({ message: "You are authorized" });
});


const PORT = process.env.PORT || 5000;

// Connect to MongoDB (this will log conn.connection.host from Db.js)
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
