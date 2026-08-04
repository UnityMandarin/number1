const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const projectSelect = document.querySelector('#project');
const estimateForm = document.querySelector('#estimate-form');
const formStatus = document.querySelector('#form-status');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1080 && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
});

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => {
    projectSelect.value = card.dataset.project;
  });
});

estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!estimateForm.reportValidity()) return;

  const data = new FormData(estimateForm);
  const subject = `Estimate request — ${data.get('project')} — ${data.get('location')}`;
  const body = [
    'Hello Hernandez Concrete,',
    '',
    'I would like to request an estimate.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Project type: ${data.get('project')}`,
    `Project city / area: ${data.get('location')}`,
    `Photos or plans available: ${data.get('files')}`,
    '',
    'Project details:',
    data.get('details'),
    '',
    'I understand this inquiry does not authorize work or create a project agreement.'
  ].join('\n');

  formStatus.textContent = 'Opening an email draft for your review…';
  window.location.href = `mailto:hernandezconcrete86@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
