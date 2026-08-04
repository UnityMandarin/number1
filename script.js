const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const estimateForm = document.querySelector('#estimate-form');
const projectSelect = document.querySelector('#project');
const phoneInput = document.querySelector('#phone');
const preview = document.querySelector('#request-preview');
const requestSummary = document.querySelector('#request-summary');
const copyButton = document.querySelector('#copy-request');
const copyStatus = document.querySelector('#copy-status');

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
  if (window.innerWidth > 1120 && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
  }
});

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => {
    projectSelect.value = card.dataset.project;
  });
});

function updatePhoneRequirement() {
  const preferred = estimateForm.querySelector('input[name="contactMethod"]:checked').value;
  const phonePreferred = preferred === 'Phone';
  phoneInput.required = phonePreferred;
  phoneInput.setAttribute('aria-required', String(phonePreferred));
  if (!phonePreferred) {
    phoneInput.setCustomValidity('');
    phoneInput.removeAttribute('aria-invalid');
  }
}

estimateForm.querySelectorAll('input[name="contactMethod"]').forEach((radio) => {
  radio.addEventListener('change', updatePhoneRequirement);
});

phoneInput.addEventListener('input', () => {
  phoneInput.setCustomValidity('');
  phoneInput.removeAttribute('aria-invalid');
});

document.querySelectorAll('[data-accordion] details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('[data-accordion] details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

function buildRequestSummary(data) {
  return [
    'HERNANDEZ CONCRETE — ESTIMATE REQUEST PREVIEW',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Preferred contact: ${data.get('contactMethod')}`,
    '',
    `Project type: ${data.get('project')}`,
    `Project address or city: ${data.get('location')}`,
    `Approximate size: ${data.get('size') || 'Not sure'}`,
    `Current condition: ${data.get('condition')}`,
    `Desired timing: ${data.get('timing')}`,
    `May removal be needed: ${data.get('removal')}`,
    '',
    'Project description:',
    data.get('details'),
    '',
    'Acknowledgement: This is an inquiry and does not authorize work or create a project agreement.',
    '',
    'Prepared in the private Hernandez Concrete website concept. The official recipient must be confirmed before launch.'
  ].join('\n');
}

estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updatePhoneRequirement();

  const preferred = estimateForm.querySelector('input[name="contactMethod"]:checked').value;
  if (preferred === 'Phone' && !phoneInput.value.trim()) {
    phoneInput.setCustomValidity('Enter a phone number when phone is your preferred contact method.');
    phoneInput.setAttribute('aria-invalid', 'true');
    phoneInput.reportValidity();
    phoneInput.focus();
    return;
  }

  if (!estimateForm.reportValidity()) return;

  const summary = buildRequestSummary(new FormData(estimateForm));
  requestSummary.textContent = summary;
  preview.hidden = false;
  copyStatus.textContent = '';
  preview.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporary = document.createElement('textarea');
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';
  document.body.appendChild(temporary);
  temporary.select();
  document.execCommand('copy');
  temporary.remove();
}

copyButton.addEventListener('click', async () => {
  try {
    await copyText(requestSummary.textContent);
    copyStatus.textContent = 'Copied to clipboard.';
  } catch {
    copyStatus.textContent = 'Copy failed. Select the preview text manually.';
  }
});

updatePhoneRequirement();
