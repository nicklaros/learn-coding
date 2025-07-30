/**
 * session  = {
 *   playerName: string
 *   skor: integer
 *   level: integer
 *   nyawa: integer
 *   logos: [string]
 * }
 */
async function loadSession(gameId) {
  const response = await fetch(`http://localhost:3000/games/${gameId}`);
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
  };
}

function getCurrentSession() {
  return localStorage.getItem("currentSession");
}

function setCurrentSession(gameId) {
  localStorage.setItem("currentSession", gameId);
}

function clearCurrentSession() {
  localStorage.removeItem("currentSession");
}
