const screens = {
  opening: document.getElementById("screen-opening"),
  letter: document.getElementById("screen-letter"),
  photos: document.getElementById("screen-photos"),
  ending: document.getElementById("screen-ending")
};

const modal = document.getElementById("forgive-modal");

/* =========================
   SCREEN CONTROL
========================= */

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });

  if (screens[name]) {
    screens[name].classList.add("active");
  }

  if (name === "photos") {
    startPhotoExperience();
  }

  if (name === "ending") {
    makeMatrix();
  }
}


/* =========================
   OPENING → LETTER
========================= */

const openingButton =
  document.querySelector('#screen-opening [data-next="letter"]');

if (openingButton) {
  openingButton.addEventListener("click", () => {
    showScreen("letter");
  });
}


/* =========================
   LETTER → POPUP
========================= */

const forgiveButton =
  document.getElementById("forgive-open");

if (forgiveButton) {
  forgiveButton.addEventListener("click", () => {
    modal.classList.add("show");
  });
}


/* =========================
   POPUP → PHOTOS
========================= */

const photoButtons =
  modal.querySelectorAll('[data-next="photos"]');

photoButtons.forEach(button => {
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

const img =
  document.getElementById("slide-image");

const dots =
  document.getElementById("photo-dots");

let slideIndex = 0;
let slideTimer = null;


/* Create dots */

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
        dot.classList.toggle(
          "on",
          i === index
        );
      });

  }, 300);
}


function startPhotoExperience() {

  /* Show first photo immediately */

  img.src = photos[0];

  /* Don't create multiple timers */

  if (slideTimer) {
    return;
  }

  slideTimer = setInterval(() => {

    slideIndex =
      (slideIndex + 1) % photos.length;

    renderSlide(slideIndex);

  }, 4500);
}


/* =========================
   MUSIC
========================= */

const audio =
  document.getElementById("song");

const playButton =
  document.getElementById("play-song");

const status =
  document.getElementById("music-status");


/*
  2:17 = 137 seconds
  2:57 = 177 seconds
*/

const START = 137;
const END = 177;

let audioTimer = null;


/* Play ONLY 2:17 → 2:57 */

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


  /*
    Backup timer:
    40 seconds = 2:17 → 2:57
  */

  audioTimer = setTimeout(() => {

    finishSong();

  }, (END - START) * 1000);

}


/* Stop exactly at 2:57 */

audio.addEventListener("timeupdate", () => {

  if (audio.currentTime >= END) {

    finishSong();

  }

});


function finishSong() {

  clearTimeout(audioTimer);

  audioTimer = null;

  audio.pause();

  audio.currentTime = END;

  playButton.style.display = "none";

  status.textContent =
    "💗 Our little song is finished";

  /*
    Small pause before final Matrix screen
  */

  setTimeout(() => {

    showScreen("ending");

  }, 500);

}


/* Play button */

playButton.addEventListener(
  "click",
  playFrom137
);


/* Audio error */

audio.addEventListener("error", () => {

  status.textContent =
    "🎵 Add your audio as song.mp3";

  playButton.textContent =
    "Play Song 💗";

});


/* =========================
   MATRIX ENDING
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

        span.textContent =
          "I LOVE YOU";

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
