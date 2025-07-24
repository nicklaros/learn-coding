import express from "express";
import bodyParser from "body-parser";
import knex from "knex";
import { DateTime } from "luxon";

const app = express();
const port = 3000;

const dbClient = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./db.sqlite",
  },
  useNullAsDefault: true,
});

app.use(bodyParser.json());

app.get("/logos", async (req, res) => {
  const logos = await dbClient.table("logos").select();

  res.json(logos);
});

// nambah logo baru
app.post("/logos", async (req, res) => {
  try {
    await dbClient.table("logos").insert({
      name: req.body.name,
      image: req.body.image,
      created_at: DateTime.now().toISO(),
    });

    res.json({
      error: null,
    });
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

app.put("/logos/:nama", async (req, res) => {
  const updatedCount = await dbClient
    .table("logos")
    .where("name", req.params.name)
    .update({
      image: req.body.image,
    });

  if (updatedCount === 0) {
    res.json({
      error: "tidak ditemukan",
    });

    return;
  }

  res.json({
    error: null,
  });
});

app.delete("/logos/:nama", async (req, res) => {
  const deletedCount = await dbClient
    .table("logos")
    .where("name", req.params.name)
    .delete();

  if (deletedCount === 0) {
    res.json({
      error: "tidak ditemukan",
    });
    return;
  }

  res.json({
    error: null,
  });
});

app.post("/games", async (req, res) => {
  try {
    const logos = await dbClient
      .table("logos")
      .column("name", "image")
      .limit(5)
      .orderByRaw("RANDOM()");

    const newGame = {
      player_name: req.body.player_name,
      score: 0,
      live: 3,
      level: 0,
      logo_images: JSON.stringify(logos),
      created_at: DateTime.now().toISO(),
    };

    const savedGame = await dbClient.table("games").insert(newGame);

    res.json({
      id: savedGame[0],
      error: null,
    });
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
