import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { EventEmitter } from "events";
import adminRoute from "./routes/adminRoute.js";
import filmingRoute from "./routes/filmingRoute.js";
import shoppingRoute from "./routes/shoppingRoute.js";
import modelingGalleryRoutes from "./routes/modelingGallery.routes.js";
import ugcRoutes from "./routes/ugc.routes.js";
import bookRouter from "./routes/bookRoute.js";
import articleRouter from "./routes/articleRoute.js";
import fanArtRouter from "./routes/fanArtRoute.js";
import comicRoute from "./routes/comicRoute.js";
import instaComicRoute from "./routes/instaComicRoute.js";

// basic steup the server
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
EventEmitter.defaultMaxListeners = 20;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// when uplod the foleder and fetch this
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const localhostPort1 = 5173;
const localhostPort2 = 5174;
const localhostPort3 = 3000;

// cros origin setup
const allowedOrigins = [
  `http://localhost:${localhostPort1}`,
  `http://localhost:${localhostPort2}`,
  `http://localhost:${localhostPort3}`,
  "https://demo.faizylegend.com",
  "http://demo.faizylegend.com",
  "http://www.demo.faizylegend.com",
  "https://faizylegend.com",
  "https://www.faizylegend.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// here is the router setup
app.use("/admin", adminRoute);
app.use("/api", filmingRoute);
app.use("/api", shoppingRoute);
app.use("/api/modeling-gallery", modelingGalleryRoutes);
app.use("/api/ugc", ugcRoutes);
app.use("/api", bookRouter);
app.use("/api", articleRouter);
app.use("/api", fanArtRouter);
app.use("/api", comicRoute);
app.use("/api", instaComicRoute);

// public route running the server
app.get("/", (req, res) => {
  return res.send(" <h1>Welcome to the faizy legend Server</h1>");
});

// api lister when server running
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running where ✅ http://localhost:${PORT}`);
});
