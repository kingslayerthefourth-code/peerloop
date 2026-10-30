export const subjects = ['python', 'mathematics', 'design', 'english', 'arabic', 'physics'] as const;
export type Subject = typeof subjects[number];
export type Language = 'en' | 'ar';
export type Availability = { weekday: number; start: string; end: string };
export type Profile = { id: string; alias: string; offers: Subject[]; request: Subject; availability: Availability[] };
export type Club = { format: 'peerloop'; version: 1; timeZone: string; profiles: Profile[] };
export type ErrorCode = 'format' | 'fields' | 'version' | 'timezone' | 'limit' | 'alias' | 'duplicateAlias' | 'duplicateId' | 'subject' | 'availability' | 'overlap' | 'size' | 'date';
export class ValidationError extends Error {
  constructor(public code: ErrorCode) { super(code); }
}
export const emptyClub = (): Club => ({ format: 'peerloop', version: 1, timeZone: 'Asia/Dubai', profiles: [] });
const fail = (code: ErrorCode): never => { throw new ValidationError(code); };
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
function keys(value: Record<string, unknown>, names: string[]) {
  if (Object.keys(value).length !== names.length || names.some(k => !Object.hasOwn(value, k))) fail('fields');
}
export function minutes(value: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) fail('availability');
  const [h, m] = value.split(':').map(Number); return h * 60 + m;
}
export const clock = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
export function validateClub(input: unknown): Club {
  if (!object(input)) return fail('format');
  if (input.format !== 'peerloop') return fail('format');
  if (input.version !== 1) return fail('version');
  keys(input, ['format', 'version', 'timeZone', 'profiles']);
  if (typeof input.timeZone !== 'string' || input.timeZone.length > 100) return fail('timezone');
  try { new Intl.DateTimeFormat('en', { timeZone: input.timeZone }).format(); } catch { return fail('timezone'); }
  if (!Array.isArray(input.profiles) || input.profiles.length > 30) return fail('limit');
  const ids = new Set<string>(), aliases = new Set<string>();
  const profiles: Profile[] = input.profiles.map((p: unknown) => {
    if (!object(p)) return fail('fields');
    keys(p, ['id', 'alias', 'offers', 'request', 'availability']);
    if (typeof p.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.id) || ids.has(p.id)) return fail('duplicateId');
    ids.add(p.id);
    if (typeof p.alias !== 'string' || p.alias.trim().length < 1 || p.alias.trim().length > 40) return fail('alias');
    const alias = p.alias.trim(); const key = alias.normalize('NFKC').toLocaleLowerCase('en');
    if (aliases.has(key)) return fail('duplicateAlias'); aliases.add(key);
    if (!Array.isArray(p.offers) || p.offers.length < 1 || p.offers.length > 3 || new Set(p.offers).size !== p.offers.length || !p.offers.every(s => subjects.includes(s)) || !subjects.includes(p.request as Subject)) return fail('subject');
    if (!Array.isArray(p.availability) || p.availability.length < 1 || p.availability.length > 8) return fail('availability');
    const availability = p.availability.map((a: unknown): Availability => {
      if (!object(a)) return fail('availability'); keys(a, ['weekday', 'start', 'end']);
      if (!Number.isInteger(a.weekday) || (a.weekday as number) < 1 || (a.weekday as number) > 7 || typeof a.start !== 'string' || typeof a.end !== 'string' || minutes(a.start) >= minutes(a.end)) return fail('availability');
      return { weekday: a.weekday as number, start: a.start, end: a.end };
    }).sort((a, b) => a.weekday - b.weekday || minutes(a.start) - minutes(b.start));
    if (availability.some((a, i) => i > 0 && availability[i - 1].weekday === a.weekday && minutes(a.start) < minutes(availability[i - 1].end))) return fail('overlap');
    return { id: p.id, alias, offers: p.offers as Subject[], request: p.request as Subject, availability };
  });
  return { format: 'peerloop', version: 1, timeZone: input.timeZone, profiles };
}
export function parseClub(text: string): Club {
  if (new TextEncoder().encode(text).length > 256 * 1024) return fail('size');
  let value: unknown; try { value = JSON.parse(text); } catch { return fail('format'); }
  return validateClub(value);
}
export function today(timeZone = 'Asia/Dubai', now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (key: string) => parts.find(p => p.type === key)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function dateDay(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail('date');
  const d = new Date(date + 'T12:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date) return fail('date');
  return d.getUTCDay() || 7;
}
export function validateDate(date: string, timeZone: string, now = new Date()) {
  dateDay(date);
  const diff = (Date.parse(date + 'T12:00:00Z') - Date.parse(today(timeZone, now) + 'T12:00:00Z')) / 86400000;
  if (diff < 0 || diff > 90) fail('date'); return date;
}
export function demoClub(date: string): Club {
  const availability = [{ weekday: dateDay(date), start: '16:00', end: '17:00' }];
  return { ...emptyClub(), profiles: [
    { id: 'noor', alias: 'Noor', offers: ['python'], request: 'mathematics', availability },
    { id: 'sami', alias: 'Sami', offers: ['mathematics'], request: 'design', availability },
    { id: 'lina', alias: 'Lina', offers: ['design'], request: 'python', availability },
  ] };
}
