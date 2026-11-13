import express from "express";
import { requestLogger } from "./middleware/request-logger.js";
import helloRouter from "./routes/hello.routes.js";

const app = express();

// Built-in middleware untuk membaca request body berformat JSON.
app.use(express.json());

// Custom middleware dijalankan sebelum request masuk ke route.
app.use(requestLogger);

// Menyajikan halaman HTML, CSS, dan JavaScript dari folder public.
app.use(express.static("public"));

// Semua endpoint pada helloRouter diawali dengan /hello.
app.use("/hello", helloRouter);

export default app;
