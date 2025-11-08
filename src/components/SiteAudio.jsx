/* src/components/SiteAudio.jsx */
import React, { useEffect, useRef, useState } from "react";

export default function SiteAudio({ src = "/music.mp3" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if(!el) return;
    el.loop = true;
    el.preload = "auto";
  }, []);

  function toggle() {
    const el = audioRef.current;
    if(!el) return;
    if(el.paused) {
      el.play().catch(() => {
        // autoplay might be blocked until user interacts, but toggle is user-triggered so usually fine.
      });
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div style={{textAlign:"center", marginBottom:12}}>
      <button onClick={toggle} style={{background: playing ? "linear-gradient(90deg,#ff6fa3,#ffb36b)" : "#f0f0f0", border:"none", padding:"12px 22px", borderRadius:28, fontWeight:700}}>
        {playing ? "🎵 Music On" : "🔇 Music Off"}
      </button>
      <audio id="site-audio" ref={audioRef} src={src} />
      <div style={{fontSize:12, color:"#2a9d8f", marginTop:8}}>Audio siap — tekan tombol untuk mulai</div>
    </div>
  );
}
