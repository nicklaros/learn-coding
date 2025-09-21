export async function loadSession(gameId) {
  const response = await fetch(`http://xyz:3000/games/${gameId}`);
  const jsonResponse = await response.json();

  if (jsonResponse.error) {
    return null;
  }

  return {
    playerName: jsonResponse.player_name,
    skor: jsonResponse.score,
    level: jsonResponse.level,
    nyawa: jsonResponse.live,
    logos: jsonResponse.logo_images,
    isFinished: jsonResponse.is_finished,
  };
}

export async function makeAGuess(gameId, guess) {
  const response = await fetch(`http://xyz:3000/games/${gameId}/make_a_guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: guess,
    }),
  });
  return await response.json();
}

export async function createNewGame(playerName) {
  const response = await fetch("http://xyz:3000/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      player_name: playerName,
    }),
  });

  return await response.json();
}

export async function loadTopScorer() {
  const response = await fetch("http://xyz:3000/top-scorers");
  return await response.json();
}
