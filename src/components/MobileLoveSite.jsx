import React, { useEffect, useState } from "react";
import TetrisMobile from "./TetrisMobile.jsx";
import { motion } from "framer-motion";

const OUR_STORY = `Kadang semesta punya cara yang aneh tapi indah buat mempertemukan dua orang.
Nggak direncanain, nggak disengaja, cuma kebetulan yang ternyata berarti besar.
Awalnya cuma basa-basi, obrolan ringan, dan tawa kecil — tapi lama-lama jadi cerita.

Ada momen-momen kecil: pesan tengah malam, ngopi bareng, ngetawain hal remeh.
Ada juga ujian: beda jadwal, salah paham kecil, tapi kita belajar buat beresin.
Yang penting: kita selalu kembali, dan kita selalu mau berusaha.

Pada 23 Juli 2025 kita memilih buat lanjut bareng. Bukan sekadar 'pacaran',
tapi niat buat saling menjaga, tumbuh bareng, dan nulis masa depan.
Hari itu bukan akhir — itu awal dari sesuatu yang lebih nyata dan hangat.

Terima kasih untuk semua tawa, kesabaran, dan harapan.
Ini kisah dua orang yang bersyukur; dari perkenalan kecil, semesta ternyata
membuka babak yang penuh warna.`;

export default function MobileLoveSite() {
  const [audio, setAudio] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // Note: do not create Audio() here on mount because some browsers
  // consider it non-user gesture and will block playing. We'll create
  // and play the audio inside the click handler.
  useEffect(() => {
    return () => {
      // cleanup if component unmounts
      try {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const toggleMusic = async () => {
    try {
      if (musicPlaying) {
        // stop music
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          setAudio(null);
        }
        setMusicPlaying(false);
        return;
      }

      // Create Audio right when user clicks — this counts as a user gesture
      const bg = new Audio("/music.mp3"); // must be public/music.mp3
      bg.loop = true;

      // try play, await the promise so we handle errors
      await bg.play();
      setAudio(bg);
      setMusicPlaying(true);
    } catch (e) {
      // browser blocked or file missing
      console.log("Audio play error:", e);
      // optional: show tiny UI hint for the user
      alert("Gagal memutar musik. Coba periksa koneksi atau ulangi tombol.");
    }
  };

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
    </div>
  );
}
