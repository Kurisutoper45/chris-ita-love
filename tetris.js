/* Simple fast Tetris-like implementation (short rounds) */
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const scale = 20, COLS = 8, ROWS = 16;
canvas.width = COLS*scale; canvas.height = ROWS*scale;
let grid = Array.from({length:ROWS},()=>Array(COLS).fill(0));
let score = 0, timer=null;

// draw bg photo if exists
const bg = new Image(); bg.src = 'public/bg.jpg'; bg.onload = ()=>{ ctx.globalAlpha=0.12; ctx.drawImage(bg,0,0,canvas.width,canvas.height); ctx.globalAlpha=1; };

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // faint bg every frame
  if(bg.complete){ ctx.globalAlpha=0.12; ctx.drawImage(bg,0,0,canvas.width,canvas.height); ctx.globalAlpha=1;}
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      ctx.fillStyle = grid[y][x] ? '#ff9fb0' : 'rgba(255,255,255,0.02)';
      roundRect(x*scale+2,y*scale+2,scale-4,scale-4,4);
    }
  }
  document.getElementById('score').innerText = score;
}
function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fill(); }

function step(){
  const r = Math.max(0, ROWS-3-Math.floor(Math.random()*3));
  const c = Math.floor(Math.random()*COLS);
  grid[r][c]=1; score+=5;
  // check top row
  if(grid[0].some(v=>v===1)){
    clearInterval(timer);
    alert('Game over! Score: '+score+' — Cinta gak pernah game over 💕');
  }
  draw();
}

document.getElementById('left').addEventListener('click', ()=>{});
document.getElementById('right').addEventListener('click', ()=>{});
document.getElementById('rotate').addEventListener('click', ()=>{});
document.getElementById('drop').addEventListener('click', ()=>{ for(let i=0;i<3;i++) step(); });

document.addEventListener('DOMContentLoaded', ()=>{ document.getElementById('score').innerText = score; });
document.addEventListener('click', ()=>{});

function startGame(){ grid = Array.from({length:ROWS},()=>Array(COLS).fill(0)); score=0; timer = setInterval(step,600); }
startGame();
