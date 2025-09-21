
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSession, makeAGuess } from './api';
import { clearCurrentSession } from './session';
import './common.css';
import './game.css';

function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [session, setSession] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadSession(gameId).then(sessionData => {
      if (sessionData && !sessionData.isFinished) {
        setSession(sessionData);
      } else {
        navigate('/');
      }
    });

    let storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(storedHighScore);
    }
  }, [gameId, navigate]);

  useEffect(() => {
    if (session && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = session.logos[session.level];
      img.onload = () => {
        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [session]);

  const handleGuess = async () => {
    const response = await makeAGuess(gameId, guess);

    if (response.is_correct) {
      setSession(prev => ({ ...prev, score: response.score, level: response.level }));
      if (response.score > highScore) {
        setHighScore(response.score);
        localStorage.setItem("highScore", response.score);
      }
      showFeedback('Benar! Skor +10 🎉', 'correct');
    } else {
      setSession(prev => ({ ...prev, score: response.score, nyawa: response.live }));
      showFeedback(`Salah! Nyawa berkurang. Sisa nyawa: ${response.live}`, 'incorrect');
    }

    setGuess('');

    if (response.is_finished) {
      showFeedback('GAME OVER', 'incorrect');
      clearCurrentSession();
    }
  };

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 4000);
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-game">
      <div className="game-title">Player - {session.playerName}</div>
      <div className="game-body">
        <div className="container-gambar">
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
        <div>
          <div className="container-isian">
            <input
              type="text"
              id="tebakan"
              placeholder="Tulis tebakanmu..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={session.isFinished}
            />
            <button id="tombol" onClick={handleGuess} disabled={session.isFinished}>
              tebak
            </button>
          </div>
          <div className="game-statistik">
            <div>
              <div className="label">Skor</div>
              <div className="value" id="skor">{session.skor}</div>
            </div>
            <div>
              <div className="label">High Skor</div>
              <div className="value" id="high-skor">{highScore}</div>
            </div>
            <div>
              <div className="label">Level</div>
              <div className="value" id="level">{session.level + 1}</div>
            </div>
            <div>
              <div className="label">Nyawa</div>
              <div className="value" id="nyawa">
                {'❤️'.repeat(session.nyawa) + '♡'.repeat(3 - session.nyawa)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {feedback.message && (
        <div id="feedback-message" className={feedback.type} style={{ opacity: 1 }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}

export default Game;
