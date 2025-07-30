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

async function mulaiGameBaru() {
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

  const response = await fetch("http://localhost:3000/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      player_name: playerName,
    }),
  });

  const jsonResponse = await response.json();

  bukaHalamanGame(jsonResponse.id);
}

function bukaHalamanGame(gameId) {
  location.href = "./game.html?game_id=" + gameId;
}

function loadTopScorer() {
  const encodedTopScorer = localStorage.getItem("topScorer");

  if (encodedTopScorer === null) {
    return null;
  }

  return JSON.parse(encodedTopScorer);
}
