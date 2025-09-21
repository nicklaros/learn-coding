const pictures = [
  {
    name: "nike",
    picture:
      "https://media.about.nike.com/image-downloads/cf68f541-fc92-4373-91cb-086ae0fe2f88/002-nike-logos-swoosh-white.jpg",
  },
  {
    name: "indomaret",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
  },
  {
    name: "google",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png",
  },
  {
    name: "playstore",
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8cIC2ovMzZuoSrsMkmddkI05BPf0BQyKzLw&s",
  },
  {
    name: "spotify",
    picture:
      "https://e7.pngegg.com/pngimages/18/942/png-clipart-spotify-computer-icons-music-transparency-logo-spotify-logo-grass-thumbnail.png",
  },
];

const feedbackMessageElement = document.getElementById("feedback-message");
const highestScoreElement = document.getElementById("highest-score");
const pictureElement = document.getElementById("picture");
const inputAnswerElement = document.getElementById("input-answer");
const btnAnswerElement = document.getElementById("button-answer");

let score = 0;
let level = 1;
let live = 3;

const session = loadSession();
if (session !== null) {
  score = session.score;
  level = session.level;
  live = session.live;
}

let highestScore = localStorage.getItem("highestScore");
if (highestScore === null) {
  highestScore = 0;
}
highestScoreElement.textContent = highestScore;

updateGameStats();

pictureElement.src = pictures[level - 1].picture;

function checkAnswer() {
  const answer = inputAnswerElement.value.toLowerCase();

  if (answer === pictures[level - 1].name) {
    level++;

    score += 10;

    showFeedback("Benar! Skor +10", "success");

    if (level <= pictures.length) {
      pictureElement.src = pictures[level - 1].picture;
    }
  } else {
    live--;

    score -= 2;

    if (live == 0) {
      showFeedback("GAME OVER", "warning");
    } else {
      showFeedback(`Salah! Nyawa berkurang. Sisa nyawa: ${live}`, "error");
    }
  }

  inputAnswerElement.value = "";
  inputAnswerElement.focus();

  if (live == 0 || level > pictures.length) {
    inputAnswerElement.disabled = true;
    btnAnswerElement.disabled = true;

    saveHighestScore();
    resetSession();

    setTimeout(() => {
      window.location.reload();
    }, 4000);
  } else {
    autosaveSession();
  }

  updateGameStats();
}

function loadSession() {
  const encodedSession = localStorage.getItem("session");
  if (encodedSession === null) {
    return null;
  }

  return JSON.parse(encodedSession);
}

function autosaveSession() {
  const session = {
    score: score,
    level: level,
    live: live,
  };

  const encodedSession = JSON.stringify(session);

  localStorage.setItem("session", encodedSession);
}

function resetSession() {
  localStorage.removeItem("session");
}

function updateGameStats() {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("live").textContent =
    "❤️".repeat(live) + "♡".repeat(3 - live);
}

function showFeedback(message, type) {
  feedbackMessageElement.textContent = message;
  feedbackMessageElement.className = type;
  feedbackMessageElement.style.opacity = 1;

  setTimeout(() => {
    feedbackMessageElement.style.opacity = 0;
  }, 4000);
}

function saveHighestScore() {
  const highestScore = localStorage.getItem("highestScore");

  if (highestScore === null || parseInt(highestScore) < score) {
    localStorage.setItem("highestScore", score.toString());
  }
}
