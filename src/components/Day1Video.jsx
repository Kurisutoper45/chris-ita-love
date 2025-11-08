/* src/components/Day1Video.jsx */
import React, { useEffect, useRef } from "react";

export default function Day1Video({ src = "/day1.mp4", caption = "Momen Day 1 Pacaran" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const siteAudio = document.getElementById("site-audio");
    const v = videoRef.current;
    if(!v) return;
    function onPlay() {
      if(siteAudio) {
        // try to keep site audio playing and lower volume while video plays
        siteAudio.play().catch(()=>{});
        try { siteAudio.volume = 0.45; } catch(e){}
      }
    }
    function onPause() {
      if(siteAudio) {
        try { siteAudio.volume = 1.0; } catch(e){}
      }
    }
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <div style={{marginTop:16}}>
      <h3 style={{marginBottom:6}}>{caption}</h3>
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        style={{width:"100%", borderRadius:12, background:"#000"}}
      >
        Browser kamu nggak support video tag.
      </video>
      <p style={{fontSize:12, color:"#666", marginTop:8}}>Tekan play — kalau musik site belum aktif, tekan tombol Music dulu.</p>
    </div>
  );
}
