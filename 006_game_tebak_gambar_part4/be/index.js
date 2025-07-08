import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const logos = [
  {
    nama: "nike",
    gambar:
      "https://media.about.nike.com/image-downloads/cf68f541-fc92-4373-91cb-086ae0fe2f88/002-nike-logos-swoosh-white.jpg",
  },
  {
    nama: "indomaret",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
  },
  {
    nama: "google",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png",
  },
  {
    nama: "playstore",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8cIC2ovMzZuoSrsMkmddkI05BPf0BQyKzLw&s",
  },
  {
    nama: "spotify",
    gambar:
      "https://e7.pngegg.com/pngimages/18/942/png-clipart-spotify-computer-icons-music-transparency-logo-spotify-logo-grass-thumbnail.png",
  },
  {
    nama: "toyota",
    gambar:
      "https://www.toyota.astra.co.id/sites/default/files/2019-11/fit-tc-logo.jpeg",
  },
  {
    nama: "youtube",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR280IBtEFz4F1NuQsv0UAF405nh6J7WmpRyA&s",
  },
  {
    nama: "netflix",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
  },
  {
    nama: "quran",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-2vom0l97L8HZrvBkSBySlAzG-Lr7IiiGg&s",
  },
];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Halo semuanya.!");
});

// collection logos
// list         = GET /logos
// nambah baru  = POST /logos
// edit logo    = PUT /logos/:nama
// hapus logo   = DELETE /logos/:nama

app.get("/logos", (req, res) => {
  res.json(logos);
});

// nambah logo baru
app.post("/logos", (req, res) => {
  logos.push({
    nama: req.body.nama,
    gambar: req.body.gambar,
  });

  res.json({
    error: null,
  });
});

app.put("/logos/:nama", (req, res) => {
  const index = logos.findIndex((item) => item.nama === req.params.nama);

  if (index === -1) {
    res.json({
      error: "tidak ditemukan",
    });
  }

  logos[index].gambar = req.body.gambar;

  res.json({
    indexItem: index,
    error: null,
  });
});

app.delete("/logos/:nama", (req, res) => {
  const index = logos.findIndex((item) => item.nama === req.params.nama);

  if (index === -1) {
    res.json({
      error: "tidak ditemukan",
    });
  }

  logos.splice(index, 1);

  res.json({
    indexItem: index,
    error: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
