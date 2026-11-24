(() => {
  const pixKey = "82993378933";
  const toast = document.getElementById("toast");
  const modal = document.getElementById("qrModal");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2300);
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(pixKey);
      showToast("Chave Pix copiada!");
    } catch {
      const field = document.createElement("textarea");
      field.value = pixKey;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      showToast(copied ? "Chave Pix copiada!" : "Não foi possível copiar a chave.");
    }
  }

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.getElementById("copyPix").addEventListener("click", copyPix);
  document.getElementById("copyPixModal").addEventListener("click", copyPix);
  document.getElementById("showQr").addEventListener("click", openModal);
  document.getElementById("closeQr").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
})();
