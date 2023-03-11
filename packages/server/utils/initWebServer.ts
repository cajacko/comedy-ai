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

app.use(express.static(publicDir));

app.get("*", async (req, res) => {
  try {
    const data = await askAudience(
      "Can I get a suggestion for a genre of TV, like soap or drama"
    );

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error });
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
