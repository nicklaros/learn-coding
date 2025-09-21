
export function getCurrentSession() {
  return localStorage.getItem("currentSession");
}

export function setCurrentSession(gameId) {
  localStorage.setItem("currentSession", gameId);
}

export function clearCurrentSession() {
  localStorage.removeItem("currentSession");
}
