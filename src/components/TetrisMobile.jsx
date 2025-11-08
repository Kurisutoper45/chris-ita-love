import React, { useState, useEffect, useRef, useCallback } from "react";

const ROWS = 20;
const COLS = 10;
const EMPTY = 0;
const SHAPES = {
  I: { blocks: [[1,1,1,1]], color: "#00f0f0" },
  J: { blocks: [[2,0,0],[2,2,2]], color: "#0000f0" },
  L: { blocks: [[0,0,3],[3,3,3]], color: "#f0a000" },
  O: { blocks: [[4,4],[4,4]], color: "#f0f000" },
  S: { blocks: [[0,5,5],[5,5,0]], color: "#00f000" },
  T: { blocks: [[0,6,0],[6,6,6]], color: "#a000f0" },
  Z: { blocks: [[7,7,0],[0,7,7]], color: "#f00000" },
};
const KEYS = Object.keys(SHAPES);

function rotate(matrix){
  const N = matrix.length;
  const res = Array.from({length: N}, ()=> Array(N).fill(0));
  for(let r=0;r<N;r++) for(let c=0;c<N;c++) res[c][N-1-r] = matrix[r][c] || 0;
  return res;
}
function randomShape(){
  const key = KEYS[Math.floor(Math.random()*KEYS.length)];
  const s = SHAPES[key];
  const size = Math.max(s.blocks.length, s.blocks[0].length);
  const m = Array.from({length:size}, (_,r)=> Array.from({length:size}, (_,c)=> (s.blocks[r] && s.blocks[r][c]) || 0));
  return { matrix: m, color: s.color };
}
function createEmptyGrid(){ return Array.from({length:ROWS}, ()=> Array(COLS).fill(EMPTY)); }
function collide(grid, piece, pos){
  const m = piece.matrix;
  for(let r=0;r<m.length;r++) for(let c=0;c<m[r].length;c++) if(m[r][c]){
    const y = pos.y + r; const x = pos.x + c;
    if(x<0||x>=COLS||y>=ROWS) return true;
    if(y>=0 && grid[y][x]) return true;
  }
  return false;
}
function merge(grid,piece,pos){
  const ng = grid.map(row=>row.slice()); const m = piece.matrix; for(let r=0;r<m.length;r++) for(let c=0;c<m[r].length;c++) if(m[r][c]){ const y=pos.y+r; const x=pos.x+c; if(y>=0&&y<ROWS&&x>=0&&x<COLS) ng[y][x]=m[r][c]; } return ng;
}
function clearLines(grid){
  let lines=0;
  const newGrid = grid.filter(row=>{ const full = row.every(cell=>cell!==EMPTY); if(full) lines++; return !full; });
  while(newGrid.length<ROWS) newGrid.unshift(Array(COLS).fill(EMPTY));
  return {grid:newGrid, linesCleared:lines};
}

function useInterval(cb, delay){ const ref = useRef(cb); useEffect(()=>{ ref.current = cb }, [cb]); useEffect(()=>{ if(delay===null) return; const id=setInterval(()=>ref.current(), delay); return ()=>clearInterval(id); }, [delay]); }

export default function TetrisMobile({ onScore }){
  const [grid, setGrid] = useState(()=>createEmptyGrid());
  const [piece, setPiece] = useState(()=>randomShape());
  const [pos, setPos] = useState({x:Math.floor(COLS/2)-1, y:-2});
  const [dropInterval, setDropInterval] = useState(700);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const resetPiece = useCallback(()=>{ setPiece(randomShape()); setPos({x:Math.floor(COLS/2)-1,y:-2}); }, []);

  const drop = useCallback(()=>{ if(gameOver||paused) return; const next = {x:pos.x, y:pos.y+1}; if(!collide(grid, piece, next)) setPos(next); else{ const merged = merge(grid, piece, pos); const {grid:cleared, linesCleared} = clearLines(merged); if(linesCleared){ const add = [0,40,100,300,1200][linesCleared]||linesCleared*100; setScore(s=>s+add); onScore && onScore(score+add); } setGrid(cleared); resetPiece(); if(collide(cleared, piece, {x:Math.floor(COLS/2)-1,y:-2})){ setGameOver(true); setDropInterval(null); } } }, [grid,piece,pos,gameOver,paused,resetPiece,onScore,score]);

  useInterval(drop, dropInterval);

  const move = (dir)=>{ if(gameOver||paused) return; const next={x:pos.x+dir,y:pos.y}; if(!collide(grid,piece,next)) setPos(next); }
  const rotatePiece = ()=>{ if(gameOver||paused) return; const rotated = {...piece, matrix: rotate(piece.matrix)}; if(!collide(grid, rotated, pos)) setPiece(rotated); }
  const hardDrop = ()=>{ if(gameOver||paused) return; let y=pos.y; while(!collide(grid,piece,{x:pos.x,y:y+1})) y++; setPos({x:pos.x,y}); drop(); }
  const restart = ()=>{ setGrid(createEmptyGrid()); setPiece(randomShape()); setPos({x:Math.floor(COLS/2)-1,y:-2}); setGameOver(false); setScore(0); setDropInterval(700); setPaused(false); }

  useEffect(()=>{ const h=(e)=>{ if(gameOver) return; if(e.key==='ArrowLeft') move(-1); else if(e.key==='ArrowRight') move(1); else if(e.key==='ArrowDown') drop(); else if(e.key==='ArrowUp') rotatePiece(); else if(e.code==='Space'){ e.preventDefault(); hardDrop(); } else if(e.key.toLowerCase()==='p') setPaused(p=>!p); }; window.addEventListener('keydown', h); return ()=>window.removeEventListener('keydown', h); }, [move,drop,rotatePiece,hardDrop,gameOver]);

  const displayGrid = merge(grid, piece, pos);

  return (
    <div className="p-2 rounded-md bg-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Tetris of Love</div>
        <div className="text-xs text-gray-500">Score: {score}</div>
      </div>

      <div className="mx-auto" style={{ width: COLS*16 }}>
        {displayGrid.map((row, rIdx)=> (
          <div key={rIdx} className="flex">
            {row.map((cell,cIdx)=> (
              <div key={cIdx} style={{ width:14, height:14, margin:1, background: cell ? '#ef4444' : '#0b1220', borderRadius:2, boxShadow: cell ? 'inset 0 -2px 0 rgba(0,0,0,0.3)' : 'none' }} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <button onClick={()=>move(-1)} className="px-2 py-2 rounded bg-white/90 border">◀</button>
        <button onClick={rotatePiece} className="px-2 py-2 rounded bg-white/90 border">⤾</button>
        <button onClick={()=>move(1)} className="px-2 py-2 rounded bg-white/90 border">▶</button>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={()=>drop()} className="flex-1 px-2 py-2 rounded bg-white/90 border">↓</button>
        <button onClick={()=>hardDrop()} className="flex-1 px-2 py-2 rounded bg-gradient-to-r from-pink-500 to-purple-500 text-white">Drop</button>
      </div>

      <div className="mt-2 flex gap-2">
        <button onClick={()=>setDropInterval(d=> d? null:700)} className="px-2 py-1 rounded border text-sm">{dropInterval? 'Pause' : 'Resume'}</button>
        <button onClick={restart} className="px-2 py-1 rounded border text-sm">Restart</button>
      </div>

      {gameOver && <div className="mt-2 text-center text-sm text-red-600 font-semibold">Game Over — coba lagi!</div>}
    </div>
  );
}
