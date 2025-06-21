const topScorer = loadTopScorer();

if (topScorer !== null) {
  const topScorerDiv = document.getElementById("top-scorer-list");
  topScorer.forEach(function (player) {
    const row =
      "<div>" +
      '<div class="player-name">' +
      player.playerName +
      "</div>" +
      '<div class="score">' +
      player.skor +
      "</div>" +
      "</div>";

    topScorerDiv.insertAdjacentHTML("beforeend", row);
  });
}

let session = loadSession();
if (session === null) {
  document.getElementById("continue-game-button").disabled = true;
}

function mulaiGameBaru() {
  if (session !== null) {
    const confirmationMessage =
      "Game sebelumnya masih berjalan. Yakin mau mulai game baru?";
    if (confirm(confirmationMessage) === false) {
      return;
    }
  }

  const playerName = document.getElementById("player-name-input").value;

  if (playerName === "") {
    alert("Mohon masukkan nama Anda terlebih dahulu");
    return;
  }

  session = {
    playerName: playerName,
    skor: 0,
    level: 0,
    nyawa: 3,
  };

  const encodedSession = JSON.stringify(session);

  localStorage.setItem("session", encodedSession);

  bukaHalamanGame();
}

function bukaHalamanGame() {
  location.href = "./game.html";
}

function loadTopScorer() {
  const encodedTopScorer = localStorage.getItem("topScorer");

  if (encodedTopScorer === null) {
    return null;
  }

  return JSON.parse(encodedTopScorer);
}
