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

    let isFinished;
    if (game.is_finished === null) {
      isFinished = game.live === 0 || game.level >= logoImages.length;
    } else {
      isFinished = game.is_finished === 1;
    }

    return res.json({
      id: game.id,
      player_name: game.player_name,
      score: game.score,
      live: game.live,
      level: game.level,
      logo_images: logoImages.map((item) => item.image),
      is_finished: isFinished,
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

    if (game.is_finished === 1) {
      return res.json({
        error: "game sudah berakhir",
      });
    }

    const logoImages = JSON.parse(game.logo_images);
    const currentLevelLogo = logoImages[game.level];
    const isCorrect = currentLevelLogo.name === name;

    let result;
    if (!isCorrect) {
      const live = Math.max(game.live - 1, 0);

      result = {
        score: Math.max(game.score - 2, 0),
        live: live,
        level: game.level,
        is_correct: isCorrect,
        is_finished: live === 0,
      };
    } else {
      const level = game.level + 1;

      result = {
        score: game.score + 10,
        live: game.live,
        level: level,
        is_correct: isCorrect,
        is_finished: level >= logoImages.length,
      };
    }

    game.score = result.score;
    game.live = result.live;
    game.level = result.level;
    game.is_finished = result.is_finished;

    await dbClient.table("games").where("id", req.params.game_id).update(game);

    return res.json(result);
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
});

app.get("/top-scorers", async (req, res) => {
  try {
    const topScorers = await dbClient
      .table("games")
      .columns("player_name", "score")
      .where("is_finished", true)
      .orderBy("score", "desc")
      .limit(10)
      .select();

    return res.json(topScorers);
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
