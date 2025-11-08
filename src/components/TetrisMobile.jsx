\
// src/components/TetrisMobile.jsx
import React, { useEffect, useRef, useState } from "react";

const COLS_FULL = 10;
const ROWS_FULL = 20;

const COLS_MINI = 8;
const ROWS_MINI = 16;

const BLOCK_SIZE = 24;

const PIECES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[1,0],[1,0],[1,1]],
  J: [[0,1],[0,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]]
};
const PIECE_KEYS = Object.keys(PIECES);

function randPiece(){
  const k = PIECE_KEYS[Math.floor(Math.random()*PIECE_KEYS.length)];
  return { shape: PIECES[k], key: k };
}

function rotate(shape){
  const H = shape.length, W = shape[0].length;
  const out = Array.from({length: W}, ()=>Array(H).fill(0));
  for(let r=0;r<H;r++) for(let c=0;c<W;c++) out[c][H-1-r]=shape[r][c];
  return out;
}

export default function TetrisMobile({ onGameOver }){
  const [mini, setMini] = useState(true);
  const cols = mini ? COLS_MINI : COLS_FULL;
  const rows = mini ? ROWS_MINI : ROWS_FULL;
  const [grid, setGrid] = useState(()=>Array(rows).fill(0).map(()=>Array(cols).fill(0)));
  const [current, setCurrent] = useState(null);
  const [pos, setPos] = useState({x:0,y:0});
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const dropRef = useRef(null);
  const speedRef = useRef(420);

  useEffect(()=>{ reset(); }, [mini]);

  useEffect(()=>{
    if(running){
      dropRef.current && clearInterval(dropRef.current);
      dropRef.current = setInterval(()=>tick(), speedRef.current);
    } else {
      dropRef.current && clearInterval(dropRef.current);
    }
    return ()=> dropRef.current && clearInterval(dropRef.current);
  }, [running, current, pos]);

  function reset(){
    setGrid(Array(rows).fill(0).map(()=>Array(cols).fill(0)));
    setScore(0);
    spawn();
    setRunning(false);
  }

  function spawn(){
    const p = randPiece();
    const startX = Math.floor((cols - p.shape[0].length)/2);
    setCurrent(p);
    setPos({x:startX, y:0});
  }

  function canPlace(shape, x, y){
    for(let r=0;r<shape.length;r++){
      for(let c=0;c<shape[0].length;c++){
        if(shape[r][c]){
          const gx = x + c, gy = y + r;
          if(gx<0||gx>=cols||gy<0||gy>=rows) return false;
          if(grid[gy][gx]) return false;
        }
      }
    }
    return true;
  }

  function lockPiece(){
    const shape = current.shape;
    const newGrid = grid.map(row=>row.slice());
    for(let r=0;r<shape.length;r++) for(let c=0;c<shape[0].length;c++){
      if(shape[r][c]){
        const gx = pos.x + c, gy = pos.y + r;
        if(gy>=0 && gy<rows && gx>=0 && gx<cols) newGrid[gy][gx] = 1;
      }
    }
    setGrid(newGrid);
    clearLines(newGrid);
    const p = randPiece();
    const startX = Math.floor((cols - p.shape[0].length)/2);
    if(!canPlace(p.shape, startX, 0)){
      setRunning(false);
      onGameOver && onGameOver(score);
      return;
    }
    setCurrent(p);
    setPos({x:startX,y:0});
  }

  function clearLines(g){
    let removed = 0;
    const newGrid = g.filter(row => {
      const full = row.every(cell=>cell);
      if(full) removed++;
      return !full;
    });
    for(let i=0;i<removed;i++) newGrid.unshift(Array(cols).fill(0));
    if(removed){
      setGrid(newGrid);
      setScore(s=>s + removed * (mini ? 40 : 100));
      speedRef.current = Math.max(120, speedRef.current - removed*20);
    }
  }

  function tick(){
    if(!current) return;
    const ny = pos.y + 1;
    if(canPlace(current.shape, pos.x, ny)){
      setPos(p=>({...p, y: p.y+1}));
    } else {
      lockPiece();
    }
  }

  function doMove(dx){
    if(current && canPlace(current.shape, pos.x+dx, pos.y)) setPos(p=>({...p, x: p.x+dx}));
  }
  function doRotate(){
    const rot = rotate(current.shape);
    if(canPlace(rot, pos.x, pos.y)) setCurrent(c=>({...c, shape: rot}));
  }
  function doDrop(){
    if(!current) return;
    let y = pos.y;
    while(canPlace(current.shape, pos.x, y+1)) y++;
    setPos(p=>({...p, y}));
    lockPiece();
  }

  function handleStart(){
    setRunning(true);
    setScore(0);
    setGrid(Array(rows).fill(0).map(()=>Array(cols).fill(0)));
    spawn();
    speedRef.current = mini ? 380 : 550;
  }

  const display = grid.map(row=>row.slice());
  if(current){
    const s = current.shape;
    for(let r=0;r<s.length;r++) for(let c=0;c<s[0].length;c++){
      if(s[r][c]){
        const gx = pos.x + c, gy = pos.y + r;
        if(gy>=0 && gy<rows && gx>=0 && gx<cols) display[gy][gx] = 2;
      }
    }
  }

  const boardWidth = Math.min(360, cols * BLOCK_SIZE);
  const boardHeight = rows * BLOCK_SIZE;

  return (
    <div style={{maxWidth:420, margin:"0 auto"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <div style={{fontWeight:600}}>Score: {score}</div>
        <div>
          <label style={{fontSize:12, marginRight:8}}>
            <input type="checkbox" checked={mini} onChange={e=>setMini(e.target.checked)} /> Mini Mode
          </label>
        </div>
      </div>

      <div style={{width: boardWidth, height: boardHeight, background: "rgba(255,255,255,0.9)", borderRadius:12, overflow:"hidden", margin:"0 auto", position:"relative", boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
        <div style={{position:"absolute", inset:0, backgroundImage:"url('/tetris-bg.jpg')", backgroundSize:"cover", backgroundPosition:"center", filter:"blur(2px) brightness(0.6)", opacity:0.95}}/>
        <div style={{position:"absolute", inset:0, display:"grid", gridTemplateColumns:`repeat(${cols}, ${BLOCK_SIZE}px)`, gridTemplateRows:`repeat(${rows}, ${BLOCK_SIZE}px)`, gap:6, padding:6}}>
          {display.flat().map((cell, i) => {
            const bg = cell === 0 ? "rgba(255,255,255,0.06)" : (cell===1 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.75)");
            const border = "1px solid rgba(0,0,0,0.05)";
            return <div key={i} style={{width:BLOCK_SIZE, height:BLOCK_SIZE, background:bg, borderRadius:6, border, boxSizing:"border-box"}} />;
          })}
        </div>
      </div>

      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:12}}>
        <button onClick={()=>doMove(-1)} style={btnStyle}>◀</button>
        <button onClick={()=>doRotate()} style={btnStyle}>⟳</button>
        <button onClick={()=>doMove(1)} style={btnStyle}>▶</button>
        <button onClick={()=>doDrop()} style={{...btnStyle, background:"#f43f5e", color:"#fff"}}>Drop</button>
      </div>

      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:10}}>
        <button onClick={handleStart} style={{padding:"8px 14px", background:"#10b981", color:"#fff", borderRadius:8}}>Start</button>
        <button onClick={()=>{ setGrid(Array(rows).fill(0).map(()=>Array(cols).fill(0))); setScore(0); }} style={{padding:"8px 14px", background:"#f59e0b", color:"#fff", borderRadius:8}}>Reset</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding:"10px 12px",
  borderRadius:8,
  background:"#e6eef8",
  border:"none",
  boxShadow:"0 2px 4px rgba(0,0,0,0.06)",
  fontSize:16
};
