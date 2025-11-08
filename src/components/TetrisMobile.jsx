import React, { useEffect, useState } from "react";

/*
  Minimal TetrisMobile untuk demo mobile:
  - Start / End (simulate)
  - Simulasi skor bertambah
  - Panggil props.onGameOver(finalScore) saat user mengakhiri permainan
*/

export default function TetrisMobile({ onGameOver }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let t;
    if (running) {
      t = setInterval(() => {
        setScore((s) => s + Math.floor(Math.random() * 5)); // skor acak demi demo
      }, 700);
    }
    return () => clearInterval(t);
  }, [running]);

  const startGame = () => {
    setScore(0);
    setRunning(true);
  };

  const endGame = () => {
    setRunning(false);
    if (typeof onGameOver === "function") onGameOver(score);
  };

  return (
    <div className="w-full bg-white p-3 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <div>Score: <strong>{score}</strong></div>
        <div className="text-xs">Touch controls</div>
      </div>

      <div className="h-48 bg-black/5 rounded-md mb-3 flex items-center justify-center text-gray-400">
        {running ? "Game berjalan... (simulasi)" : "Tekan Start untuk main"}
      </div>

      <div className="flex gap-2">
        {!running ? (
          <button onClick={startGame} className="px-3 py-2 bg-green-500 text-white rounded">Start</button>
        ) : (
          <button onClick={endGame} className="px-3 py-2 bg-red-500 text-white rounded">End (simulate)</button>
        )}

        <button onClick={() => setScore(s => s + 10)} className="px-3 py-2 bg-yellow-400 rounded">+10</button>
      </div>
    </div>
  );
}
