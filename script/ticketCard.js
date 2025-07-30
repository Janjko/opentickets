// ticketCard.js
// JS module to create a ticket card div from a ticket JSON object

export function createTicketCard(ticket) {
  const card = document.createElement('div');
  card.className = 'ticket-card';
  card.style.border = '1px solid #eee';
  card.style.borderRadius = '8px';
  card.style.padding = '12px';
  card.style.marginBottom = '16px';
  card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
  // Set background color by type
  if (ticket.type === 'paper_ticket') {
    card.style.background = '#f6eee3';
  } else if (ticket.type === 'prepaid_card') {
    card.style.background = '#d6ffff';
  } else if (ticket.type === 'payment_card') {
    card.style.background = '#ffbf00';
  }else {
    card.style.background = '#fafafa';
  }

  // Title and price
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const name = document.createElement('span');
  name.textContent = ticket.name;
  name.style.fontWeight = 'bold';
  name.style.fontSize = '18px';

  const price = document.createElement('span');
  price.textContent = ticket.price || '';
  price.style.fontSize = '16px';
  price.style.color = '#007bff';

  header.appendChild(name);
  header.appendChild(price);
  card.appendChild(header);

  // Type and file
  const meta = document.createElement('div');
  meta.style.fontSize = '13px';
  meta.style.color = '#888';
  meta.textContent = `${ticket.type || ''}${ticket.file ? ' • ' + ticket.file : ''}`;
  card.appendChild(meta);

  // Aquire section with icons
  if (Array.isArray(ticket.aquire) && ticket.aquire.length > 0) {
    const aquireSection = document.createElement('div');
    aquireSection.style.marginTop = '8px';
    aquireSection.innerHTML = '<b>Aquire:</b>';
    const aquireList = document.createElement('div');
    aquireList.style.display = 'flex';
    aquireList.style.gap = '10px';
    ticket.aquire.forEach(aquireItem => {
      const aquireDiv = document.createElement('div');
      aquireDiv.style.display = 'flex';
      aquireDiv.style.alignItems = 'center';
      aquireDiv.style.gap = '6px';
      aquireDiv.style.marginLeft = '12px';
      // Icon for shop/ticket_shop
      if (["shop", "ticket_shop", "ticket-shop"].includes(aquireItem.type)) {
        const icon = document.createElement('img');
        icon.src = 'images/building-store.svg';
        icon.alt = aquireItem.type;
        icon.title = aquireItem.name;
        icon.style.width = '24px';
        icon.style.height = '24px';
        aquireDiv.appendChild(icon);
      }
      // Name only
      const txt = document.createElement('span');
      txt.textContent = aquireItem.name;
      aquireDiv.appendChild(txt);
      aquireList.appendChild(aquireDiv);
    });
    aquireSection.appendChild(aquireList);
    card.appendChild(aquireSection);
  }

  // Entitlements section with icons
  if (Array.isArray(ticket.entitlements) && ticket.entitlements.length > 0) {
    const entSection = document.createElement('div');
    entSection.style.marginTop = '8px';
    entSection.innerHTML = '<b>Entitlements:</b>';
    const entList = document.createElement('div');
    entList.style.display = 'flex';
    entList.style.gap = '10px';
    ticket.entitlements.forEach(ent => {
      const entDiv = document.createElement('div');
      entDiv.style.display = 'flex';
      entDiv.style.alignItems = 'center';
      entDiv.style.gap = '6px';
      entDiv.style.marginLeft = '12px';
      // Icon for public_transport
      if (ent.type === 'public_transport') {
        const icon = document.createElement('img');
        icon.src = 'images/bus-stop.svg';
        icon.alt = ent.type;
        icon.title = ent.name;
        icon.style.width = '24px';
        icon.style.height = '24px';
        entDiv.appendChild(icon);
      }
      // Name and description only
      const txt = document.createElement('span');
      txt.textContent = `${ent.name}${ent.description ? ': ' + ent.description : ''}`;
      entDiv.appendChild(txt);
      entList.appendChild(entDiv);
    });
    entSection.appendChild(entList);
    card.appendChild(entSection);
  }

  return card;
}
