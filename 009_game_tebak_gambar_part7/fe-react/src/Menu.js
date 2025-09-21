import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadTopScorer, createNewGame } from "./api";
import { getCurrentSession, setCurrentSession } from "./session";
import "./common.css";
import "./index.css";

function Menu() {
  const [playerName, setPlayerName] = useState("");
  const [topScorers, setTopScorers] = useState([]);
  const navigate = useNavigate();
  const session = getCurrentSession();

  useEffect(() => {
    loadTopScorer().then(setTopScorers);
  }, []);

  const handleNewGame = async () => {
    if (session) {
      if (
        !window.confirm(
          "Game sebelumnya masih berjalan. Yakin mau mulai game baru?"
        )
      ) {
        return;
      }
    }

    if (!playerName) {
      alert("Mohon masukkan nama Anda terlebih dahulu");
      return;
    }

    const newGame = await createNewGame(playerName);
    setCurrentSession(newGame.id);
    navigate(`/game/${newGame.id}`);
  };

  const handleContinueGame = () => {
    navigate(`/game/${session}`);
  };

  return (
    <div className="container-game">
      <div className="game-title">Menu Game Tebak Gambar</div>
      <div className="game-body">
        <div className="option">
          <div>
            <button onClick={handleContinueGame} disabled={!session}>
              Lanjutkan
            </button>
          </div>
          <div>atau</div>
          <div className="container-new-game">
            <input
              type="text"
              id="player-name-input"
              placeholder="Tulis namamu..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button id="new-game-button" onClick={handleNewGame}>
              Mulai Game
            </button>
          </div>
        </div>
        <div className="top-scorer">
          <div className="title">Skor Terbaik</div>
          <div id="top-scorer-list">
            {topScorers.map((player, index) => (
              <div key={index}>
                <div className="player-name">{player.player_name}</div>
                <div className="score">{player.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
