// Liquid Lens landing page: photo browser for the phone mockup.
// The surrounding UI chrome is static artwork matching the real app; only
// these two arrows are interactive, cycling through real photos shot with
// the app.

const photos = Array.from(document.querySelectorAll("#photoLayer img"));
const prevBtn = document.getElementById("prevPhoto");
const nextBtn = document.getElementById("nextPhoto");

let index = 0;

function setPhoto(i) {
  photos[index].classList.remove("active");
  index = (i + photos.length) % photos.length;
  photos[index].classList.add("active");
}

prevBtn.addEventListener("click", () => setPhoto(index - 1));
nextBtn.addEventListener("click", () => setPhoto(index + 1));
