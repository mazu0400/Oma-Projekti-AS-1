const topBtn = document.getElementById("topBtn");
topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // tekee pehmeän scrollauksen
  });
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.scrollHeight;

  // Näytä nappi, kun scrollattu vähän
  if (scrollY > 100) topBtn.style.display = "block";
  else topBtn.style.display = "none";

  // Nosta nappia ylös, jos ollaan lähellä alareunaa
  const distanceFromBottom = documentHeight - (scrollY + windowHeight);
  if (distanceFromBottom < 100) {
    topBtn.style.bottom = `${15 + (100 - distanceFromBottom)}px`;
  } else {
    topBtn.style.bottom = "15px";
  }
});
