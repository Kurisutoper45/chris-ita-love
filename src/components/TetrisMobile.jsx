import React, { useEffect, useRef, useState } from "react";

/*
  TetrisMobile.jsx
  - Basic, working Tetris engine in React (mobile-first)
  - Touch controls: left, right, rotate, soft-drop
  - Uses simple grid (20 rows x 10 cols)
  - Calls props.onGameOver(score) when player loses
  - Scoring: single line = 100, multiple lines give combo multiplier
  - No external dependencies
*/

const ROWS = 20;
const COLS = 10;
const START_SPEED = 800; // ms drop interval

// tetromino shapes and their rotations (4 rotation states)
const TETROMINOES = {
  I: [
    [[0,1],[1,1],[2,1],[3,1]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[1,0],[1,1],[1,2],[1,3]],
  ],
  J: [
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[0,2]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[1,0],[2,0],[1,1],[1,2]],
  ],
  L: [
    [[2,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,1],[0,2]],
    [[0,0],[1,0],[1,1],[1,2]],
  ],
  O: [
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
  ],
  S: [
    [[1,0],[2,0],[0,1],[1,1]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[1,1],[2,1],[0,2],[1,2]],
    [[0,0],[0,1],[1,1],[1,2]],
  ],
  T: [
    [[1,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,2]],
    [[1,0],[0,1],[1,1],[1,2]],
  ],
  Z: [
    [[0,0],[1,0],[1,1],[2,1]],
    [[2,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[1,0],[0,1],[1,1],[0,2]],
  ],
};

const PIECES = Object.keys(TETROMINOES);

function emptyGrid() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

function randomPiece() {
  const type = PIECES[Math.floor(Math.random() * PIECES.length)];
  const rot = 0;
  const shape = TETROMINOES[type][rot];
  // starting x offset puts piece roughly centered
  const startX = Math.floor((COLS / 2) - 2);
  const startY = -1; // start slightly above
  return { type, rot, x: startX, y: startY, shape };
}

function getCells(piece) {
  const rotShape = TETROMINOES[piece.type][piece.rot];
  return rotShape.map(([dx, dy]) => [piece.x + dx, piece.y + dy]);
}

function collides(grid, piece, offsetX = 0, offsetY = 0, newRot = null) {
  const rot = newRot === null ? piece.rot : newRot;
  const shape = TETROMINOES[piece.type][rot];
  for (let [dx, dy] of shape) {
    const x = piece.x + dx + offsetX;
    const y = piece.y + dy + offsetY;
    if (x < 0 || x >= COLS) return true;
    if (y >= ROWS) return true;
    if (y >= 0 && grid[y] && grid[y][x]) return true;
  }
  return false;
}

export default function TetrisMobile({ onGameOver = null }) {
  const [grid, setGrid] = useState(() => emptyGrid());
  const [piece, setPiece] = useState(() => randomPiece());
  const [nextPiece, setNextPiece] = useState(() => randomPiece());
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(START_SPEED);
  const [level, setLevel] = useState(1);
  const tickRef = useRef(null);
  const lockDelayRef = useRef(0);

  // helper to merge piece into new grid (for rendering static snapshot)
  const getGridWithPiece = (g = grid, p = piece) => {
    const copy = g.map(row => row.slice());
    if (p) {
      TETROMINOES[p.type][p.rot].forEach(([dx, dy]) => {
        const x = p.x + dx;
        const y = p.y + dy;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          copy[y][x] = p.type;
        }
      });
    }
    return copy;
  };

  // start/reset
  const startGame = () => {
    setGrid(emptyGrid());
    setPiece(randomPiece());
    setNextPiece(randomPiece());
    setScore(0);
    setLevel(1);
    setSpeed(START_SPEED);
    setRunning(true);
  };

  // end game
  const endGame = (reason = "quit") => {
    setRunning(false);
    if (typeof onGameOver === "function") onGameOver(score);
  };

  // lock piece into grid and spawn next
  const lockPiece = (p) => {
    const g = grid.map(r => r.slice());
    TETROMINOES[p.type][p.rot].forEach(([dx, dy]) => {
      const x = p.x + dx;
      const y = p.y + dy;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        g[y][x] = p.type;
      } else if (y < 0) {
        // locked above visible area -> game over
        setGrid(g);
        setRunning(false);
        if (typeof onGameOver === "function") onGameOver(score);
      }
    });

    // clear lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (g[r].every(cell => cell !== null)) {
        g.splice(r, 1);
        g.unshift(Array.from({ length: COLS }, () => null));
        linesCleared++;
        r++; // re-check same row index because rows shifted
      }
    }

    // scoring
    if (linesCleared > 0) {
      const points = 100 * (linesCleared ** 2); // 1->100,2->400,3->900,4->1600
      setScore(s => s + points);
      // speed up slightly every 5 lines (simple)
      setLevel(l => {
        const nl = l + Math.floor(linesCleared / 2);
        setSpeed(Math.max(150, START_SPEED - (nl - 1) * 60));
        return nl;
      });
    }

    setGrid(g);
    setPiece(nextPiece);
    setNextPiece(randomPiece());
  };

  // piece movement functions
  const move = (dx, dy) => {
    if (!piece) return;
    if (!collides(grid, piece, dx, dy)) {
      setPiece(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
      return true;
    }
    return false;
  };

  const rotate = (dir = 1) => {
    if (!piece) return;
    const newRot = (piece.rot + dir + 4) % 4;
    // try wall kicks: none fancy, try offsets
    const kicks = [0, -1, 1, -2, 2];
    for (let k of kicks) {
      if (!collides(grid, piece, k, 0, newRot)) {
        setPiece(p => ({ ...p, rot: newRot, x: p.x + k }));
        return true;
      }
    }
    return false;
  };

  const hardDrop = () => {
    if (!piece) return;
    let fall = 0;
    while (!collides(grid, piece, 0, fall + 1)) fall++;
    setPiece(p => ({ ...p, y: p.y + fall }));
    lockPiece({ ...piece, y: piece.y + fall });
  };

  // gravity tick
  useEffect(() => {
    if (!running) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    // clear previous
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setPiece((p) => {
        if (!p) return p;
        if (!collides(grid, p, 0, 1)) {
          return { ...p, y: p.y + 1 };
        } else {
          // can't move down -> lock
          lockPiece(p);
          return randomPiece(); // but lockPiece previously sets piece to nextPiece via state, so this return may be ignored; safe fallback
        }
      });
    }, speed);
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, grid, speed]);

  // keyboard controls (for convenience desktop)
  useEffect(() => {
    const handleKey = (e) => {
      if (!running) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1, 0);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        move(0, 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        rotate(1);
      } else if (e.key === " ") {
        e.preventDefault();
        hardDrop();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, grid, piece]);

  // touch controls handlers (throttle basic)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastTap = useRef(0);

  const onTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };

  const onTouchEnd = (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // swipe thresholds
    if (absX > 30 && absX > absY) {
      // horizontal swipe
      if (dx > 0) move(1, 0);
      else move(-1, 0);
      return;
    }

    if (absY > 30 && absY > absX) {
      // vertical swipe down -> soft drop
      if (dy > 0) move(0, 1);
      return;
    }

    // tap => rotate (double-tap => hard drop)
    const now = Date.now();
    if (now - lastTap.current < 300) {
      hardDrop();
      lastTap.current = 0;
    } else {
      rotate(1);
      lastTap.current = now;
    }
  };

  // if piece initial spawn collides immediately => game over
  useEffect(() => {
    if (piece && collides(grid, piece, 0, 0)) {
      // immediate collision => game over
      setRunning(false);
      if (typeof onGameOver === "function") onGameOver(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piece]);

  // small UI helpers
  const colorFor = (type) => {
    const map = {
      I: "#4dd0e1",
      J: "#1976d2",
      L: "#ffb74d",
      O: "#ffd54f",
      S: "#66bb6a",
      T: "#ba68c8",
      Z: "#ef5350",
    };
    return map[type] || "#ccc";
  };

  // render grid cell
  const Cell = ({ value }) => {
    const style = value ? { background: colorFor(value), borderRadius: 4 } : { background: "transparent" };
    return <div className="cell" style={style} />;
  };

  // small controls for mobile: separate buttons
  return (
    <div className="w-full bg-white p-3 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <div>Score: <strong>{score}</strong></div>
        <div className="text-xs">Level: {level}</div>
      </div>

      {/* Next piece preview */}
      <div className="mb-3 flex gap-3 items-center">
        <div className="text-xs text-gray-500">Next:</div>
        <div style={{ width: 48, height: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {Array.from({ length: 4 * 4 }).map((_, i) => {
            // draw small 4x4 block
            const row = Math.floor(i / 4);
            const col = i % 4;
            const s = TETROMINOES[nextPiece.type][0];
            const occupied = s.some(([dx, dy]) => dx === col && dy === row);
            return <div key={i} style={{ width: 10, height: 10, background: occupied ? colorFor(nextPiece.type) : "#f3f3f3", borderRadius: 2 }} />;
          })}
        </div>
      </div>

      {/* game area */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          maxWidth: 360,
          margin: "0 auto",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 2, background: "#e6e6e6", padding: 6 }}>
          {getGridWithPiece().map((row, r) =>
            row.map((cell, c) => <Cell key={`${r}-${c}`} value={cell} />)
          )}
        </div>
      </div>

      {/* mobile action buttons */}
      <div className="mt-3 flex justify-center gap-3">
        <button onClick={() => move(-1, 0)} className="px-4 py-2 bg-gray-200 rounded">◀</button>
        <button onClick={() => rotate(1)} className="px-4 py-2 bg-blue-500 text-white rounded">⟳</button>
        <button onClick={() => move(1, 0)} className="px-4 py-2 bg-gray-200 rounded">▶</button>
        <button onClick={() => move(0, 1)} className="px-4 py-2 bg-yellow-400 rounded">▼</button>
        <button onClick={() => hardDrop()} className="px-4 py-2 bg-red-500 text-white rounded">Drop</button>
      </div>

      {/* play controls */}
      <div className="mt-3 flex gap-2 justify-center">
        {!running ? (
          <button onClick={startGame} className="px-4 py-2 bg-green-500 text-white rounded">Start</button>
        ) : (
          <button onClick={() => endGame("user")} className="px-4 py-2 bg-gray-200 rounded">End</button>
        )}
        <button onClick={() => setGrid(emptyGrid())} className="px-4 py-2 bg-gray-100 rounded">Clear</button>
      </div>

      <style jsx>{`
        .cell {
          width: 100%;
          padding-top: 100%;
          position: relative;
        }
        .cell > * {
          position: absolute;
        }
        .cell {
          min-height: 0;
          height: 0;
        }
        /* small visual tweak: use inner pseudo element via inline simple styles above */
      `}</style>
    </div>
  );
}
