import React, { useEffect, useState } from "react";
import TetrisMobile from "./TetrisMobile.jsx";
import { motion } from "framer-motion";

const OUR_STORY = `— Chris & Ita

Kadang semesta punya cara yang aneh tapi indah buat mempertemukan dua orang.
Nggak direncanain, nggak disengaja, cuma kebetulan yang ternyata berarti besar.
Begitulah awal cerita kita — dua orang yang awalnya dikenalkan oleh teman,
tanpa tahu kalau pertemuan sederhana itu bakal berubah jadi sesuatu yang istimewa.

Awalnya cuma basa-basi: sapaan kecil di chat, obrolan panjang yang nyambung,
dan tawa yang sering muncul karena hal-hal receh. Kita berdua nggak pernah
membayangkan kalau rutinitas itu bakal berkembang jadi sesuatu yang lebih.
Nggak ada momen dramatis, nggak ada janji manis berlebihan — cuma dua hati
yang pelan-pelan saling ngerti tanpa banyak kata.

Seiring waktu, kebersamaan itu terus tumbuh:
kita saling belajar, saling ingetin hal kecil, dan saling ngingetin mimpi.
Ada hari-hari yang gampang, ada juga yang sulit — beda jadwal, salah paham,
situasi yang bikin deg-degan. Tapi kita pilih buat duduk, ngobrol, dan beresin.
Itu yang bikin hubungan ini bukan cuma 'sementara', tapi mulai berakar.

Lalu datanglah 23 Juli 2025 — tanggal yang kita simpen di ingatan.
Bukan pesta besar, bukan acara mewah; cuma keputusan sederhana tapi nyata:
kita memutuskan buat jalan bareng bukan hanya untuk hari-hari ini,
tapi untuk masa depan juga. Hari itu kita resmi memulai babak baru,
dengan rasa yang tulus dan niat yang nyata.

Hubungan ini mengajarkan kita banyak hal: tentang kesabaran, kompromi,
dan cara untuk tumbuh bareng tanpa kehilangan diri sendiri.
Kita tetap dua orang dengan cerita masing-masing, tapi memilih untuk
menggabungkan harapan dan rencana. Nggak selalu mudah, tapi selalu berarti.

Terima kasih untuk setiap tawa, maaf, dan pelukan yang kita bagi.
Dari pertemuan kecil itu, semesta ternyata lagi nulis salah satu kisah
terindah dalam hidup kita. Kita bersyukur — dan kita masih excited
buat nulis bab-bab selanjutnya bareng.`;


export default function MobileLoveSite() {
  const [audio, setAudio] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showInitOverlay, setShowInitOverlay] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);

  const initAudio = async () => {
    try {
      const bg = new Audio("/music.mp3");
      bg.loop = true;
      await bg.play();
      bg.pause();
      bg.currentTime = 0;
      setAudio(bg);
      setAudioReady(true);
      setShowInitOverlay(false);
    } catch (e) {
      console.log("initAudio error:", e);
      alert("Gagal inisialisasi audio. Coba ulangi sekali lagi.");
    }
  };

  const toggleMusic = async () => {
    try {
      if (musicPlaying) {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setMusicPlaying(false);
        return;
      }

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
      alert("Gagal memutar musik — coba tekan 'Enable Audio' lalu coba lagi.");
    }
  };

  useEffect(() => {
    return () => {
      try {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (e) {}
    };
  }, [audio]);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gradient-to-b from-pink-50 to-white">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h1 className="text-center font-bold text-xl">💞 Chris & Ita</h1>
          <p className="text-center text-sm text-gray-500">Our Story — pixel edition</p>
        </div>
      </motion.header>

      <main className="w-full max-w-md mt-4 mb-6">
        <section className="flex justify-center">
          <button
            onClick={toggleMusic}
            className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-3 rounded-full shadow-md active:scale-95"
            aria-pressed={musicPlaying}
          >
            {musicPlaying ? "🔊 Music On" : "🔇 Tap to Play Music"}
          </button>
        </section>

        <div className="mt-3 text-center text-sm">
          {audioReady ? (
            <span className="text-green-600">Audio siap — tekan tombol untuk memulai</span>
          ) : (
            <span className="text-red-500">Audio belum diinisialisasi — tekan 'Enable Audio' di layar</span>
          )}
        </div>

        {/* --- Collapsible Our Story --- */}
        <article className="bg-white rounded-2xl p-4 mt-4 shadow-md">
          <h2 className="text-base font-bold mb-2">Our Story</h2>

          <div className="text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
            <div
              style={{
                overflow: "hidden",
                transition: "max-height 350ms ease",
                maxHeight: showFullStory ? "1000px" : "120px",
              }}
              aria-expanded={showFullStory}
            >
              {OUR_STORY}
            </div>

            {!showFullStory && (
              <div
                aria-hidden="true"
                style={{
                  marginTop: -24,
                  height: 24,
                  background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setShowFullStory((s) => !s)}
              className="text-sm px-3 py-2 rounded-lg bg-pink-100 text-pink-700 font-medium active:scale-95"
            >
              {showFullStory ? "Tutup" : "Baca selengkapnya"}
            </button>
            <span className="text-xs text-gray-400">— ketuk untuk baca penuh</span>
          </div>
        </article>

        <section className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Gallery Kenangan</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">foto1</span>
            </div>
            <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">foto2</span>
            </div>
            <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">foto3</span>
            </div>
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

        <footer className="mt-6 text-xs text-gray-500 text-center">
          © 2025 Chris & Ita — Made with pixels & love
        </footer>
      </main>

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
            <p style={{ marginBottom: 12, fontSize: 13, opacity: 0.95 }}>
              Tekan sekali tombol di bawah untuk mengizinkan pemutaran musik. Jangan panik, ini cuma izin sementara.
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
