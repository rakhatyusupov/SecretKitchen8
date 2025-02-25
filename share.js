// Share dialog handling
const shareBtn = document.querySelector(".share-btn");
const shareDialog = document.querySelector(".share-dialog");
const copyLinkBtn = document.querySelector(".copy-link");
const savePngBtn = document.querySelector(".save-png");

shareBtn.addEventListener("click", () => {
  shareDialog.showModal();
});

copyLinkBtn.addEventListener("click", () => {
  const url = new URL(window.location);
  url.searchParams.set("radius", params.radius);
  url.searchParams.set("color", params.color.replace("#", ""));
  url.searchParams.set("text", encodeURIComponent(params.text));
  url.searchParams.set("background", params.background);

  navigator.clipboard
    .writeText(url.toString())
    .then(() => alert("Link copied to clipboard"))
    .catch(() => alert("Failed to copy link"));
});

savePngBtn.addEventListener("click", () => {
  saveCanvas("sketch", "png");
});
