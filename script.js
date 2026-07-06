// Liquid Lens landing page — interactive phone mockup
// Recreates the real app UI (see ContentView.swift): top bar (reset / aspect /
// flip), bottom deck (flash / fx / shutter / warp / colors, then thumbnail /
// photo-video-edit / lens), and the effects drawer (tap a tile to select it,
// drag the slider to actually apply it — matches the real toggleDrawer /
// EffectTile behavior, where selecting alone doesn't turn an effect on).
// Effect looks are approximated with CSS filters since the real app renders
// them with custom Metal shaders that CSS can't reproduce pixel-for-pixel.

const EFFECTS = [
  { id: "ca", label: "CA", category: "colors", icon: "bi-camera2", tint: "#59e6ff",
    filter: (t) => `saturate(${1 + 0.35 * t}) hue-rotate(${-8 * t}deg) contrast(${1 + 0.08 * t})` },
  { id: "halation", label: "Halation", category: "colors", icon: "bi-sun", tint: "#ff8a3d",
    filter: (t) => `sepia(${0.18 * t}) saturate(${1 + 0.5 * t}) contrast(${1 + 0.1 * t}) brightness(${1 + 0.06 * t})` },
  { id: "hyper", label: "Hyper", category: "colors", icon: "bi-magic", tint: "#ff4d99",
    filter: (t) => `saturate(${1 + 1.4 * t}) contrast(${1 + 0.1 * t})` },
  { id: "pink", label: "Pink", category: "colors", icon: "bi-heart", tint: "#d980ff",
    filter: (t) => `sepia(${0.12 * t}) saturate(${1 + 0.25 * t}) hue-rotate(${-12 * t}deg) brightness(${1 + 0.05 * t})` },
  { id: "glow", label: "Glow", category: "colors", icon: "bi-stars", tint: "#ffa6d9",
    filter: (t) => `brightness(${1 + 0.16 * t}) contrast(${1 - 0.06 * t}) saturate(${1 + 0.1 * t})` },
  { id: "crush", label: "Crush", category: "colors", icon: "bi-droplet-fill", tint: "#6699ff",
    filter: (t) => `contrast(${1 + 0.32 * t}) brightness(${1 - 0.09 * t}) saturate(${1 + 0.1 * t})` },
  { id: "oil", label: "Oil", category: "colors", icon: "bi-rainbow", tint: "#80ffbf",
    filter: (t) => `saturate(${1 + 0.3 * t}) contrast(${1 + 0.05 * t})`, oil: true },
  { id: "chrome", label: "Chrome", category: "colors", icon: "bi-disc", tint: "#ccd9f2",
    filter: (t) => `grayscale(${0.35 * t}) contrast(${1 + 0.38 * t}) saturate(${1 + 0.22 * t}) hue-rotate(${190 * t}deg) brightness(${1 + 0.05 * t})` },
  { id: "infra", label: "Infra", category: "colors", icon: "bi-flower1", tint: "#ff598c",
    filter: (t) => `hue-rotate(${300 * t}deg) saturate(${1 + 0.9 * t}) contrast(${1 + 0.1 * t})` },
  { id: "solar", label: "Solar", category: "colors", icon: "bi-brightness-alt-high", tint: "#ffbf66",
    filter: (t) => `invert(${0.24 * t}) contrast(${1 + 0.45 * t}) saturate(${1 + 0.3 * t})` },
  { id: "grad", label: "Grad", category: "colors", icon: "bi-palette-fill", tint: "#ff994d",
    filter: (t, palette) => `grayscale(${0.5 * t}) saturate(${1 + 1.1 * t}) hue-rotate(${(paletteHue(palette)) * t}deg) contrast(${1 + 0.15 * t})` },

  { id: "grain", label: "Grain", category: "fx", icon: "bi-cloud-haze2", tint: "#c9c9c9",
    filter: (t) => `contrast(${1 + 0.06 * t}) saturate(${1 + 0.05 * t})`, grain: true },
  { id: "sharpen", label: "Sharpen", category: "fx", icon: "bi-triangle", tint: "#59e6ff",
    filter: (t) => `contrast(${1 + 0.3 * t}) saturate(${1 + 0.12 * t})` },
  { id: "zoom", label: "Zoom", category: "fx", icon: "bi-bullseye", tint: "#bfe3ff",
    filter: (t) => `blur(${1.6 * t}px) contrast(${1 + 0.05 * t})` },
  { id: "mesh", label: "Mesh", category: "fx", icon: "bi-box", tint: "#2eff9e",
    filter: (t) => `grayscale(${0.25 * t}) contrast(${1 + 0.15 * t})`, grid: true },
  { id: "emboss", label: "Emboss", category: "fx", icon: "bi-patch-check-fill", tint: "#b8d1f0",
    filter: (t) => `grayscale(${0.42 * t}) contrast(${1 + 0.55 * t}) brightness(${1 + 0.04 * t})` },
  { id: "polar", label: "Polar", category: "fx", icon: "bi-circle-half", tint: "#8cd9ff",
    filter: (t) => `saturate(${1 + 0.2 * t}) contrast(${1 + 0.1 * t}) hue-rotate(${18 * t}deg)` },
  { id: "trails", label: "Trails", category: "fx", icon: "bi-lightning", tint: "#ffe059",
    filter: (t) => `brightness(${1 + 0.16 * t}) saturate(${1 + 0.35 * t}) contrast(${1 - 0.05 * t})` },
  { id: "ripple", label: "Ripple", category: "fx", icon: "bi-water", tint: "#4dccff",
    filter: (t) => `saturate(${1 + 0.15 * t}) contrast(${1 + 0.06 * t})` },
  { id: "fluted", label: "Fluted", category: "fx", icon: "bi-layout-split", tint: "#b3e6f2",
    filter: (t) => `contrast(${1 + 0.2 * t}) saturate(${1 + 0.1 * t}) blur(${0.35 * t}px)` },
  { id: "marble", label: "Marble", category: "fx", icon: "bi-wind", tint: "#bfa6ff",
    filter: (t) => `hue-rotate(${42 * t}deg) saturate(${1 + 0.3 * t}) contrast(${1 + 0.1 * t})` },
];

const GRADIENT_PALETTES = ["Sunset", "Vapor", "Ocean", "Neon", "Aurora", "Ice", "Acid", "Rose", "Noir", "Matcha"];
const GRADIENT_HUES = [20, 255, 190, 280, 140, 200, 70, 320, 0, 95];
function paletteHue(i) { return GRADIENT_HUES[i] ?? GRADIENT_HUES[0]; }

const ASPECTS = [
  { label: "5:7", ratio: 5 / 7 },
  { label: "9:16", ratio: 9 / 16 },
];
const LENSES = ["1×", "0.5×"];

// ---- state -----------------------------------------------------------
const values = {}; // effectId -> 0..100
EFFECTS.forEach((e) => (values[e.id] = 0));

let selectedEffect = EFFECTS[0];
let activeDrawer = null; // null | 'colors' | 'fx'
let photoIndex = 0;
let aspectIndex = 0;
let lensIndex = 0;
let flipped = false;
let flashOn = false;
let mode = "photo"; // 'photo' | 'video'
let isRecording = false;
let warpLevel = 0;
let gradientPaletteIndex = 0;
let gridOn = true;
let lastShot = null;

// ---- element refs -----------------------------------------------------
const photos = Array.from(document.querySelectorAll("#photoLayer img"));
const previewFrame = document.getElementById("previewFrame");
const grainOverlay = document.getElementById("grainOverlay");
const oilOverlay = document.getElementById("oilOverlay");
const gridOverlay = document.getElementById("gridOverlay");
const warpVignette = document.getElementById("warpVignette");
const captureFlash = document.getElementById("captureFlash");

const resetBtn = document.getElementById("resetBtn");
const aspectBtn = document.getElementById("aspectBtn");
const aspectLabel = document.getElementById("aspectLabel");
const recIndicator = document.getElementById("recIndicator");
const flipBtn = document.getElementById("flipBtn");

const flashBtn = document.getElementById("flashBtn");
const fxBtn = document.getElementById("fxBtn");
const colorsBtn = document.getElementById("colorsBtn");
const shutterBtn = document.getElementById("shutterBtn");
const shutterInner = document.getElementById("shutterInner");
const warpBtn = document.getElementById("warpBtn");
const warpLabel = document.getElementById("warpLabel");

const thumbBtn = document.getElementById("thumbBtn");
const photoModeBtn = document.getElementById("photoModeBtn");
const videoModeBtn = document.getElementById("videoModeBtn");
const editModeBtn = document.getElementById("editModeBtn");
const editTooltip = document.getElementById("editTooltip");
const lensBtn = document.getElementById("lensBtn");

const effectsDrawer = document.getElementById("effectsDrawer");
const drawerEffectName = document.getElementById("drawerEffectName");
const drawerResetBtn = document.getElementById("drawerResetBtn");
const drawerDoneBtn = document.getElementById("drawerDoneBtn");
const gridToggleBtn = document.getElementById("gridToggleBtn");
const paletteBtn = document.getElementById("paletteBtn");
const effectSlider = document.getElementById("effectSlider");
const drawerValue = document.getElementById("drawerValue");
const drawerTiles = document.getElementById("drawerTiles");

// ---- rendering ---------------------------------------------------------

function recomputeFilters() {
  const parts = [];
  EFFECTS.forEach((e) => {
    const v = values[e.id];
    if (v > 0) parts.push(e.filter(v / 100, gradientPaletteIndex));
  });
  const filterStr = parts.length ? parts.join(" ") : "none";
  photos.forEach((img) => (img.style.filter = filterStr));

  grainOverlay.style.opacity = (values.grain / 100) * 0.4;
  oilOverlay.style.opacity = (values.oil / 100) * 0.3;
  gridOverlay.style.opacity = gridOn ? (values.mesh / 100) * 0.5 : 0;

  const anyActive = EFFECTS.some((e) => values[e.id] > 0) || warpLevel > 0;
  resetBtn.classList.toggle("accent", anyActive);
}

function renderTopBar() {
  aspectBtn.hidden = isRecording;
  recIndicator.hidden = !isRecording;
  aspectLabel.textContent = ASPECTS[aspectIndex].label;
}

function renderPreviewFrame() {
  previewFrame.style.aspectRatio = String(ASPECTS[aspectIndex].ratio);
  previewFrame.style.transform = `scaleX(${flipped ? -1 : 1}) scale(${1 + warpLevel * 0.045})`;
  warpVignette.style.opacity = warpLevel * 0.16;
}

function renderToolSquares() {
  flashBtn.classList.toggle("active", flashOn);
  flashBtn.disabled = flipped;
  flashBtn.querySelector(".tool-icon i").className = `bi ${flashOn ? "bi-lightning-charge-fill" : "bi-lightning-charge"}`;

  fxBtn.classList.toggle("active", activeDrawer === "fx");
  colorsBtn.classList.toggle("active", activeDrawer === "colors");

  warpBtn.classList.toggle("active", warpLevel > 0);
  warpLabel.textContent = warpLevel > 0 ? `Warp ${warpLevel}` : "Warp";
}

function renderShutter() {
  shutterBtn.classList.toggle("recording", isRecording);
  shutterInner.classList.toggle("video-mode", mode === "video");
}

function renderLowerRow() {
  photoModeBtn.classList.toggle("active", mode === "photo");
  videoModeBtn.classList.toggle("active", mode === "video");
  lensBtn.textContent = flipped ? "1×" : LENSES[lensIndex];
  lensBtn.disabled = flipped;
  lensBtn.classList.toggle("faint", flipped);
}

function renderThumb() {
  if (!lastShot) {
    thumbBtn.disabled = true;
    thumbBtn.style.backgroundImage = "none";
    thumbBtn.innerHTML = '<i class="bi bi-image"></i>';
    return;
  }
  thumbBtn.disabled = false;
  thumbBtn.innerHTML = "";
  thumbBtn.style.backgroundImage = `url("${photos[lastShot.photoIndex].src}")`;
  thumbBtn.style.filter = lastShot.filterStr;
}

function renderDrawer() {
  if (!activeDrawer) {
    effectsDrawer.hidden = true;
    return;
  }
  effectsDrawer.hidden = false;
  drawerEffectName.textContent = selectedEffect.label;
  drawerEffectName.style.color = selectedEffect.tint;
  effectSlider.style.accentColor = selectedEffect.tint;
  effectSlider.value = values[selectedEffect.id];
  drawerValue.textContent = Math.round(values[selectedEffect.id]);

  gridToggleBtn.hidden = selectedEffect.id !== "mesh";
  if (selectedEffect.id === "mesh") {
    gridToggleBtn.classList.toggle("on", gridOn);
    gridToggleBtn.style.color = gridOn ? selectedEffect.tint : "";
  }
  paletteBtn.hidden = selectedEffect.id !== "grad";
  if (selectedEffect.id === "grad") {
    paletteBtn.textContent = GRADIENT_PALETTES[gradientPaletteIndex];
    paletteBtn.style.color = selectedEffect.tint;
  }

  renderTiles();
}

function renderTiles() {
  drawerTiles.innerHTML = "";
  EFFECTS.filter((e) => e.category === activeDrawer).forEach((e) => {
    const tile = document.createElement("button");
    const highlighted = e.id === selectedEffect.id || values[e.id] > 0;
    tile.className = "effect-tile" + (highlighted ? " on" : "");
    tile.style.setProperty("--tint", e.tint);
    tile.innerHTML = `
      <span class="effect-tile-icon"><i class="bi ${e.icon}"></i></span>
      <span class="effect-tile-label">${e.label}</span>
    `;
    tile.addEventListener("click", () => {
      selectedEffect = e;
      renderDrawer();
    });
    drawerTiles.appendChild(tile);
  });
}

function renderAll() {
  recomputeFilters();
  renderTopBar();
  renderPreviewFrame();
  renderToolSquares();
  renderShutter();
  renderLowerRow();
  renderThumb();
  renderDrawer();
}

// ---- interactions -------------------------------------------------------

resetBtn.addEventListener("click", () => {
  EFFECTS.forEach((e) => (values[e.id] = 0));
  warpLevel = 0;
  activeDrawer = null;
  renderAll();
});

aspectBtn.addEventListener("click", () => {
  aspectIndex = (aspectIndex + 1) % ASPECTS.length;
  renderTopBar();
  renderPreviewFrame();
});

flipBtn.addEventListener("click", () => {
  flipped = !flipped;
  flipBtn.classList.add("spin");
  setTimeout(() => flipBtn.classList.remove("spin"), 380);
  renderPreviewFrame();
  renderToolSquares();
  renderLowerRow();
});

flashBtn.addEventListener("click", () => {
  if (flashBtn.disabled) return;
  flashOn = !flashOn;
  renderToolSquares();
});

function toggleDrawer(category) {
  if (selectedEffect.category !== category) {
    selectedEffect = EFFECTS.find((e) => e.category === category) || selectedEffect;
  }
  activeDrawer = activeDrawer === category ? null : category;
  renderToolSquares();
  renderDrawer();
}
fxBtn.addEventListener("click", () => toggleDrawer("fx"));
colorsBtn.addEventListener("click", () => toggleDrawer("colors"));

warpBtn.addEventListener("click", () => {
  warpLevel = (warpLevel + 1) % 5;
  renderToolSquares();
  renderPreviewFrame();
  recomputeFilters();
});

drawerResetBtn.addEventListener("click", () => {
  values[selectedEffect.id] = 0;
  recomputeFilters();
  renderDrawer();
});
drawerDoneBtn.addEventListener("click", () => {
  activeDrawer = null;
  renderToolSquares();
  renderDrawer();
});
gridToggleBtn.addEventListener("click", () => {
  gridOn = !gridOn;
  recomputeFilters();
  renderDrawer();
});
paletteBtn.addEventListener("click", () => {
  gradientPaletteIndex = (gradientPaletteIndex + 1) % GRADIENT_PALETTES.length;
  recomputeFilters();
  renderDrawer();
});
effectSlider.addEventListener("input", () => {
  values[selectedEffect.id] = Number(effectSlider.value);
  recomputeFilters();
  drawerValue.textContent = Math.round(values[selectedEffect.id]);
  renderTiles();
  renderToolSquares();
});

function currentFilterString() {
  return photos[photoIndex].style.filter || "none";
}

function capturePhoto() {
  photos[photoIndex].classList.remove("active");
  photoIndex = (photoIndex + 1) % photos.length;
  photos[photoIndex].classList.add("active");
  photos[photoIndex].style.filter = currentFilterString();

  lastShot = { photoIndex, filterStr: currentFilterString() };
  renderThumb();

  captureFlash.classList.add("flash");
  shutterBtn.classList.add("pressed");
  setTimeout(() => captureFlash.classList.remove("flash"), 220);
  setTimeout(() => shutterBtn.classList.remove("pressed"), 150);
}

shutterBtn.addEventListener("click", () => {
  if (mode === "video") {
    isRecording = !isRecording;
    renderTopBar();
    renderShutter();
    return;
  }
  capturePhoto();
});

function setMode(next) {
  if (isRecording) return; // real app disables mode switching mid-recording
  mode = next;
  renderShutter();
  renderLowerRow();
}
photoModeBtn.addEventListener("click", () => setMode("photo"));
videoModeBtn.addEventListener("click", () => setMode("video"));

editModeBtn.addEventListener("click", () => {
  editTooltip.classList.add("show");
  clearTimeout(editModeBtn._t);
  editModeBtn._t = setTimeout(() => editTooltip.classList.remove("show"), 1600);
});

lensBtn.addEventListener("click", () => {
  if (lensBtn.disabled) return;
  lensIndex = (lensIndex + 1) % LENSES.length;
  renderLowerRow();
});

thumbBtn.addEventListener("click", () => {
  if (!lastShot) return;
  photos[photoIndex].classList.remove("active");
  photoIndex = lastShot.photoIndex;
  photos[photoIndex].classList.add("active");
  renderAll();
});

renderAll();
