/**
 * session  = {
 *   playerName: string
 *   skor: integer
 *   level: integer
 *   nyawa: integer
 * }
 */
function loadSession() {
  const encodedSession = localStorage.getItem("session");
  if (encodedSession === null) {
    return null;
  }

  return JSON.parse(encodedSession);
}
