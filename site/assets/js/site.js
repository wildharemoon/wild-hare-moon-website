import { parseGvizResponse, upcomingClasses, hasSignupLink } from './classes.js';

document.getElementById('year').textContent = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);

// Hero content is already in view on load, so it gets a simple staggered
// fade-in rather than a ScrollTrigger (which can get stuck mid-progress
// for elements whose trigger point is already past on initial layout).
gsap.to('#hero-mark, #hero-tagline, #hero-cta', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.15,
  delay: 0.1,
});

document.querySelectorAll('section .reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  });
});

/** Escape sheet-supplied text before it reaches innerHTML. */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Classes: fetch the schedule from the "Hare Moon" Google Sheet and render
// upcoming classes. Same gviz-fetch pattern as the Weeds shows list.
const HARE_MOON_SHEET_ID = '10lIoaQs4K2Fao8jQtQI51A54STYIei64rD1SN2vK9_c';

const CLASS_DATE_FORMAT = { weekday: 'short', month: 'short', day: 'numeric' };
const formatClassDate = d => d.toLocaleDateString('en-US', CLASS_DATE_FORMAT);

function classCard(c) {
  const where = c.location ? escapeHtml(c.location) : '';
  return `
    <div class="classes-item reveal border border-ink/15 rounded-2xl p-6">
      <h3 class="font-display text-2xl mb-1">${escapeHtml(c.name)}</h3>
      <p class="text-ink/70 text-sm">${formatClassDate(c.date)}${where ? ' &middot; ' + where : ''}</p>
      ${c.notes ? `<p class="text-teal text-xs uppercase tracking-wide mt-2">${escapeHtml(c.notes)}</p>` : ''}
      ${hasSignupLink(c)
        ? `<a href="${escapeHtml(c.link)}" class="inline-block mt-3 text-teal font-semibold text-sm hover:underline">Reserve a Spot &rarr;</a>`
        : ''}
    </div>`;
}

async function loadClasses() {
  const list = document.getElementById('classes-list');
  if (!list) return;

  try {
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${HARE_MOON_SHEET_ID}/gviz/tq?tqx=out:json&headers=1&gid=0`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = parseGvizResponse(await res.text());
    const upcoming = upcomingClasses(rows, new Date());

    list.innerHTML = upcoming.length
      ? upcoming.map(classCard).join('')
      : '<p class="text-ink/70 text-sm reveal sm:col-span-2 text-center">No classes currently scheduled &mdash; check back soon.</p>';

    document.querySelectorAll('#classes-list .reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  } catch (err) {
    list.innerHTML = '<p class="text-ink/70 text-sm reveal sm:col-span-2 text-center">No classes currently scheduled &mdash; check back soon.</p>';
    console.error('Failed to load classes:', err);
  }
}
loadClasses();

/**
 * Contact List signup writes straight to the Hare Moon Sheet via an Apps
 * Script web app (doPost appends a row to the "Contact List" tab).
 * Submitting via fetch keeps the visitor on the page. Same pattern as the
 * Weeds mailing-list form.
 */
const clForm   = document.getElementById('contact-list-form');
const clStatus = document.getElementById('contact-list-status');

if (clStatus) clForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const submit = clForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  clStatus.style.color = '';
  clStatus.textContent = 'Signing up…';

  try {
    const res = await fetch(clForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(clForm)).toString(),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);

    // .hidden and the form's own `flex` utility class have equal CSS
    // specificity, so which one wins depends on stylesheet source order —
    // an inline style avoids that fight entirely.
    clForm.style.display = 'none';
    clStatus.style.color = '#4f7d74';
    clStatus.textContent = 'Thanks — you’re on the list.';
  } catch (err) {
    submit.disabled = false;
    clStatus.style.color = '#b0463a';
    clStatus.textContent = err.message === 'invalid email'
      ? 'That doesn’t look like a valid email address — mind double-checking it?'
      : 'Something went wrong. Please email wildharemoon@gmail.com instead.';
    console.error('Contact list signup failed:', err);
  }
});
