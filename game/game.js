const logos = [
  {
    nama: "nike",
    gambar:
      "https://media.about.nike.com/image-downloads/cf68f541-fc92-4373-91cb-086ae0fe2f88/002-nike-logos-swoosh-white.jpg",
    blur: 10,
  },
  {
    nama: "indomaret",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
    blur: 10,
  },
  {
    nama: "google",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png",
    blur: 10,
  },
  {
    nama: "playstore",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8cIC2ovMzZuoSrsMkmddkI05BPf0BQyKzLw&s",
    blur: 10,
  },
  {
    nama: "spotify",
    gambar:
      "https://e7.pngegg.com/pngimages/18/942/png-clipart-spotify-computer-icons-music-transparency-logo-spotify-logo-grass-thumbnail.png",
    blur: 10,
  },
  {
    nama: "toyota",
    gambar:
      "https://www.toyota.astra.co.id/sites/default/files/2019-11/fit-tc-logo.jpeg",
    blur: 10,
  },
  {
    nama: "youtube",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR280IBtEFz4F1NuQsv0UAF405nh6J7WmpRyA&s",
    blur: 10,
  },
  {
    nama: "netflix",
    gambar:
      "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
    blur: 10,
  },
  {
    nama: "quran",
    gambar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-2vom0l97L8HZrvBkSBySlAzG-Lr7IiiGg&s",
    blur: 10,
  },
];

let skor = 0;
let level = 0;
let nyawa = 3;

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
ctx.filter = `blur(${logos[level].blur}px)`; // blur(10px)

const img = new Image();
img.src = logos[level].gambar;
img.onload = () => applyBlur();

function cekJawaban() {
  const tebakan = document.getElementById("tebakan").value.toLowerCase();

  if (tebakan === logos[level].nama) {
    skor += 10;
    // skor = skor + 10
    alert("Benar! Skor +10 🎉");
    document.getElementById("skor").textContent = skor;

    if (level < logos.length - 1) {
      level++;
      document.getElementById("level").textContent = level + 1;

      img.src = logos[level].gambar;
      resetBlur();
    } else {
      alert("Selamat! Kamu menang! 🎉");
    }
  } else {
    nyawa--;

    skor -= 2;
    document.getElementById("skor").textContent = skor;

    logos[level].blur = Math.max(6, logos[level].blur - 2);

    applyBlur();
  }

  document.getElementById("tebakan").value = "";

  if (nyawa == 0) {
    document.getElementById("canvas").remove();
    document.getElementById("tebakan").remove();
    document.getElementById("tombol").remove();
  }
}

function resetBlur() {
  logos[level].blur = 15;
  img.onload = () => {
    applyBlur();
  };
}

function applyBlur() {
  ctx.filter = `blur(${logos[level].blur}px)`;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
