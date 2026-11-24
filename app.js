(() => {
  const c = window.CLIENT_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const theme = c.theme || {};
  const root = document.documentElement;
  const vars = {
    primary: "--primary", accent: "--accent", page: "--page", card: "--card",
    text: "--text", muted: "--muted", buttonText: "--button-text", radius: "--radius"
  };
  Object.entries(vars).forEach(([key, cssVar]) => {
    if (theme[key]) root.style.setProperty(cssVar, theme[key]);
  });

  $("businessName").textContent = c.businessName || "Cartão Digital";
  document.title = c.businessName ? `${c.businessName} | Cartão Digital` : "Cartão Digital";
  $("eyebrow").textContent = c.eyebrow || "CARTÃO DIGITAL";
  $("description").textContent = c.description || "";
  $("location").textContent = c.location || "";
  $("footer").textContent = c.footer || "";
  if (c.logo) {
    $("logo").src = c.logo;
    $("logo").alt = `Logo de ${c.businessName || "cliente"}`;
    $("logo").hidden = false;
    $("logo").onerror = () => { $("logo").hidden = true; };
  } else {
    $("logo").hidden = true;
  }
  if (c.cover) $("cover").style.backgroundImage = `url("${c.cover.replaceAll('"', '')}")`;

  const toast = (message) => {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    window.setTimeout(() => $("toast").classList.remove("show"), 2300);
  };
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  };

  function addContact(contact) {
    const lines = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${contact.name || c.businessName || "Contato"}`,
      contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : "",
      contact.email ? `EMAIL:${contact.email}` : "",
      contact.website ? `URL:${contact.website}` : "",
      "END:VCARD"
    ].filter(Boolean);
    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = make("a");
    a.href = url; a.download = "contato.vcf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  (c.buttons || []).forEach((item) => {
    let el;
    if (item.type === "pix") {
      el = make("button", "action", "");
      el.type = "button";
      el.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.pixKey || "");
          toast("Chave Pix copiada!");
        } catch {
          toast("Não foi possível copiar. Verifique as permissões do navegador.");
        }
      });
    } else if (item.type === "pixqr") {
      el = make("a", "action", "");
      el.href = c.pixQr || "assets/pix-qrcode.jpg";
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else if (item.type === "contact") {
      el = make("button", "action secondary", "");
      el.type = "button";
      el.addEventListener("click", () => addContact(item.contact || {}));
    } else {
      let href = item.url || "#";
      if (item.type === "whatsapp") {
        const phone = (item.phone || "").replace(/\D/g, "");
        href = `https://wa.me/${phone}?text=${encodeURIComponent(item.message || "Olá!")}`;
      }
      el = make("a", "action", "");
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
    if (item.secondary) el.classList.add("secondary");
    const symbol = make("span", "symbol", item.icon || "↗");
    symbol.setAttribute("aria-hidden", "true");
    const label = make("span", "", item.label || "Abrir");
    el.append(symbol, label);
    $("actions").appendChild(el);
  });
})();
