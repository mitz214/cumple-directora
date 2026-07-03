const openBtn = document.getElementById("openBtn");
const hero = document.getElementById("hero");
const content = document.getElementById("content");

const musicIntro = document.getElementById("musicIntro");
const musicBook = document.getElementById("musicBook");
const musicBtn = document.getElementById("musicBtn");

document.addEventListener("DOMContentLoaded", () => {
  musicIntro.volume = 0.45;

  musicIntro.play().catch(() => {
    document.body.addEventListener("click", () => {
      if (!playing) {
        playMusic(musicIntro);
      }
    }, { once: true });
  });
});

const bookFlash = document.getElementById("bookFlash");

let currentMusic = null;
let playing = false;

openBtn.addEventListener("click", () => {
  hero.style.display = "none";
  content.classList.remove("hidden");
  startConfetti();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* Música */
function playMusic(audio) {
  if (!audio) return;

  if (currentMusic && currentMusic !== audio) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }

  currentMusic = audio;
  currentMusic.volume = 0.55;
  currentMusic.play();

  playing = true;
  if (musicBtn) musicBtn.textContent = "⏸ Pausar música";
}

function pauseMusic() {
  if (currentMusic) {
    currentMusic.pause();
  }

  playing = false;
  if (musicBtn) musicBtn.textContent = "▶ Reproducir música";
}

function switchMusic(fromAudio, toAudio) {
  if (!fromAudio || !toAudio) return;

  let fadeOut = setInterval(() => {
    if (fromAudio.volume > 0.05) {
      fromAudio.volume = Math.max(0, fromAudio.volume - 0.05);
    } else {
      clearInterval(fadeOut);

      fromAudio.pause();
      fromAudio.currentTime = 0;

      toAudio.volume = 0;
      toAudio.play();
      currentMusic = toAudio;
      playing = true;
      if (musicBtn) musicBtn.textContent = "⏸ Pausar música";

      let fadeIn = setInterval(() => {
        if (toAudio.volume < 0.55) {
          toAudio.volume = Math.min(0.55, toAudio.volume + 0.05);
        } else {
          clearInterval(fadeIn);
          toAudio.volume = 0.55;
        }
      }, 80);
    }
  }, 80);
}

musicBtn.addEventListener("click", () => {
  if (!playing) {
    playMusic(currentMusic || musicIntro);
  } else {
    pauseMusic();
  }
});

/* Canvas */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let pieces = [];
let petals = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Confetti */
function createConfetti() {
  pieces = [];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      color: randomColor()
    });
  }
}

function randomColor() {
  const colors = ["#c8932b", "#f1c96b", "#F4EC0B", "#8d2f99", "#ac46a1", "#ffffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach(piece => {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation * Math.PI / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
    ctx.restore();

    piece.y += piece.speed;
    piece.rotation += 4;

    if (piece.y > canvas.height) {
      piece.y = -10;
      piece.x = Math.random() * canvas.width;
    }
  });

  animationId = requestAnimationFrame(drawConfetti);
}

function startConfetti() {
  createConfetti();
  drawConfetti();

  setTimeout(() => {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 6500);
}

/* Pétalos suaves */
const petalsCanvas = document.createElement("canvas");
petalsCanvas.id = "petals";
document.body.appendChild(petalsCanvas);

const petalsCtx = petalsCanvas.getContext("2d");

function resizePetalsCanvas() {
  petalsCanvas.width = window.innerWidth;
  petalsCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizePetalsCanvas);
resizePetalsCanvas();

function createPetals() {
  petals = [];

  for (let i = 0; i < 28; i++) {
    petals.push({
      x: Math.random() * petalsCanvas.width,
      y: Math.random() * petalsCanvas.height,
      size: Math.random() * 9 + 7,
      speed: Math.random() * 0.8 + 0.35,
      sway: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.35 + 0.35
    });
  }
}

function drawPetals() {
  petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

  petals.forEach(petal => {
    petalsCtx.save();
    petalsCtx.globalAlpha = petal.opacity;
    petalsCtx.translate(petal.x, petal.y);
    petalsCtx.rotate(petal.angle);

    petalsCtx.fillStyle = "#f7a8d8";
    petalsCtx.beginPath();
    petalsCtx.ellipse(0, 0, petal.size * 0.65, petal.size, 0, 0, Math.PI * 2);
    petalsCtx.fill();

    petalsCtx.restore();

    petal.y += petal.speed;
    petal.x += Math.sin(petal.angle) * petal.sway;
    petal.angle += 0.01;

    if (petal.y > petalsCanvas.height + 20) {
      petal.y = -20;
      petal.x = Math.random() * petalsCanvas.width;
    }
  });

  requestAnimationFrame(drawPetals);
}

createPetals();
drawPetals();

/* Esto lo usaremos cuando agreguemos el libro */
function activateBookMusic() {
  switchMusic(musicIntro, musicBook);
}

const bookSection = document.getElementById("bookSection");
const startBookBtn = document.getElementById("startBookBtn");
const bookCover = document.getElementById("bookCover");
const bookContent = document.getElementById("bookContent");
const bookPage = document.getElementById("bookPage");
const bookControls = document.getElementById("bookControls");
const realBook = document.getElementById("realBook");

const bookName = document.getElementById("bookName");
const bookMessage = document.getElementById("bookMessage");
const bookSignature = document.getElementById("bookSignature");
const bookCounter = document.getElementById("bookCounter");

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");

const wishes = [
  {
  name: "Subse Eli",
  message: "Querida Liliana:\n\nDeseo que en este día tan especial todos tus anhelos y sueños se hagan realidad. Que la alegría siempre esté a tu lado y que sigas disfrutando cada instante, cada día y cada año que, de corazón, espero que sean muchísimos más.\n\nQue disfrutes mucho este cumpleaños, que te festejen en familia y que lo pases de lo mejor. ¡Te quiero mucho! ¡Feliz cumpleaños!",
  signature: "Con cariño,\nSubse Eli"
  },
  {
    name: "Betty",
    message: "¡Liliana, muchas felicidades!\n\nEn este nuevo año de vida que comienzas, deseo que estés rodeada de bendiciones, del amor de tu familia y de todas las personas que te quieren. Que disfrutes de mucha salud... ¡y salud! 😉😊🍻🍷🍹\n\n¡Feliz cumpleaños! 🎊🎂 Que este día esté lleno de alegría, abrazos y momentos inolvidables.",
    signature: "Con cariño,\nBetty"
  },
  {
    name: "Claudia",
    message: "¡Queridísima, Direc! En este día tan especial, le agradecemos todos los esfuerzos que hace por cada una de nosotras, por guiarnos con el ejemplo y por mostrarnos siempre lo mejor de usted: su carisma, su bondad y su gran corazón. ¡Muchísimas felicidades!\n\nMi deseo más grande en este día es que siempre conserve esa hermosa sonrisa y ese amor con el que nos enseña a ser mejores personas. ¡Feliz cumpleaños! La queremos muchísimo y esperamos que tenga un día lleno de alegría, amor y muchas bendiciones.",
    signature: "Con cariño,\nClaudia"
  },
  {
    name: "Dianela",
    message: "¡Direc! Que hoy y siempre su vida esté llena de dicha y de muchas alegrías. Le deseo un muy feliz cumpleaños, que disfrute muchísimo este día y que todo el cariño que nos brinda día a día regrese multiplicado a usted y a todos sus seres queridos. ¡Le mando un fuerte, fuerte abrazo! ¡Muchas felicidades!",
    signature: "Con cariño,\nDianela"
  },
  {
    name: "Yalti",
    message: "¡Feliz, feliz cumpleaños! Espero que disfrute mucho de este día tan especial, que tenga una hermosa celebración rodeada del amor de su familia y de sus seres queridos. Mis mejores deseos para usted; espero que siga recibiendo muchas bendiciones hoy y siempre. ¡Le mando un abrazote!",
    signature: "Con cariño,\nYalti"
  },
  {
    name: "Jimena",
    message: "Que esta vuelta al sol esté colmada de bendiciones, salud y amor. Que en este día sea muy consentida y lo disfrute rodeada de las personas que ama. Muchas gracias por sus enseñanzas y, sobre todo, por mostrarnos siempre su lado más humano, empático y amable. Que la vida siempre la llene de motivos para sonreír. ¡Feliz cumpleaños!",
    signature: "Con cariño,\nJimena"
  },
  {
    name: "Nicte",
    message: "Estimada Directora: ¡Feliz cumpleaños! Deseo de todo corazón que este nuevo año de su vida esté lleno de salud, amor, aprendizajes y experiencias enriquecedoras, que le permitan seguir conservando esa energía tan bonita que la caracteriza. Agradezco su confianza y cariño, y espero que podamos seguir compartiendo muchos momentos más.",
    signature: "Con cariño,\nNicte"
  },
  {
    name: "Blanquita",
    message: "🎶 ¡En un día feliz una niña nació que se llama Liliana, y que sea muy feliz! 🎶\n\n¡Feliz cumpleaños! Deseo que disfrute de este día tan especial en compañía de su familia y de todas las personas que la apreciamos. Que este nuevo año de vida esté lleno de bendiciones, logros y éxitos para usted.\n\nAgradezco y valoro mucho el apoyo que siempre nos brinda. ¡Pásela muy bonito y reciba un fuerte abrazo!",
    signature: "Con cariño,\nBlanquita"
  },
  {
    name: "Reyna",
    message: "¡Muchas felicidades, Directora!\n\nQue este nuevo año de vida le traiga mucha salud, grandes momentos, éxito, energía positiva y todo lo bueno que se merece por ser una gran líder.\n\nGracias por su confianza, su apoyo y por ser una mentora excepcional. Se ha ganado nuestro cariño y afecto. ¡La queremos mucho! ❤️\n\n¡Feliz cumpleaños!",
    signature: "Con cariño,\nReyna"
  },
  {
    name: "Jess",
    message: "Quiero desearle mucha salud, éxito y bienestar en este nuevo año que comienza. Le agradezco sinceramente su empatía y el apoyo que siempre nos brinda. Contar con una gestión tan comprensiva e involucrada con el equipo hace una gran diferencia en el día a día. Que tenga un muy feliz cumpleaños",
    signature: "Con cariño,\nJess"
  },
  {
    name: "Fabián",
    message: "¡Directora, muchas felicidades en este día tan especial para usted!\n\nTal vez mi mensaje suene un poco repetitivo, pero quería agradecerle por darme la oportunidad de formar parte de este gran equipo. Al principio tenía miedo de no encajar, porque era mi primer trabajo formal y tampoco sabía cómo relacionarme con mis compañeras. Sin embargo, gracias a usted hoy me siento parte de una gran familia.\n\nYa llevo un año aquí y puedo decir con toda seguridad que el corazón de este gran equipo es usted. Le deseo muchas bendiciones a usted y a toda su familia. Que este nuevo año de vida esté lleno de salud, alegría y muchos momentos felices.\n\n¡Muchas felicidades, Directora! Que cumpla muchísimos años más. ^^",
    signature: "Con cariño,\nFabián"
  },
  {
    name: "Eduardo",
    message: "¡Direc, muchas felicidades!\n\nQuiero agradecerle de todo corazón por haberme recibido y hacerme sentir parte de esta gran familia. Estoy muy agradecido por todo lo que ha hecho por mí. La quiero mucho y le agradezco que siempre se preocupe por todos nosotros. Usted es una persona maravillosa, con un gran corazón, y su apoyo ha significado mucho para mí.\n\nMuchas gracias por todo. Le deseo un día lleno de alegría, salud y muchas bendiciones. ¡Feliz cumpleaños!",
    signature: "Con cariño,\nEduardo"
  },
  {
    name: "Jenny Salazar",
    message: "¡Feliz, feliz cumpleaños, Direc!\n\nDeseo que tenga un excelente cumpleaños, que se divierta muchísimo, que la apapachen un montón y que siempre conserve ese ánimo tan bonito con el que la conocemos. Gracias por la confianza y las atenciones que nos ha brindado a todas y todos. ¡Le mando un abrazo enorme!",
    signature: "Con cariño,\nJenny Salazar"
  },
  {
    name: "Jenni Ávila",
    message: "¡Feliz cumpleaños! Deseo de todo corazón que este nuevo año de vida esté lleno de prosperidad, salud y paz. Aunque como Dirección no siempre hemos tenido un camino fácil, quiero agradecerle el apoyo que siempre nos brinda, tanto en el ámbito laboral como en el personal.\n\nEspero que su familia la consienta muchísimo en este día tan especial. Ha sido un verdadero placer conocerla y convivir con usted. Le mando un fuerte abrazo y le deseo un cumpleaños lleno de alegría y muchas bendiciones.",
    signature: "Con cariño,\nJenni Avila"
  },
];

let currentWish = 0;
let bookMusicActivated = false;

function renderWish(index) {
  const wish = wishes[index];

  bookName.textContent = wish.name;
  bookMessage.textContent = wish.message;
  bookSignature.innerHTML = wish.signature.replace("\n", "<br>");
  bookCounter.textContent = `${index + 1} / ${wishes.length}`;

  prevPageBtn.disabled = index === 0;
  nextPageBtn.textContent = index === wishes.length - 1 ? "Cerrar libro" : "Siguiente →";
}

function animatePageChange(callback, direction = "next") {
  const animationClass = direction === "prev" ? "page-prev" : "page-next";

  bookContent.classList.remove("page-next", "page-prev");
  void bookContent.offsetWidth;

  bookContent.classList.add(animationClass);

  setTimeout(() => {
    callback();
  }, 260);

  setTimeout(() => {
    bookContent.classList.remove(animationClass);
  }, 560);
}

startBookBtn.addEventListener("click", () => {
  realBook.classList.add("opening");

  setTimeout(() => {
    bookFlash.classList.add("active");
    document.body.classList.add("book-mode");
  }, 650);

  setTimeout(() => {
    realBook.classList.remove("opening");
    realBook.classList.add("open");

    bookContent.classList.remove("hidden");
    bookControls.classList.remove("hidden");

    currentWish = 0;
    renderWish(currentWish);

    if (!bookMusicActivated) {
      activateBookMusic();
      bookMusicActivated = true;
    }
  }, 950);

  setTimeout(() => {
    bookFlash.classList.remove("active");
  }, 1500);
});

prevPageBtn.addEventListener("click", () => {
  if (currentWish <= 0) return;

  animatePageChange(() => {
  currentWish--;
  renderWish(currentWish);
}, "prev");
});

nextPageBtn.addEventListener("click", () => {
  if (currentWish >= wishes.length - 1) {
    bookContent.classList.add("flipping");

    setTimeout(() => {
      bookContent.innerHTML = `
        <div class="book-last-page">
          <p class="book-label">Gracias por leer estas páginas</p>

          <img
            class="director-photo"
            src="https://lh3.googleusercontent.com/d/1zDtyFBsd1vIu2MDMmiD_0zDAy-jCyJI2"
            alt="Directora">

          <h3>¡Feliz cumpleaños!</h3>

          <div class="book-divider">♡</div>

          <p id="bookMessage">
            Esperamos que este pequeño detalle le haya sacado una sonrisa.
          </p>

          <p class="book-signature">
            Con mucho cariño,<br>
            Su querido equipo de Planeación
          </p>
        </div>
      `;

      bookControls.classList.add("hidden");
      startConfetti();
    }, 330);

    setTimeout(() => {
      bookContent.classList.remove("flipping");
    }, 760);

    return;
  }

  animatePageChange(() => {
    currentWish++;
    renderWish(currentWish);
  }, "next");
});

const bookObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !bookMusicActivated && playing) {
      activateBookMusic();
      bookMusicActivated = true;
    }
  });
}, {
  threshold: 0.45
});
bookObserver.observe(bookSection);

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeImageModal = document.getElementById("closeImageModal");

document.querySelectorAll(".polaroid img").forEach(img => {
  img.addEventListener("click", () => {
    modalImage.src = img.src;
    imageModal.classList.remove("hidden");
  });
});

closeImageModal.addEventListener("click", () => {
  imageModal.classList.add("hidden");
  modalImage.src = "";
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    imageModal.classList.add("hidden");
    modalImage.src = "";
  }
});
