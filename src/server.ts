import express from "express";
import path from "path";
import http from "http";
import cors from "cors";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const client = path.join(__dirname, "../../app/dist");
const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.static(path.join(__dirname, "../../app/dist")));

app.use(
  "/",
  (
    (...args) =>
    (req, res, next) => {
      if (
        (req.method === "GET" || req.method === "HEAD") &&
        req.accepts("html")
      ) {
        res.sendFile.call(
          res,
          ...args,
          (err) => err && next()
        );
      } else next();
    }
  )("index.html", {
    root: client,
  })
);

export default server;
