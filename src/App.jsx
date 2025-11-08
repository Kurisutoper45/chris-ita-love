import React from "react";
import SiteAudio from "./components/SiteAudio";
import Day1Video from "./components/Day1Video";

export default function App() {
  return (
    <div
      style={{
        fontFamily: "'Pixelify Sans', sans-serif",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#fff6f9",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "18px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginBottom: 4 }}>💞 Chris & Ita</h2>
        <p style={{ fontSize: 14, color: "#666" }}>
          Our Story — pixel edition
        </p>
      </div>

      {/* Tombol musik */}
      <SiteAudio src="/music.mp3" />

      {/* Our Story */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "16px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          marginBottom: 25,
        }}
      >
        <h3>Our Story</h3>
        <p style={{ fontSize: 14, color: "#444" }}>
          Kadang semesta punya cara yang aneh tapi indah buat mempertemukan dua
          orang. Nggak direncanain, nggak disengaja, cuma kebetulan yang ternyata
          berarti besar. Waktu, tempat, dan rasa — semuanya kayak udah disusun rapi
          dari awal. Dan akhirnya, dua hati yang nggak saling cari... ketemu juga. 💖
        </p>
      </div>

      {/* Gallery */}
      <div>
        <h3 style={{ marginBottom: 10 }}>Gallery Kenangan</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <img
            src="/foto1.jpg"
            alt="foto1"
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              objectFit: "cover",
              background: "#eee",
            }}
          />
          <img
            src="/foto2.jpg"
            alt="foto2"
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              objectFit: "cover",
              background: "#eee",
            }}
          />
          <img
            src="/foto3.jpg"
            alt="foto3"
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              objectFit: "cover",
              background: "#eee",
            }}
          />
        </div>
      </div>

      {/* Video Day 1 Pacaran */}
      <Day1Video src="/day1.mp4" caption="Momen Day 1 Pacaran" />

      {/* Kritik, saran, dan doa */}
      <div
        style={{
          background: "#fff",
          marginTop: 20,
          padding: "14px",
          borderRadius: 12,
          boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3>Kritik, Saran & Doa 💌</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          Semoga hubungan ini nggak cuma bertahan, tapi terus berkembang.  
          Belajar, tumbuh, dan saling ngerti satu sama lain.  
          Kalau ada kritik atau saran, sampaikan aja lewat hati. 😆
        </p>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: 30,
          fontSize: 12,
          color: "#777",
        }}
      >
        © 2025 Chris & Ita — Made with pixels & love
      </footer>
    </div>
  );
}
