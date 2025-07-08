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

app.get("/", (req, res) => {
  res.send("Halo semuanya.!");
});

// collection logos
// list         = GET /logos
// nambah baru  = POST /logos
// edit logo    = PUT /logos/:nama
// hapus logo   = DELETE /logos/:nama

app.get("/logos", async (req, res) => {
  const logos = await dbClient.table("logos").select();

  res.json(logos);
});

// nambah logo baru
app.post("/logos", async (req, res) => {
  try {
    await dbClient.table("logos").insert({
      nama: req.body.nama,
      gambar: req.body.gambar,
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
    .where("nama", req.params.nama)
    .update({
      gambar: req.body.gambar,
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
    .where("nama", req.params.nama)
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
