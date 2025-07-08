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

const feedbackMessageDiv = document.getElementById("feedback-message");
const gameTitleDiv = document.getElementById("game-title");

let playerName = "";
let skor = 0;
let level = 0;
let nyawa = 3;

const session = loadSession();

if (session !== null) {
  playerName = session.playerName;
  skor = session.skor;
  level = session.level;
  nyawa = session.nyawa;

  gameTitleDiv.textContent = "Player - " + playerName;
} else {
  location.href = "./index.html";
}

let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScore = 0;
}
document.getElementById("high-skor").textContent = highScore;

updateGame();

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
ctx.filter = `blur(${logos[level].blur}px)`; // blur(10px)

const img = new Image();
img.src = logos[level].gambar;
img.onload = () => applyBlur();

function cekJawaban() {
  const input = document.getElementById("tebakan");
  const tebakan = input.value.toLowerCase();

  if (tebakan === logos[level].nama) {
    skor += 10;
    showFeedback("Benar! Skor +10 🎉", "correct"); // Ganti alert dengan feedback
    document.getElementById("skor").textContent = skor;

    if (level < logos.length - 1) {
      level++;
      document.getElementById("level").textContent = level + 1;

      img.src = logos[level].gambar;
      resetBlur();
    } else {
      saveHighScore();
      resetSession();
      alert("Selamat! Kamu menang! 🎉");
    }

    input.classList.add("jawaban-benar");
    setTimeout(() => input.classList.remove("jawaban-benar"), 300);
  } else {
    nyawa--;

    // skor minimal adalah 0
    skor = Math.max(skor - 2, 0);

    showFeedback(`Salah! Nyawa berkurang. Sisa nyawa: ${nyawa}`, "incorrect"); // Feedback visual untuk salah
    document.getElementById("skor").textContent = skor;

    logos[level].blur = Math.max(6, logos[level].blur - 2);

    applyBlur();
    updateNyawa();

    input.classList.add("jawaban-salah");
    setTimeout(() => input.classList.remove("jawaban-salah"), 500);
  }

  document.getElementById("tebakan").value = "";

  if (nyawa == 0) {
    document.getElementById("tebakan").disabled = true;
    document.getElementById("tombol").disabled = true;

    showFeedback("GAME OVER", "incorrect");

    saveHighScore();
    resetSession();
  } else {
    autosaveSession();
  }
}

function autosaveSession() {
  const session = {
    playerName: playerName,
    skor: skor,
    level: level,
    nyawa: nyawa,
  };

  const encodedSession = JSON.stringify(session);

  localStorage.setItem("session", encodedSession);
}

function resetSession() {
  localStorage.removeItem("session");
}

function updateGame() {
  document.getElementById("skor").textContent = skor;
  document.getElementById("level").textContent = level + 1;

  updateNyawa();
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

function updateNyawa() {
  document.getElementById("nyawa").textContent =
    "❤️".repeat(nyawa) + "♡".repeat(3 - nyawa);
}

function showFeedback(message, type) {
  feedbackMessageDiv.textContent = message;
  feedbackMessageDiv.className = type;
  feedbackMessageDiv.style.opacity = 1;

  setTimeout(() => {
    feedbackMessageDiv.style.opacity = 0;
  }, 4000);
}

function saveHighScore() {
  // ===
  // Save High Score
  // ===
  const highScore = localStorage.getItem("highScore");

  if (highScore === null || parseInt(highScore) < skor) {
    localStorage.setItem("highScore", skor.toString());
  }

  // ===
  // Save Top Scorer
  // ===
  let encodedTopScorer = localStorage.getItem("topScorer");

  let topScorer = [];
  if (encodedTopScorer !== null) {
    topScorer = JSON.parse(encodedTopScorer);
  }

  topScorer.push({
    playerName: session.playerName,
    skor: skor,
  });

  topScorer.sort(function (a, b) {
    return a - b;
  });

  encodedTopScorer = JSON.stringify(topScorer);

  localStorage.setItem("topScorer", encodedTopScorer);
}
