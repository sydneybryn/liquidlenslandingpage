// Liquid Lens landing page — interactive phone mockup
// Simulates the app's real-time effects with CSS filters over sample photos.

const EFFECTS = [
  { name: "Original", desc: "no effect applied", filter: "none" },
  { name: "Chromatic", desc: "cool, edge-shifted color", filter: "saturate(1.35) hue-rotate(-8deg) contrast(1.08)" },
  { name: "Halation", desc: "warm highlight glow", filter: "sepia(0.18) saturate(1.5) contrast(1.1) brightness(1.06)" },
  { name: "Aerochrome", desc: "infrared color film", filter: "hue-rotate(300deg) saturate(1.9) contrast(1.1)" },
  { name: "Oil Slick", desc: "iridescent thin-film sheen", filter: "saturate(1.3) contrast(1.05)", oil: true },
  { name: "Solarize", desc: "Sabattier tone flip", filter: "invert(0.24) contrast(1.45) saturate(1.3)" },
  { name: "Liquid Chrome", desc: "mirrored, silvery relief", filter: "grayscale(0.35) contrast(1.35) saturate(1.25) hue-rotate(190deg) brightness(1.05)" },
  { name: "Gradient — Vapor", desc: "duotone color ramp", filter: "grayscale(0.5) saturate(2.1) hue-rotate(255deg) contrast(1.15)" },
  { name: "Grain", desc: "35mm film texture", filter: "contrast(1.06) saturate(1.05)", grain: true },
];

const photos = Array.from(document.querySelectorAll("#photoLayer img"));
const dots = Array.from(document.querySelectorAll("#dots button"));
const chipRow = document.getElementById("chipRow");
const effectLabel = document.getElementById("effectLabel");
const grainOverlay = document.getElementById("grainOverlay");
const oilOverlay = document.getElementById("oilOverlay");
const prevBtn = document.getElementById("prevPhoto");
const nextBtn = document.getElementById("nextPhoto");

let photoIndex = 0;
let effectIndex = 0;

function renderChips() {
  chipRow.innerHTML = "";
  EFFECTS.forEach((effect, i) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (i === effectIndex ? " active" : "");
    chip.type = "button";
    chip.textContent = effect.name;
    chip.addEventListener("click", () => setEffect(i));
    chipRow.appendChild(chip);
  });
}

function setEffect(i) {
  effectIndex = i;
  const effect = EFFECTS[i];
  photos.forEach((img) => (img.style.filter = effect.filter));
  grainOverlay.classList.toggle("on", Boolean(effect.grain));
  oilOverlay.classList.toggle("on", Boolean(effect.oil));
  effectLabel.innerHTML = `${effect.name} <span>— ${effect.desc}</span>`;
  Array.from(chipRow.children).forEach((chip, idx) =>
    chip.classList.toggle("active", idx === i)
  );
}

function setPhoto(i) {
  photoIndex = (i + photos.length) % photos.length;
  photos.forEach((img, idx) => img.classList.toggle("active", idx === photoIndex));
  dots.forEach((dot, idx) => dot.classList.toggle("active", idx === photoIndex));
}

dots.forEach((dot) => dot.addEventListener("click", () => setPhoto(Number(dot.dataset.photo))));
prevBtn.addEventListener("click", () => setPhoto(photoIndex - 1));
nextBtn.addEventListener("click", () => setPhoto(photoIndex + 1));

renderChips();
setEffect(0);
setPhoto(0);
