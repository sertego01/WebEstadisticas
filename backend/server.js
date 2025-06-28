const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/players", require("./routes/players"));
app.use("/api/matches", require("./routes/matches"));

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
