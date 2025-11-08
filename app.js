// app.js - pixel edition interactions
const audio = document.getElementById('siteAudio');
const musicBtn = document.getElementById('musicBtn');
const video = document.getElementById('day1video');
const readBtn = document.getElementById('readMore');
const storyFull = document.getElementById('storyFull');
const form = document.getElementById('feedbackForm');
const formStatus = document.getElementById('formStatus');

// Placeholder: set your Google Apps Script endpoint here to enable saving to Google Sheets
const SHEET_ENDPOINT = ''; // <-- paste endpoint URL here after deployment

// music toggle
musicBtn.addEventListener('click', async ()=>{
  try{
    if(audio.paused){ await audio.play(); musicBtn.textContent='🔊 Music On'; }
    else { audio.pause(); musicBtn.textContent='▶️ Tap to Play Music'; }
  }catch(e){
    alert('Browser memblokir autoplay. Tekan tombol sekali lagi.');
  }
});

// when video plays -> pause music (safe mode)
if(video){
  video.addEventListener('play', ()=>{
    if(!audio.paused) audio.pause();
  });
  video.addEventListener('pause', ()=>{ audio.play().catch(()=>{}); });
  video.addEventListener('ended', ()=>{ audio.play().catch(()=>{}); });
}

// read more
if(readBtn){
  readBtn.addEventListener('click', ()=>{
    storyFull.classList.toggle('hidden');
    readBtn.textContent = storyFull.classList.contains('hidden') ? 'Baca selengkapnya' : 'Sembunyikan';
  });
}

// feedback -> send to Google Sheets via endpoint (if set), else show local message
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('nameField').value || 'Anon';
  const message = document.getElementById('msgField').value || '';
  if(!message.trim()){ formStatus.textContent = 'Tulis pesannya dulu.'; return; }
  if(!SHEET_ENDPOINT){ formStatus.textContent = '(Belum terkoneksi: paste Apps Script URL di app.js)'; return; }
  try{
    const res = await fetch(SHEET_ENDPOINT, { method: 'POST', body: JSON.stringify({ name, message }) });
    const j = await res.json();
    if(j.status === 'success'){ formStatus.textContent = 'Terkirim — makasih!'; form.reset(); }
    else formStatus.textContent = 'Gagal kirim.';
  }catch(err){ formStatus.textContent = 'Error saat kirim.'; console.error(err); }
});
