const screens = {
  opening: document.getElementById("screen-opening"),
  letter: document.getElementById("screen-letter"),
  photos: document.getElementById("screen-photos"),
  ending: document.getElementById("screen-ending")
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  if(name === "photos") startPhotoExperience();
  if(name === "ending") makeMatrix();
}

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click", ()=>showScreen(btn.dataset.next));
});

const modal = document.getElementById("forgive-modal");
document.getElementById("forgive-open").addEventListener("click", ()=>{
  modal.classList.add("show");
});
modal.addEventListener("click", e=>{
  if(e.target === modal) modal.classList.remove("show");
});

const photos = ["photos/photo1.jpg","photos/photo2.jpg","photos/photo3.jpg"];
const img = document.getElementById("slide-image");
const dots = document.getElementById("photo-dots");
let slideIndex = 0;
let slideTimer = null;

photos.forEach((_,i)=>{
  const dot = document.createElement("i");
  if(i===0) dot.classList.add("on");
  dots.appendChild(dot);
});

function renderSlide(index){
  img.classList.add("fade");
  setTimeout(()=>{
    img.src = photos[index];
    img.onload = ()=>img.classList.remove("fade");
    document.querySelectorAll(".photo-dots i").forEach((d,i)=>d.classList.toggle("on",i===index));
  },300);
}

function startPhotoExperience(){
  if(slideTimer) return;
  slideTimer = setInterval(()=>{
    slideIndex = (slideIndex + 1) % photos.length;
    renderSlide(slideIndex);
  },4500);
}

const audio = document.getElementById("song");
const playButton = document.getElementById("play-song");
const status = document.getElementById("music-status");
const START = 137;
const END = 177;
let audioStarted = false;
let audioTimer = null;

audio.addEventListener("timeupdate", ()=>{
  if(audio.currentTime >= END){
    audio.pause();
    audio.currentTime = END;
    clearTimeout(audioTimer);
    audioTimer = null;
    status.textContent = "💗 Our little song is finished";
    playButton.style.display = "none";
    setTimeout(()=>showScreen("ending"),450);
  }
});

function playFrom137(){
  audio.pause();
  audio.currentTime = START;
  audioStarted = true;
  status.textContent = "🎵 Playing our little moment...";
  playButton.textContent = "Playing 💗";
  audio.play().catch(()=>{
    status.textContent = "🎵 Tap Play Song to start";
    playButton.textContent = "Play Song 💗";
  });
  clearTimeout(audioTimer);
  audioTimer = setTimeout(()=>{
    audio.pause();
    audio.currentTime = END;
    showScreen("ending");
  }, (END-START)*1000 + 300);
}

playButton.addEventListener("click", playFrom137);

audio.addEventListener("error", ()=>{
  status.textContent = "🎵 Add your audio as song.mp3";
  playButton.textContent = "Play Song 💗";
});

function makeMatrix(){
  const matrix = document.getElementById("matrix");
  matrix.innerHTML = "";
  const count = Math.max(9, Math.floor(window.innerWidth / 70));
  for(let i=0;i<count;i++){
    const col = document.createElement("div");
    col.className = "matrix-column";
    col.style.left = `${(i/count)*100 + Math.random()*4}%`;
    col.style.animationDuration = `${6 + Math.random()*8}s`;
    col.style.animationDelay = `${-Math.random()*8}s`;
    for(let j=0;j<14;j++){
      const span = document.createElement("span");
      const r = Math.random();
      span.textContent = r < .55 ? "I LOVE YOU" : (r < .78 ? "♥" : (r < .9 ? "♡" : "🤍"));
      col.appendChild(span);
    }
    matrix.appendChild(col);
  }
}

window.addEventListener("resize", ()=>{
  if(screens.ending.classList.contains("active")) makeMatrix();
});
