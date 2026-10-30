import { describe, expect, it } from 'vitest';
import { demoClub, parseClub, today, validateClub, validateDate } from './model';
const date = '2026-10-30';
describe('portable and safe club data', () => {
  it('round-trips Arabic aliases, IDs, subjects, and availability', () => {
    const c = demoClub(date); c.profiles[0].alias = 'نور';
    expect(parseClub(JSON.stringify(c))).toEqual(c);
  });
  it.each(['future', 2, null])('rejects unsupported version %s', version => {
    expect(() => validateClub({ ...demoClub(date), version })).toThrow('version');
  });
  it('rejects duplicate aliases after case, whitespace, and Unicode normalization', () => {
    const c = demoClub(date); c.profiles[1].alias = '  NOOR  ';
    expect(() => validateClub(c)).toThrow('duplicateAlias');
    c.profiles[1].alias = 'Ｎｏｏｒ'; expect(() => validateClub(c)).toThrow('duplicateAlias');
  });
  it('rejects duplicate IDs and unknown fields at every level', () => {
    const c = demoClub(date); c.profiles[1].id = 'noor'; expect(() => validateClub(c)).toThrow('duplicateId');
    const original = demoClub(date);
    expect(() => validateClub({ ...original, password: 'not allowed' })).toThrow('fields');
    expect(() => validateClub({ ...original, profiles: [{ ...original.profiles[0], email: 'not allowed' }] })).toThrow('fields');
    original.profiles[0].availability[0] = { weekday: 5, start: '16:00', end: '17:00', other: 1 } as never;
    expect(() => validateClub(original)).toThrow('fields');
  });
  it('rejects overlapping, overnight, malformed, and missing windows', () => {
    const c = demoClub(date);
    c.profiles[0].availability.push({ weekday: 5, start: '16:30', end: '17:30' });
    expect(() => validateClub(c)).toThrow('overlap');
    for (const [start, end] of [['23:00', '01:00'], ['24:00', '24:30'], ['9:00', '10:00'], ['', '17:00']]) {
      c.profiles[0].availability = [{ weekday: 5, start, end }]; expect(() => validateClub(c)).toThrow('availability');
    }
    c.profiles[0].availability = []; expect(() => validateClub(c)).toThrow('availability');
  });
  it('rejects invalid subjects, aliases, limits, timezone, and oversized files', () => {
    const c = demoClub(date);
    expect(() => validateClub({ ...c, timeZone: 'Atlantis/Nowhere' })).toThrow('timezone');
    expect(() => validateClub({ ...c, profiles: [{ ...c.profiles[0], offers: [] }] })).toThrow('subject');
    expect(() => validateClub({ ...c, profiles: [{ ...c.profiles[0], alias: ' ' }] })).toThrow('alias');
    expect(() => validateClub({ ...c, profiles: Array(31).fill(c.profiles[0]) })).toThrow('limit');
    expect(() => parseClub(' '.repeat(256 * 1024 + 1))).toThrow('size');
    expect(() => parseClub('invalid')).toThrow('format');
  });
  it('does not mutate an existing club during failed validation', () => {
    const c = demoClub(date), before = JSON.stringify(c);
    expect(() => validateClub({ ...c, version: 2 })).toThrow(); expect(JSON.stringify(c)).toBe(before);
  });
  it('uses the club timezone and rejects impossible or out-of-range dates', () => {
    const now = new Date('2026-10-29T22:00:00Z'); expect(today('Asia/Dubai', now)).toBe(date);
    expect(validateDate(date, 'Asia/Dubai', now)).toBe(date);
    for (const d of ['2026-10-29', '2027-02-01', '2026-02-30', '2026-13-01', 'garbage']) expect(() => validateDate(d, 'Asia/Dubai', now)).toThrow('date');
  });
});
