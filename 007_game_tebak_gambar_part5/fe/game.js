const feedbackMessageElement = document.getElementById("feedback-message");
const gameTitleElement = document.getElementById("game-title");
const highSkorElement = document.getElementById("high-skor");
const canvas = document.getElementById("canvas");
const tebakanElement = document.getElementById("tebakan");
const skorElement = document.getElementById("skor");
const levelElement = document.getElementById("level");
const nyawaElement = document.getElementById("nyawa");
const tombolElement = document.getElementById("tombol");

const ctx = canvas.getContext("2d");
const img = new Image();

let playerName = "";
let skor = 0;
let level = 0;
let nyawa = 3;
let logos = [];

const params = new URLSearchParams(window.location.search);
const gameId = params.get("game_id");

loadSession(gameId).then((session) => {
  if (session && session.nyawa > 0) {
    playerName = session.playerName;
    skor = session.skor;
    level = session.level;
    nyawa = session.nyawa;
    logos = session.logos;

    gameTitleElement.textContent = "Player - " + playerName;
  } else {
    location.href = "./index.html";
  }

  let highScore = localStorage.getItem("highScore");
  if (highScore === null) {
    highScore = 0;
  }
  highSkorElement.textContent = highScore;

  updateGame();

  img.src = logos[level];
  img.onload = () => applyBlur();
});

async function cekJawaban() {
  const tebakan = tebakanElement.value.toLowerCase();

  const response = await fetch(
    `http://localhost:3000/games/${gameId}/make_a_guess`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: tebakan,
      }),
    }
  );
  const jsonResponse = await response.json();

  if (jsonResponse.is_correct) {
    skor = jsonResponse.score;

    if (level < logos.length - 1) {
      level = jsonResponse.level;

      updateGame();

      img.src = logos[level];
    } else {
      saveHighScore();
      alert("Selamat! Kamu menang! 🎉");
    }

    showFeedback("Benar! Skor +10 🎉", "correct");

    tebakanElement.classList.add("jawaban-benar");
    setTimeout(() => tebakanElement.classList.remove("jawaban-benar"), 300);
  } else {
    nyawa = jsonResponse.live;
    skor = jsonResponse.score;

    updateGame();

    showFeedback(`Salah! Nyawa berkurang. Sisa nyawa: ${nyawa}`, "incorrect");

    tebakanElement.classList.add("jawaban-salah");
    setTimeout(() => tebakanElement.classList.remove("jawaban-salah"), 500);
  }

  tebakanElement.value = "";

  if (nyawa == 0) {
    tebakanElement.disabled = true;
    tombolElement.disabled = true;

    showFeedback("GAME OVER", "incorrect");
    saveHighScore();
    clearCurrentSession();
  }
}

function updateGame() {
  skorElement.textContent = skor;
  levelElement.textContent = level + 1;
  nyawaElement.textContent = "❤️".repeat(nyawa) + "♡".repeat(3 - nyawa);
}

function applyBlur() {
  ctx.filter = `blur(10px)`;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function showFeedback(message, type) {
  feedbackMessageElement.textContent = message;
  feedbackMessageElement.className = type;
  feedbackMessageElement.style.opacity = 1;

  setTimeout(() => {
    feedbackMessageElement.style.opacity = 0;
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
