import React, { useEffect, useState } from "react";

/*
  Guestbook:
  - Menyimpan pesan ke localStorage
  - Optional: dapat mengirim ke Formspree jika formEndpoint diset
  - Simple, mobile-friendly
*/

export default function Guestbook({ formEndpoint = "", fallbackLocal = true, onSaved = null }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("guestbook_messages");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveLocal = (entry) => {
    const next = [entry, ...items].slice(0, 200);
    setItems(next);
    localStorage.setItem("guestbook_messages", JSON.stringify(next));
    if (typeof onSaved === "function") onSaved(entry);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return alert("Isi nama dan pesan dulu ya.");

    const entry = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    };

    setSending(true);
    try {
      if (formEndpoint) {
        const payload = new FormData();
        payload.append("name", entry.name);
        payload.append("message", entry.message);
        payload.append("_subject", "Kritik/Saran/Doa - Chris & Ita");
        const res = await fetch(formEndpoint, { method: "POST", body: payload });
        if (!res.ok) throw new Error("Formspree error");
      }

      if (fallbackLocal) saveLocal(entry);
      setName("");
      setMessage("");
      alert("Makasih! Pesanmu telah tersimpan. ❤️");
    } catch (err) {
      console.error(err);
      alert("Gagal kirim. Pesan disimpan di device kamu saja.");
      if (fallbackLocal) saveLocal(entry);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow">
      <h4 className="font-semibold mb-2">Kritik · Saran · Doa</h4>

      <form onSubmit={handleSubmit} className="mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder="Namamu (atau anonymous)"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          rows={3}
          placeholder="Tulis kritik, saran, atau doa untuk kami..."
        />
        <div className="flex gap-2">
          <button type="submit" disabled={sending} className="px-3 py-2 bg-pink-500 text-white rounded">
            {sending ? "Mengirim..." : "Kirim Pesan"}
          </button>
          <button type="button" onClick={() => { setName(""); setMessage(""); }} className="px-3 py-2 bg-gray-200 rounded">Batal</button>
        </div>
      </form>

      <div className="text-xs text-gray-500 mb-2">Pesan terbaru</div>
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {items.length === 0 ? (
          <div className="text-xs text-gray-400">Belum ada pesan — jadi yang pertama!</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div className="text-sm font-medium">{it.name} <span className="text-xs text-gray-400">• {new Date(it.date).toLocaleString()}</span></div>
              <div className="text-sm">{it.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
