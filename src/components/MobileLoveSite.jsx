import React, { useEffect, useState } from "react";
import TetrisMobile from "./TetrisMobile.jsx";
import { motion } from "framer-motion";

const OUR_STORY = `Kadang semesta punya cara yang aneh tapi indah buat mempertemukan dua orang.
Nggak direncanain, nggak disengaja, cuma kebetulan yang ternyata berarti besar.
... (singkatkan kalau mau)`;

export default function MobileLoveSite() {
  const [audio, setAudio] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showInitOverlay, setShowInitOverlay] = useState(true);
  const [showGame, setShowGame] = useState(false);

  // create & prepare audio when user explicitly taps the overlay button
  const initAudio = async () => {
    try {
      const bg = new Audio("/music.mp3");
      bg.loop = true;
      // attempt to play briefly as direct result of the tap
      await bg.play();
      bg.pause();
      bg.currentTime = 0;
      setAudio(bg);
      setAudioReady(true);
      setShowInitOverlay(false);
      // give user visual feedback
    } catch (e) {
      console.log("initAudio error:", e);
      alert("Gagal inisialisasi audio. Coba ulangi sekali lagi.");
    }
  };

  const toggleMusic = async () => {
    try {
      if (musicPlaying) {
        if (audio) { audio.pause(); audio.currentTime = 0; }
        setMusicPlaying(false);
        return;
      }

      // if audio hasn't been prepared (shouldn't happen if overlay used), try fallback
      let bg = audio;
      if (!bg) {
        bg = new Audio("/music.mp3");
        bg.loop = true;
        setAudio(bg);
      }

      await bg.play();
      setMusicPlaying(true);
    } catch (e) {
      console.log("Toggle play error:", e);
      alert("Gagal memutar musik. Tekan tombol enable audio dulu (tap layar sekali), lalu coba play.");
    }
  };

  useEffect(() => {
    return () => {
      try {
        if (audio) { audio.pause(); audio.currentTime = 0; }
      } catch (e) {}
    };
  }, [audio]);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
        <div className="bg-white/90 rounded-2xl p-4 shadow-lg">
          <h1 className="text-center font-bold text-lg">💞 Chris & Ita</h1>
          <p className="text-center text-xs text-gray-500">Our Story — pixel edition</p>
        </div>
      </motion.header>

      <main className="w-full max-w-md mt-4">
        <section className="flex justify-center">
          <button
            onClick={toggleMusic}
            className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-3 rounded-full shadow-md active:scale-95"
            aria-pressed={musicPlaying}
          >
            {musicPlaying ? "🔊 Music On" : "🔇 Tap to Play Music"}
          </button>
        </section>

        <div className="mt-3 text-center text-xs">
          {audioReady ? (
            <span className="text-green-600">Audio siap — tekan tombol untuk memulai</span>
          ) : (
            <span className="text-red-500">Audio belum diinisialisasi — tap enable dulu</span>
          )}
        </div>

        <article className="bg-white rounded-2xl p-4 mt-4 shadow-md">
          <h2 className="text-sm font-bold mb-2">Our Story</h2>
          <p className="text-xs leading-relaxed" style={{ whiteSpace: "pre-line" }}>
            {OUR_STORY}
          </p>
        </article>

        <section className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Gallery Kenangan</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <img src="/moments/foto1.jpg" alt="foto1" className="w-40 h-56 object-cover rounded-lg" />
            <img src="/moments/foto2.jpg" alt="foto2" className="w-40 h-56 object-cover rounded-lg" />
            <img src="/moments/foto3.jpg" alt="foto3" className="w-40 h-56 object-cover rounded-lg" />
          </div>
        </section>

        <section className="mt-4">
          <h3 className="text-sm font-semibold">Momen Day 1 Pacaran</h3>
          <p className="text-xs text-gray-500">Judul: Momen Day 1 Pacaran</p>
          <video controls className="w-full rounded-lg mt-2" poster="/moments/thumb-day1.jpg">
            <source src="/moments/day1.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </section>

        <section className="mt-4 flex justify-center">
          <button onClick={() => setShowGame(!showGame)} className="bg-yellow-300 text-pink-800 px-4 py-2 rounded-lg shadow">
            {showGame ? "Back to Story" : "🎮 Play Tetris"}
          </button>
        </section>

        {showGame && (
          <div className="mt-4">
            <TetrisMobile />
          </div>
        )}

        <footer className="mt-6 text-xs text-gray-500 text-center">© 2025 Chris & Ita — Made with pixels & love</footer>
      </main>

      {/* BIG overlay that forces user to tap once to initialize audio */}
      {showInitOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11,16,32,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: "center", color: "white", padding: 20 }}>
            <h3 style={{ marginBottom: 8, fontSize: 18 }}>Klik layar untuk mengaktifkan musik</h3>
            <p style={{ marginBottom: 12, fontSize: 12, opacity: 0.9 }}>
              Tekan sekali di bawah untuk mengizinkan pemutaran musik.
            </p>
            <button
              onClick={initAudio}
              style={{
                background: "#ff6fa3",
                color: "white",
                padding: "10px 18px",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              Enable Audio
            </button>
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>Jika gagal, ulangi tekan sekali lagi.</div>
          </div>
        </div>
      )}
    </div>
  );
}
