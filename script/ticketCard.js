// ticketCard.js
// JS module to create a ticket card div from a ticket JSON object

export function createTicketCard(ticket) {
  const card = document.createElement("div");
  card.className = "ticket-card";
  if (ticket.type === "mobile_phone_app") {
    card.style.border = "3px dashed #888";
  } else {
    card.style.border = "1px solid #eee";
  }
  card.style.borderRadius = "8px";
  card.style.padding = "12px";
  card.style.marginBottom = "16px";
  card.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
  // Set background color by type
  if (ticket.type === "paper_ticket") {
    card.style.background = "#f6eee3";
  } else if (ticket.type === "prepaid_card") {
    card.style.background = "#d6ffff";
  } else if (ticket.type === "payment_card") {
    card.style.background = "#ffbf00";
  } else {
    card.style.background = "#fafafa";
  }

  // Title and price
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const name = document.createElement("span");
  name.textContent = ticket.name;
  name.style.fontWeight = "bold";
  name.style.fontSize = "18px";

  const price = document.createElement("span");
  price.textContent = ticket.price || "";
  price.style.fontSize = "16px";
  price.style.color = "#007bff";

  header.appendChild(name);
  header.appendChild(price);
  card.appendChild(header);

  // Type and file
  const meta = document.createElement("div");
  meta.style.fontSize = "13px";
  meta.style.color = "#888";
  meta.textContent = `${ticket.type || ""}${
    ticket.file ? " • " + ticket.file : ""
  }`;
  card.appendChild(meta);

  // Aquire section with icons
  if (Array.isArray(ticket.aquire) && ticket.aquire.length > 0) {
    const aquireDiv = document.createElement("div");
    aquireDiv.className = "aquire-list";
    ticket.aquire.forEach((aquireItem) => {
      let icon = "";
      if (["shop", "ticket_shop", "ticket-shop"].includes(aquireItem.type)) {
        icon = "images/building-store.svg";
      }
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("data-id", aquireItem.id);
      link.title = aquireItem.name;
      link.style.display = "inline-block";
      link.style.width = "32px";
      link.style.height = "32px";
      if (icon) {
        link.innerHTML = `<img src="${icon}" alt="${aquireItem.type}" style="width:100%;height:100%;object-fit:contain;vertical-align:middle;" />`;
      } else {
        link.textContent = aquireItem.type;
        link.style.background = "#eee";
        link.style.borderRadius = "6px";
        link.style.textAlign = "center";
        link.style.lineHeight = "32px";
        link.style.fontSize = "14px";
        link.style.color = "#555";
      }
      aquireDiv.appendChild(link);
    });
    card.appendChild(aquireDiv);
  }

  // Entitlements section with icons
  if (Array.isArray(ticket.entitlements) && ticket.entitlements.length > 0) {
    const entSection = document.createElement("div");
    entSection.style.marginTop = "8px";
    entSection.innerHTML = "<b>Entitlements:</b>";
    const entList = document.createElement("div");
    entList.style.display = "flex";
    entList.style.gap = "10px";
    // Entitlements section for main ticket
    ticket.entitlements.forEach((ent) => {
      const entDiv = document.createElement("div");
      entDiv.style.display = "flex";
      entDiv.style.alignItems = "center";
      entDiv.style.gap = "6px";
      entDiv.style.marginLeft = "12px";
      // Icon for public_transport
      if (ent.type === "public_transport") {
        const icon = document.createElement("img");
        icon.src = "images/bus-stop.svg";
        icon.alt = ent.type;
        icon.title = ent.name;
        icon.style.width = "24px";
        icon.style.height = "24px";
        entDiv.appendChild(icon);
      }
      // Stopwatch icon if duration exists
      if (ent.duration) {
        const stopwatch = document.createElement("img");
        stopwatch.src = "images/stopwatch.svg";
        stopwatch.title = ent.duration;
        stopwatch.style.width = "20px";
        stopwatch.style.height = "20px";
        entDiv.appendChild(stopwatch);

        // Add duration text next to the icon
        const durationSpan = document.createElement("span");
        durationSpan.textContent = ` ${ent.duration}`;
        durationSpan.style.marginRight = "6px";
        durationSpan.style.color = "#555";
        entDiv.appendChild(durationSpan);
      }
      // Name and description only
      const txt = document.createElement("span");
      txt.textContent = `${ent.name}${
        ent.description ? ": " + ent.description : ""
      }`;
      entDiv.appendChild(txt);
      entList.appendChild(entDiv);
    });
    entSection.appendChild(entList);
    card.appendChild(entSection);
  }

  // Sub-tickets section
  if (Array.isArray(ticket.sub_tickets) && ticket.sub_tickets.length > 0) {
    ticket.sub_tickets.forEach((subTicket) => {
      const subDiv = document.createElement("div");
      subDiv.className = "sub-ticket";
      subDiv.style.marginTop = "12px";
      subDiv.style.background = "#fff";
      subDiv.style.border = "1px solid #007bff";
      subDiv.style.borderRadius = "6px";
      subDiv.style.padding = "12px";

      // Sub-ticket price (optional)
      if (subTicket.price) {
        const priceDiv = document.createElement("div");
        priceDiv.style.fontWeight = "bold";
        priceDiv.style.color = "#007bff";
        priceDiv.textContent = `Price: ${subTicket.price}`;
        subDiv.appendChild(priceDiv);
      }

      // Entitlements section for sub-ticket
      if (
        Array.isArray(subTicket.entitlements) &&
        subTicket.entitlements.length > 0
      ) {
        const entSection = document.createElement("div");
        entSection.style.marginTop = "8px";
        entSection.innerHTML = "<b>Entitlements:</b>";
        const entList = document.createElement("div");
        entList.style.display = "flex";
        entList.style.gap = "10px";
        subTicket.entitlements.forEach((ent) => {
          const entDiv = document.createElement("div");
          entDiv.style.display = "flex";
          entDiv.style.alignItems = "center";
          entDiv.style.gap = "6px";
          entDiv.style.marginLeft = "12px";
          // Icon for public_transport
          if (ent.type === "public_transport") {
            const icon = document.createElement("img");
            icon.src = "images/bus-stop.svg";
            icon.alt = ent.type;
            icon.title = ent.name;
            icon.style.width = "24px";
            icon.style.height = "24px";
            entDiv.appendChild(icon);
          }
          // Stopwatch icon if duration exists
          if (ent.duration) {
            const stopwatch = document.createElement("img");
            stopwatch.src = "images/stopwatch.svg";
            stopwatch.title = ent.duration;
            stopwatch.style.width = "20px";
            stopwatch.style.height = "20px";
            entDiv.appendChild(stopwatch);

            // Add duration text next to the icon
            const durationSpan = document.createElement("span");
            durationSpan.textContent = ` ${ent.duration}`;
            durationSpan.style.marginRight = "6px";
            durationSpan.style.color = "#555";
            entDiv.appendChild(durationSpan);
          }
          // Name and description only
          const txt = document.createElement("span");
          txt.textContent = `${ent.name || ""}${
            ent.description ? ": " + ent.description : ""
          }`;
          entDiv.appendChild(txt);
          entList.appendChild(entDiv);
        });
        entSection.appendChild(entList);
        subDiv.appendChild(entSection);
      }

      card.appendChild(subDiv);
    });
  }

  return card;
}
