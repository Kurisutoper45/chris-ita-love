import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TetrisMobile from "./TetrisMobile"; // will include below

const GALLERY = [
  { id:1, type:'photo', src:'https://via.placeholder.com/800x600?text=Foto+Chris+Ita+1', caption:'Senyum butuh 5 take' },
  { id:2, type:'photo', src:'https://via.placeholder.com/800x600?text=Foto+Chris+Ita+2', caption:'Momen konyol bareng' },
  { id:3, type:'video', src:'https://www.w3schools.com/html/mov_bbb.mp4', caption:'Momen Day 1 Pacaran' }
];

const pixelCSS = `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); .pixel-font{font-family:'Press Start 2P',monospace}.music-note{animation: floatUp 1800ms linear infinite} @keyframes floatUp{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-120px);opacity:0}} .music-pulse{animation: pulse 800ms ease-in-out infinite} @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.07)}100%{transform:scale(1)}}`;

export default function MobileLoveSite(){
  const [showIntro, setShowIntro] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
  const audioRef = useRef(null);
  const [typewriter, setTypewriter] = useState('');
  const [gallery, setGallery] = useState(GALLERY);
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const STORY = `Kadang semesta punya cara yang aneh tapi indah buat mempertemukan dua orang.\n\nNggak direncanain, nggak disengaja, cuma kebetulan yang ternyata berarti besar.\n\nBegitulah awal cerita kita...`;

  useEffect(()=>{ if(showIntro && playMusic){ let i=0; setTypewriter(''); const iv=setInterval(()=>{ i++; setTypewriter(STORY.slice(0,i)); if(i>=STORY.length) clearInterval(iv); }, 22); return ()=>clearInterval(iv); } }, [showIntro, playMusic]);

  function startMusic(){ setPlayMusic(true); if(audioRef.current) audioRef.current.play().catch(()=>{}); setTimeout(()=> setShowIntro(false), 2800); }

  function openItem(it){ setActive(it); }
  function closeItem(){ setActive(null); }
  function sendMsg(){ if(!msg.trim()) return setMsg('Isi pesannya dulu.'); setGallery(g=> [{id:Date.now(), type:'note', caption:msg}, ...g]); setMsg(''); setSent(true); setTimeout(()=>setSent(false),4000); }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 p-4 text-gray-900">
      <style>{pixelCSS}</style>
      <div className="max-w-md mx-auto bg-white/90 rounded-xl p-4 shadow-lg">
        {showIntro && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
            <div className="text-center">
              <h1 className="text-2xl text-green-300 mb-2 pixel-font">Our Story</h1>
              <h2 className="text-sm text-pink-200 mb-4 pixel-font">Chris & Ita</h2>
              <button onClick={startMusic} className={`mx-auto px-6 py-4 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold pixel-font ${playMusic? 'music-pulse' : ''}`}>
                🎵 Klik untuk nyalain musik & cerita
              </button>
              <p className="text-xs text-gray-200 mt-2">Tekan satu kali — biar audio bisa diputar di ponsel.</p>
              {playMusic && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  <div className="text-white music-note">🎵</div>
                  <div className="text-white music-note" style={{ animationDelay:'250ms' }}>💞</div>
                  <div className="text-white music-note" style={{ animationDelay:'520ms' }}>✨</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white pixel-font">C&I</div>
            <div>
              <div className="text-sm font-semibold pixel-font">Chris & Ita</div>
              <div className="text-xs text-gray-500">Our Story — mobile version</div>
            </div>
          </div>
          <div>
            <button onClick={()=>{ if(audioRef.current){ if(playMusic){ audioRef.current.pause(); setPlayMusic(false); } else { audioRef.current.play().catch(()=>{}); setPlayMusic(true); } } }} className={`px-3 py-1 rounded border pixel-font`}>{playMusic? 'Stop' : 'Music'}</button>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-700" style={{lineHeight:1.4}}>{typewriter || 'Tekan tombol musik untuk mulai membaca kisah kami.'}</div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2 pixel-font">Gallery Kenangan</div>
          <div className="grid grid-cols-2 gap-2">
            {gallery.map(it=> (
              <button key={it.id} onClick={()=> openItem(it)} className="bg-gray-100 rounded p-1 overflow-hidden">
                {it.type==='photo' && <img src={it.src} alt={it.caption} className="w-full h-24 object-cover" />} 
                {it.type==='video' && <div className="w-full h-24 flex items-center justify-center bg-black text-white">📼 {it.caption}</div>}
                {it.type==='note' && <div className="w-full h-24 p-2 text-xs text-left">💬 {it.caption}</div>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm font-medium pixel-font mb-2">Tetris of Love (Touch Controls)</div>
          <TetrisMobile onScore={(s)=>{}} />
        </div>

        <div className="mt-3">
          <div className="text-sm font-medium pixel-font">Kirim Doa / Pesan</div>
          <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Tulis pesan..." className="w-full mt-2 p-2 rounded border text-sm h-20" />
          <button onClick={sendMsg} className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded pixel-font">Kirim</button>
          {sent && <div className="mt-2 text-xs text-green-700">Terima kasih! Pesan muncul di dinding.</div>}
        </div>

        <footer className="mt-4 text-xs text-center text-gray-500">Momen Day 1 Pacaran ada di gallery — klik untuk nonton.</footer>

        {active && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded w-full max-w-md p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold pixel-font">{active.caption}</div>
                <button onClick={closeItem} className="text-sm border rounded px-2 py-1">Tutup</button>
              </div>
              <div>
                {active.type==='photo' && <img src={active.src} alt={active.caption} className="w-full h-80 object-cover" />}
                {active.type==='video' && <video controls className="w-full h-80 bg-black"><source src={active.src} type="video/mp4"/>Browser nggak support video.</video>}
                {active.type==='note' && <div className="p-2">{active.caption}</div>}
              </div>
            </div>
          </div>
        )}

        <audio ref={audioRef} loop src="https://cdn.simple-melodies.example/soft-loop.mp3" />
      </div>
    </div>
  );
}
