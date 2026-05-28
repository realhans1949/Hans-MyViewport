'use strict';

function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleLabel(theme);
}

function updateToggleLabel(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

document.addEventListener('click', e => {
  if (e.target.closest('#theme-toggle')) {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleLabel(next);
  }
});

function getUnitPx(unit) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  switch (unit) {
    case 'vw':   return w / 100;
    case 'vh':   return h / 100;
    case 'vmin': return Math.min(w, h) / 100;
    case 'vmax': return Math.max(w, h) / 100;
    case 'dvh':  return h / 100;
    case 'svh':  return h / 100;
    case 'lvh':  return h / 100;
    case 'dvw':  return w / 100;
    default:     return null;
  }
}

function fmt(px) {
  return px.toFixed(2) + 'px';
}

function updateStats() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  document.getElementById('stat-w').textContent   = w + 'px';
  document.getElementById('stat-h').textContent   = h + 'px';
  document.getElementById('stat-1vw').textContent = fmt(w / 100);
  document.getElementById('stat-1vh').textContent = fmt(h / 100);
}

function updateLiveBadges() {
  document.querySelectorAll('.lv[data-unit]').forEach(el => {
    const px = getUnitPx(el.dataset.unit);
    el.textContent = px !== null ? fmt(px) : '—';
  });
}

function updateCalc() {
  const val  = parseFloat(document.getElementById('calc-val').value);
  const unit = document.getElementById('calc-unit').value;
  const out  = document.getElementById('calc-out');

  if (isNaN(val)) { out.textContent = '—'; return; }

  const base = getUnitPx(unit);
  out.textContent = base !== null ? (val * base).toFixed(2) : '—';
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  const original = btn.textContent;
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('copied');
  }, 1500);
}

document.addEventListener('click', e => {
  if (e.target.matches('.copy-btn')) {
    copyText(e.target.dataset.copy, e.target);
  }
});

document.getElementById('calc-val').addEventListener('input', updateCalc);
document.getElementById('calc-unit').addEventListener('change', updateCalc);

window.addEventListener('resize', () => {
  updateStats();
  updateLiveBadges();
  updateCalc();
});

initTheme();
updateStats();
updateLiveBadges();
updateCalc();
