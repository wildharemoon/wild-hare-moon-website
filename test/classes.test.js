import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseGvizDate,
  parseGvizResponse,
  upcomingClasses,
  hasSignupLink,
} from '../site/assets/js/classes.js';

test('parseGvizDate reads the Date(y,m,d) form with a zero-indexed month', () => {
  const d = parseGvizDate('Date(2026,7,14)');
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 7);      // August
  assert.equal(d.getDate(), 14);
});

test('parseGvizDate reads a plain ISO date as local midnight', () => {
  const d = parseGvizDate('2026-08-14');
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 7);
  assert.equal(d.getDate(), 14);
  assert.equal(d.getHours(), 0);
});

test('parseGvizDate returns null for junk and non-strings', () => {
  assert.equal(parseGvizDate('not a date'), null);
  assert.equal(parseGvizDate(null), null);
  assert.equal(parseGvizDate(42), null);
  assert.equal(parseGvizDate(''), null);
});

test('upcomingClasses keeps today, sorted soonest-first', () => {
  const today = new Date(2026, 7, 14, 15, 30);   // mid-afternoon
  const rows = [
    { name: 'Later',  date: new Date(2026, 8, 1) },
    { name: 'Tonight', date: new Date(2026, 7, 14) },
    { name: 'Sooner', date: new Date(2026, 7, 20) },
  ];
  const upcoming = upcomingClasses(rows, today);
  assert.deepEqual(upcoming.map(r => r.name), ['Tonight', 'Sooner', 'Later']);
});

test('upcomingClasses drops past, missing-name, or missing/invalid-date rows', () => {
  const today = new Date(2026, 7, 14);
  const rows = [
    { name: 'Past',       date: new Date(2026, 6, 1) },
    { name: '',           date: new Date(2026, 7, 20) },
    { name: 'No date',    date: null },
    { name: 'Bad date',   date: new Date('nonsense') },
    { name: 'Good',       date: new Date(2026, 7, 20) },
  ];
  const upcoming = upcomingClasses(rows, today);
  assert.deepEqual(upcoming.map(r => r.name), ['Good']);
});

test('upcomingClasses returns an empty array for an empty sheet', () => {
  assert.deepEqual(upcomingClasses([], new Date(2026, 7, 14)), []);
});

test('hasSignupLink accepts http, https, and mailto only', () => {
  assert.equal(hasSignupLink({ link: 'https://example.com/signup' }), true);
  assert.equal(hasSignupLink({ link: 'http://example.com/signup' }), true);
  assert.equal(hasSignupLink({ link: 'mailto:wildharemoon@gmail.com' }), true);
  assert.equal(hasSignupLink({ link: 'javascript:alert(1)' }), false);
  assert.equal(hasSignupLink({ link: 'example.com/signup' }), false);
  assert.equal(hasSignupLink({ link: 'https:foo' }), false);
  assert.equal(hasSignupLink({ link: '' }), false);
  assert.equal(hasSignupLink({}), false);
});

test('parseGvizResponse maps columns by label and tolerates missing cells', () => {
  const payload = {
    table: {
      cols: [
        { label: 'Class' }, { label: 'Date' }, { label: 'Location' },
        { label: 'Notes' }, { label: 'Signup Link' },
      ],
      rows: [
        { c: [
          { v: 'Candle Craft Basics' }, { v: 'Date(2026,7,14)' }, { v: 'Her studio' },
          null, { v: 'mailto:wildharemoon@gmail.com' },
        ] },
      ],
    },
  };
  const text = `/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify(payload)});`;
  const rows = parseGvizResponse(text);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'Candle Craft Basics');
  assert.equal(rows[0].location, 'Her studio');
  assert.equal(rows[0].notes, '');
  assert.equal(rows[0].date.getMonth(), 7);
});

test('parseGvizResponse returns an empty array when columns are missing', () => {
  const payload = { table: { cols: [{ label: 'Nope' }], rows: [{ c: [{ v: 'x' }] }] } };
  const text = `google.visualization.Query.setResponse(${JSON.stringify(payload)});`;
  assert.deepEqual(parseGvizResponse(text), []);
});
