const express = require("express");
const rateLimit = require("express-rate-limit");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./router/index");
require("./db_config/conn").dbConnect();

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 2500, // limit each IP to 2500 requests per windowMs
});

app.set("trust proxy", 1);
app.use(limiter);
app.use(logger("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.json({
    message: "Connected to the Server",
  });
});

app.use("/api", routes);

app.use((req, res, next) => {
  return res.status(404).json({ message: "404 Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
