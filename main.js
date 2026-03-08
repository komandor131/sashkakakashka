const slides = [
  {
    src: "./images/img1.jpg",
    caption: "Желаю шоб ти всєгда була такой сімпатічной как грінч",
  },
  {
    src: "./images/img2.jpg",
    caption: "Шоб твої слова для інших були як молітва від ісуса",
  },
  {
    src: "./images/img3.jpg",
    caption: "Шоб в цьому житті найчастіше чому ти пригаєш це від щастя",
  },
  {
    src: "./images/img4.jpg",
    caption: "Шоб всєгда палучалісь красівиє фотачкі",
  },
  {
    src: "./images/img5.jpg",
    caption:
      "Шоб ти була брутальнай,харізматічнай і вайбовай як цей прекрасний мужчіна с барадой",
  },
  {
    src: "./images/img6.jpg",
    caption:
      "Шоб тобі ненада було нічого чініть как бєдному сломаному бонні, бо ти ідєал",
  },
  {
    src: "./images/img7.jpg",
    caption:
      "Шоб в цьому житті коли ти колядуєш всі хто дають тобі гроші були олігархамі",
  },
  {
    src: "./images/img8.jpg",
    caption: "Улибаємся почащє я дєлал це з усього шо нашов",
  },
];

const photoFrame = document.getElementById("photoFrame");
const slideImage = document.getElementById("slideImage");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

const messageModal = document.getElementById("messageModal");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");
const modalNextBtn = document.getElementById("modalNextBtn");
const reactionButtons = Array.from(document.querySelectorAll(".reaction-btn"));

const card = document.getElementById("card");
const flash = document.getElementById("flash");
const confettiLayer = document.getElementById("confetti-layer");
const reactionLayer = document.getElementById("reaction-layer");
const finale = document.getElementById("finale");
const finaleInner = document.getElementById("finaleInner");

let currentIndex = 0;
let isFinished = false;
let isModalOpen = false;
let selectedReaction = "like";
let sparkleTimer = null;

const reactionPresets = {
  like: { symbol: "👍", mode: "rain" },
  dislike: { symbol: "👎", mode: "rain" },
  poop: { symbol: "💩", mode: "rain" },
  boom: { symbol: "💥", mode: "blast" },
};

function currentSlide() {
  return slides[currentIndex];
}

function updateButtonLabel() {
  nextBtn.textContent = isModalOpen ? "Следующее фото" : "Открыть поздравление";
}

function updateProgress() {
  progress.textContent = `${currentIndex + 1} / ${slides.length}`;
}

function pulseFrame() {
  photoFrame.classList.remove("clicked");
  void photoFrame.offsetWidth;
  photoFrame.classList.add("clicked");
}

function closeMessageModal() {
  messageModal.classList.remove("show");
  messageModal.setAttribute("aria-hidden", "true");
  isModalOpen = false;
  updateButtonLabel();
}

function openMessageModal() {
  if (isFinished) {
    return;
  }

  modalText.textContent = currentSlide().caption;
  messageModal.classList.add("show");
  messageModal.setAttribute("aria-hidden", "false");
  isModalOpen = true;
  updateButtonLabel();
  triggerReactionEffect();
}

function renderSlide() {
  const slide = currentSlide();
  slideImage.src = slide.src;
  slideImage.alt = `Фото ${currentIndex + 1}`;
  updateProgress();
  reactionLayer.innerHTML = "";
  closeMessageModal();
}

function setReaction(reaction, withEffect = true) {
  if (!reactionPresets[reaction]) {
    return;
  }

  selectedReaction = reaction;
  reactionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.reaction === reaction);
  });

  if (withEffect && isModalOpen) {
    triggerReactionEffect();
  }
}

function triggerReactionEffect() {
  const preset = reactionPresets[selectedReaction];
  if (!preset) {
    return;
  }

  if (preset.mode === "blast") {
    explodeAroundPhoto(preset.symbol);
    return;
  }

  rainReactionSymbol(preset.symbol);
}

function rainReactionSymbol(symbol) {
  const total = 40;

  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement("span");
    piece.className = "reaction-piece";
    piece.textContent = symbol;

    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 2 + Math.random() * 1.8;
    const drift = -120 + Math.random() * 240;
    const scale = 0.72 + Math.random() * 0.92;
    const spin = -360 + Math.random() * 720;
    const size = 18 + Math.random() * 18;

    piece.style.left = `${left}vw`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.fontSize = `${size}px`;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--scale", scale.toFixed(2));
    piece.style.setProperty("--spin", `${spin.toFixed(0)}deg`);

    reactionLayer.appendChild(piece);
    setTimeout(() => piece.remove(), (delay + duration) * 1000 + 140);
  }
}

function explodeAroundPhoto(symbol) {
  const rect = photoFrame.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const total = 32;

  photoFrame.classList.remove("blast");
  void photoFrame.offsetWidth;
  photoFrame.classList.add("blast");

  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement("span");
    piece.className = "blast-piece";
    piece.textContent = symbol;

    const side = Math.floor(Math.random() * 4);
    let startX = 0;
    let startY = 0;

    if (side === 0) {
      startX = rect.left + Math.random() * rect.width;
      startY = rect.top - 8;
    } else if (side === 1) {
      startX = rect.right + 8;
      startY = rect.top + Math.random() * rect.height;
    } else if (side === 2) {
      startX = rect.left + Math.random() * rect.width;
      startY = rect.bottom + 8;
    } else {
      startX = rect.left - 8;
      startY = rect.top + Math.random() * rect.height;
    }

    const vx = startX - centerX;
    const vy = startY - centerY;
    const length = Math.hypot(vx, vy) || 1;
    const power = 60 + Math.random() * 130;
    const tx = (vx / length) * power;
    const ty = (vy / length) * power;
    const size = 20 + Math.random() * 22;
    const rotate = -260 + Math.random() * 520;

    piece.style.left = `${startX}px`;
    piece.style.top = `${startY}px`;
    piece.style.fontSize = `${size}px`;
    piece.style.setProperty("--tx", `${tx.toFixed(1)}px`);
    piece.style.setProperty("--ty", `${ty.toFixed(1)}px`);
    piece.style.setProperty("--rot", `${rotate.toFixed(0)}deg`);

    reactionLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 980);
  }
}

function triggerFlash() {
  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
}

function rainConfetti() {
  confettiLayer.innerHTML = "";
  const symbols = ["💖", "💗", "🌸", "💐", "✨", "🩷"];
  const total = 150;

  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement("span");
    piece.className = "piece";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left = Math.random() * 100;
    const delay = Math.random() * 0.9;
    const duration = 2.8 + Math.random() * 2.9;
    const drift = -170 + Math.random() * 340;
    const scale = 0.68 + Math.random() * 1.15;
    const spin = -460 + Math.random() * 920;
    const size = 18 + Math.random() * 24;

    piece.style.left = `${left}vw`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.fontSize = `${size}px`;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--scale", scale.toFixed(2));
    piece.style.setProperty("--spin", `${spin.toFixed(0)}deg`);

    confettiLayer.appendChild(piece);
  }

  setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 7000);
}

function createSparkles() {
  clearInterval(sparkleTimer);
  sparkleTimer = setInterval(() => {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 5 + Math.random() * 11;
    const delay = Math.random() * 0.9;
    const duration = 1.2 + Math.random() * 1.6;

    sparkle.style.left = `${x}%`;
    sparkle.style.top = `${y}%`;
    sparkle.style.width = `${size}px`;
    sparkle.style.animationDelay = `${delay}s`;
    sparkle.style.animationDuration = `${duration}s`;

    finaleInner.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2500);
  }, 120);
}

function launchFinale() {
  isFinished = true;
  closeMessageModal();
  card.classList.add("complete");
  nextBtn.disabled = true;
  triggerFlash();
  rainConfetti();

  setTimeout(() => {
    finale.classList.add("show");
    createSparkles();
  }, 520);
}

function goNextOrFinish() {
  closeMessageModal();

  if (currentIndex < slides.length - 1) {
    currentIndex += 1;
    renderSlide();
    return;
  }

  launchFinale();
}

function nextSlideFlow() {
  if (isFinished) {
    return;
  }

  pulseFrame();
  if (!isModalOpen) {
    openMessageModal();
    return;
  }

  goNextOrFinish();
}

function continueFromModal() {
  if (isFinished || !isModalOpen) {
    return;
  }

  goNextOrFinish();
}

function handlePhotoKeyboard(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextSlideFlow();
  }
}

function handleGlobalKeyboard(e) {
  if (e.key === "Escape") {
    closeMessageModal();
  }
}

nextBtn.addEventListener("click", nextSlideFlow);
photoFrame.addEventListener("click", nextSlideFlow);
photoFrame.addEventListener("keydown", handlePhotoKeyboard);
modalClose.addEventListener("click", closeMessageModal);
modalNextBtn.addEventListener("click", continueFromModal);
messageModal.addEventListener("click", (e) => {
  if (e.target === messageModal) {
    closeMessageModal();
  }
});
reactionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setReaction(button.dataset.reaction);
  });
});
document.addEventListener("keydown", handleGlobalKeyboard);

setReaction("like", false);
renderSlide();
