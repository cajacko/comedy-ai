import express from "express";
import cors from "cors";
import http from "http";
import publicDir from "../config/publicDir";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: true,
  })
);

app.use(express.static(publicDir));

server
  .listen(process.env.PORT || 8080, () => {
    const address = server.address();

    if (!address || typeof address === "string") return;

    console.log(`Listening at http://${address.address}:${address.port}`);
  })
  .on("error", function (e) {
    console.error(e);
  });
