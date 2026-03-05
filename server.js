const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const itemRoutes = require("./routes/items");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// serve HTML pages
app.use("/views", express.static(path.join(__dirname, "views")));

app.use("/api/items", itemRoutes);

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Page Not Found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});