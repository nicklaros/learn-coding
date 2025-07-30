import express from "express";
import bodyParser from "body-parser";
import knex from "knex";
import { DateTime } from "luxon";
import cors from "cors";

const app = express();
const port = 3000;

const dbClient = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./db.sqlite",
  },
  useNullAsDefault: true,
});

app.use(cors());
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

app.put("/logos/:name", async (req, res) => {
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

app.get("/games/:game_id", async (req, res) => {
  try {
    const game = await dbClient
      .table("games")
      .where("id", req.params.game_id)
      .first();

    if (game === null) {
      return res.json({
        error: "game tidak ditemukan",
      });
    }

    const logoImages = JSON.parse(game.logo_images);

    return res.json({
      id: game.id,
      player_name: game.player_name,
      score: game.score,
      live: game.live,
      level: game.level,
      logo_images: logoImages.map((item) => item.image),
    });
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
});

app.post("/games/:game_id/make_a_guess", async (req, res) => {
  try {
    const name = req.body.name;

    const game = await dbClient
      .table("games")
      .where("id", req.params.game_id)
      .first();

    if (game === null) {
      return res.json({
        error: "game tidak ditemukan",
      });
    }

    if (game.live === 0) {
      return res.json({
        error: "game sudah berakhir",
      });
    }

    const logoImages = JSON.parse(game.logo_images);

    if (game.level >= logoImages.length) {
      return res.json({
        error: "game sudah berakhir",
      });
    }

    const currentLevelLogo = logoImages[game.level];
    const isCorrect = currentLevelLogo.name === name;

    let result;
    if (!isCorrect) {
      result = {
        score: game.score - 2,
        live: game.live - 1,
        level: game.level,
        is_correct: isCorrect,
      };
    } else {
      result = {
        score: game.score + 10,
        live: game.live,
        level: game.level + 1,
        is_correct: isCorrect,
      };
    }

    game.score = result.score;
    game.live = result.live;
    game.level = result.level;

    await dbClient.table("games").where("id", req.params.game_id).update(game);

    return res.json(result);
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
