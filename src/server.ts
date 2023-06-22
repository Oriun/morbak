import express from "express";
import path from "path";
import http from "http";
import cors from "cors";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const server = http.createServer(app);

app.use(cors());

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../app/dist", req.url));
});

export default server;