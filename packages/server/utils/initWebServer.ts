import express from "express";
import cors from "cors";
import http from "http";
import publicDir from "../config/publicDir";
import { askAudience } from "../functions/askAudience";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());
app.use(express.static(publicDir));

app.all("*", async (req, res) => {
  try {
    const body: unknown = req.body;

    if (typeof body !== "object") throw new Error("body is not an object");
    if (!body) throw new Error("No body present");
    if (Array.isArray(body))
      throw new Error("Body is an array, expected object");
    if (!("question" in body)) throw new Error("No question in body");
    if (typeof body.question !== "string")
      throw new Error("body.question is not a string");

    const data = await askAudience(body.question);

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error, check logs",
    });
  }
});

server
  .listen(process.env.PORT || 8080, () => {
    const address = server.address();

    if (!address || typeof address === "string") return;

    console.log(`Listening at http://${address.address}:${address.port}`);
  })
  .on("error", function (e) {
    console.error(e);
  });
