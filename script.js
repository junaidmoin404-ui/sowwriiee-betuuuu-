const screens = {
  opening: document.getElementById("screen-opening"),
  letter: document.getElementById("screen-letter"),
  photos: document.getElementById("screen-photos"),
  ending: document.getElementById("screen-ending")
};

const modal = document.getElementById("forgive-modal");

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });

  screens[name].classList.add("active");

  if (name === "photos") {
    startPhotoExperience();
  }

  if (name === "ending") {
    makeMatrix();
  }
}

/* Opening → Letter */
document
  .querySelector('#screen-opening [data-next="letter"]')
  .addEventListener("click", () => {
    showScreen("letter");
  });

/* Letter → Popup */
document.getElementById("forgive-open").addEventListener("click", () => {
  modal.classList.add("show");
});

/* Popup → Photos */
modal.querySelectorAll('[data-next="photos"]').forEach(button => {
  button.addEventListener("click", () => {
    modal.classList.remove("show");
    showScreen("photos");
  });
});

/* Close popup by clicking outside */
modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});


/* =========================
   PHOTOS
========================= */

const photos = [
  "photos/photo1.jpg",
  "photos/photo2.jpg",
  "photos/photo3.jpg",
  "photos/photo4.jpg",
  "photos/photo5.jpg"
];

const img = document.getElementById("slide-image");
const dots = document.getElementById("photo-dots");

let slideIndex = 0;
let slideTimer = null;

photos.forEach((_, index) => {
  const dot = document.createElement("i");

  if (index === 0) {
    dot.classList.add("on");
  }

  dots.appendChild(dot);
});

function renderSlide(index) {
  img.classList.add("fade");

  setTimeout(() => {
    img.src = photos[index];

    img.onload = () => {
      img.classList.remove("fade");
    };

    document
      .querySelectorAll(".photo-dots i")
      .forEach((dot, i) => {
        dot.classList.toggle("on", i === index);
      });

  }, 300);
}

function startPhotoExperience() {

  if (slideTimer) {
    return;
  }

  slideTimer = setInterval(() => {

    slideIndex = (slideIndex + 1) % photos.length;

    renderSlide(slideIndex);

  }, 4500);
}


/* =========================
   MUSIC
========================= */

const audio = document.getElementById("song");
const playButton = document.getElementById("play-song");
const status = document.getElementById("music-status");

const START = 137; // 2:17
const END = 177;   // 2:57

let audioTimer = null;


/* Play only 2:17 → 2:57 */

function playFrom137() {

  clearTimeout(audioTimer);

  audio.pause();

  audio.currentTime = START;

  status.textContent =
    "🎵 Playing our little moment...";

  playButton.textContent =
    "Playing 💗";

  audio.play().catch(() => {

    status.textContent =
      "🎵 Tap Play Song to start";

    playButton.textContent =
      "Play Song 💗";

  });

  audioTimer = setTimeout(() => {

    audio.pause();

    audio.currentTime = END;

    playButton.style.display = "none";

    status.textContent =
      "💗 Our little song is finished";

    showScreen("ending");

  }, (END - START) * 1000);
}


playButton.addEventListener(
  "click",
  playFrom137
);


/* Safety: stop exactly at 2:57 */

audio.addEventListener("timeupdate", () => {

  if (audio.currentTime >= END) {

    audio.pause();

    audio.currentTime = END;

    clearTimeout(audioTimer);

    playButton.style.display = "none";

    status.textContent =
      "💗 Our little song is finished";

    showScreen("ending");
  }

});


/* Audio missing/error */

audio.addEventListener("error", () => {

  status.textContent =
    "🎵 Add your audio as song.mp3";

  playButton.textContent =
    "Play Song 💗";

});


/* =========================
   FINAL MATRIX
========================= */

function makeMatrix() {

  const matrix =
    document.getElementById("matrix");

  matrix.innerHTML = "";

  const count =
    Math.max(
      9,
      Math.floor(window.innerWidth / 70)
    );

  for (let i = 0; i < count; i++) {

    const column =
      document.createElement("div");

    column.className =
      "matrix-column";

    column.style.left =
      `${(i / count) * 100 + Math.random() * 4}%`;

    column.style.animationDuration =
      `${6 + Math.random() * 8}s`;

    column.style.animationDelay =
      `${-Math.random() * 8}s`;

    for (let j = 0; j < 14; j++) {

      const span =
        document.createElement("span");

      const random =
        Math.random();

      if (random < 0.55) {
        span.textContent = "I LOVE YOU";
      } else if (random < 0.78) {
        span.textContent = "♥";
      } else if (random < 0.9) {
        span.textContent = "♡";
      } else {
        span.textContent = "🤍";
      }

      column.appendChild(span);
    }

    matrix.appendChild(column);
  }
}


/* Rebuild Matrix on resize */

window.addEventListener("resize", () => {

  if (
    screens.ending.classList.contains("active")
  ) {
    makeMatrix();
  }

});
