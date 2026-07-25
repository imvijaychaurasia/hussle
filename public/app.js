const CONTACT = {
  email: 'imvijaychaurasia@gmail.com',
  // Replace with your WhatsApp number in international format, digits only, no + or spaces.
  // Example: 919812345678
  whatsappNumber: '918828287588'
};

function mailtoLink(subject, body) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${CONTACT.email}?${params.toString()}`;
}

function whatsappLink(text) {
  const params = new URLSearchParams({ text });
  return `https://wa.me/${CONTACT.whatsappNumber}?${params.toString()}`;
}

function renderCard(item, index) {
  const card = document.createElement('div');
  card.className = `card reveal delay-${(index % 4)}`;

  const title = document.createElement('h3');
  title.textContent = item.title;

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = item.tagline;

  const list = document.createElement('ul');
  item.details.forEach((d) => {
    const li = document.createElement('li');
    li.textContent = d;
    list.appendChild(li);
  });

  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const turnaround = document.createElement('span');
  turnaround.className = 'turnaround';
  turnaround.textContent = item.turnaround;

  const link = document.createElement('a');
  link.className = 'card-link';
  link.textContent = 'Request this ->';
  link.target = '_blank';
  link.rel = 'noopener';
  link.href = whatsappLink(`Hi Vijay, I need help with: ${item.title}.`);

  footer.appendChild(turnaround);
  footer.appendChild(link);

  card.appendChild(title);
  card.appendChild(tagline);
  card.appendChild(list);
  card.appendChild(footer);

  return card;
}

function renderGroup(group) {
  const section = document.createElement('div');
  section.className = 'service-group';

  const heading = document.createElement('h3');
  heading.className = 'group-heading reveal';
  heading.textContent = group.group;

  const grid = document.createElement('div');
  grid.className = 'grid';
  group.items.forEach((item, index) => grid.appendChild(renderCard(item, index)));

  section.appendChild(heading);
  section.appendChild(grid);
  return section;
}

async function loadServices() {
  const container = document.getElementById('service-groups');
  if (!container) return;
  try {
    const res = await fetch('data/services.json');
    const { groups } = await res.json();
    container.innerHTML = '';
    groups.forEach((group) => container.appendChild(renderGroup(group)));
    initReveal();
  } catch (err) {
    container.innerHTML = '<p class="loading">Could not load services right now.</p>';
  }
}

function wireGlobalContact() {
  const emailBtn = document.getElementById('contact-email');
  const waBtn = document.getElementById('contact-whatsapp');
  const sidebarWa = document.getElementById('social-whatsapp');
  const subscribeWa = document.getElementById('subscribe-whatsapp');

  const waHref = whatsappLink("Hi Vijay, I have something I'd like your help with.");

  if (emailBtn) {
    emailBtn.href = mailtoLink(
      'Task request',
      'Hi Vijay,\n\nI need help with:\n\nWhen I need it by:\n'
    );
  }
  if (waBtn) waBtn.href = waHref;
  if (sidebarWa) sidebarWa.href = waHref;
  if (subscribeWa) {
    subscribeWa.href = whatsappLink('Hi Vijay, I\'d like to subscribe for ongoing help.');
  }
}

loadServices();
wireGlobalContact();
