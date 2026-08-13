// Pure helpers for the Google Sheets classes schedule. No DOM, no network —
// so this module is testable under `node --test`.

/**
 * Google's gviz endpoint returns date-typed cells as "Date(Y,M,D)" (M is
 * zero-indexed) rather than the ISO string that was typed in. Handle both.
 */
export function parseGvizDate(raw) {
  if (typeof raw !== 'string' || raw === '') return null;
  const m = raw.match(/^Date\((\d+),(\d+),(\d+)\)$/);
  if (m) return new Date(Number(m[1]), Number(m[2]), Number(m[3]));
  const d = new Date(raw + 'T00:00:00');
  return isNaN(d) ? null : d;
}

/** Unwrap the JSONP-ish gviz envelope and map columns by header label. */
export function parseGvizResponse(text) {
  let json;
  try {
    json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));
  } catch {
    return [];
  }
  const cols = (json?.table?.cols || []).map(c => (c.label || '').trim());
  const idx = {
    name:     cols.indexOf('Class'),
    date:     cols.indexOf('Date'),
    location: cols.indexOf('Location'),
    notes:    cols.indexOf('Notes'),
    link:     cols.indexOf('Signup Link'),
  };
  if (idx.name === -1 || idx.date === -1) return [];

  return (json?.table?.rows || []).map(row => {
    const cell = i => (i === -1 || !row.c?.[i] || row.c[i].v == null) ? '' : row.c[i].v;
    return {
      name:     String(cell(idx.name)),
      date:     parseGvizDate(cell(idx.date)),
      location: String(cell(idx.location)),
      notes:    String(cell(idx.notes)),
      link:     String(cell(idx.link)),
    };
  });
}

/** Upcoming classes only, soonest first. A row needs both a Class name and a valid Date. */
export function upcomingClasses(rows, today) {
  const cutoff = new Date(today);
  cutoff.setHours(0, 0, 0, 0);

  return rows
    .filter(r => r.name && r.date instanceof Date && !isNaN(r.date) && r.date >= cutoff)
    .sort((a, b) => a.date - b.date);
}

/** Only http(s)/mailto links are rendered, so a sheet edit cannot inject a scheme. */
export function hasSignupLink(row) {
  return /^(?:https?:\/\/|mailto:)/i.test(row?.link || '');
}
