loadTopScorer().then((topScorer) => {
  if (topScorer !== null) {
    const topScorerDiv = document.getElementById("top-scorer-list");
    topScorer.forEach(function (player) {
      const row =
        "<div>" +
        '<div class="player-name">' +
        player.player_name +
        "</div>" +
        '<div class="score">' +
        player.score +
        "</div>" +
        "</div>";

      topScorerDiv.insertAdjacentHTML("beforeend", row);
    });
  }
});

let session = getCurrentSession();
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

  setCurrentSession(jsonResponse.id);

  bukaHalamanGame(jsonResponse.id);
}

function lanjutkanGame() {
  bukaHalamanGame(session);
}

function bukaHalamanGame(gameId) {
  location.href = "./game.html?game_id=" + gameId;
}

async function loadTopScorer() {
  const response = await fetch("http://localhost:3000/top-scorers");
  const jsonResponse = response.json();

  return jsonResponse;
}
