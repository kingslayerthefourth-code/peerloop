import { clock, dateDay, minutes, type Club, type Profile, type Subject } from './model';

export type Edge = { from: string; to: string; subject: Subject };
export type Session = { id: string; members: string[]; edges: Edge[]; start: number; end: number; kind: 'oneway' | 'pair' | 'loop' };
export type Unresolved = { member: string; reason: 'helper' | 'time' | 'assigned' };
export type Plan = { date: string; sessions: Session[]; unresolved: Unresolved[] };
const lexical = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const teaches = (a: Profile, b: Profile) => a.id !== b.id && a.offers.includes(b.request);

function commonStart(members: Profile[], weekday: number, duration: number): number | undefined {
  let windows: [number, number][] = [[0, 1440]];
  for (const person of members) {
    const own = person.availability.filter(a => a.weekday === weekday).map(a => [minutes(a.start), minutes(a.end)]);
    windows = windows.flatMap(([s, e]) => own.map(([os, oe]): [number, number] => [Math.max(s, os), Math.min(e, oe)]).filter(([s, e]) => e - s >= duration));
    if (!windows.length) return undefined;
  }
  return Math.min(...windows.map(([s]) => s));
}
export function generatePlan(club: Club, date: string): Plan {
  const weekday = dateDay(date);
  const people = [...club.profiles].sort((a, b) => lexical(a.id, b.id));
  const candidates: Session[] = [];
  function add(members: Profile[], edges: Edge[], kind: Session['kind']) {
    const start = commonStart(members, weekday, edges.length * 15);
    if (start === undefined) return;
    const id = edges.map(e => `${e.from}>${e.to}:${e.subject}`).join('|');
    candidates.push({ id, members: members.map(p => p.id), edges, start, end: start + edges.length * 15, kind });
  }
  const edge = (a: Profile, b: Profile): Edge => ({ from: a.id, to: b.id, subject: b.request });
  for (const a of people) for (const b of people) {
    if (!teaches(a, b)) continue;
    add([a, b], [edge(a, b)], 'oneway');
    if (lexical(a.id, b.id) < 0 && teaches(b, a)) add([a, b], [edge(a, b), edge(b, a)], 'pair');
    for (const c of people) {
      // Only the smallest ID begins a cycle; this removes its rotations.
      if (c.id === a.id || c.id === b.id || lexical(a.id, b.id) >= 0 || lexical(a.id, c.id) >= 0) continue;
      if (teaches(b, c) && teaches(c, a)) add([a, b, c], [edge(a, b), edge(b, c), edge(c, a)], 'loop');
    }
  }
  candidates.sort((a, b) => b.edges.length - a.edges.length || a.start - b.start || lexical(a.id, b.id));
  const used = new Set<string>(), fulfilled = new Set<string>();
  const sessions: Session[] = [];
  for (const c of candidates) {
    if (c.members.some(id => used.has(id))) continue;
    sessions.push(c); c.members.forEach(id => used.add(id)); c.edges.forEach(e => fulfilled.add(e.to));
  }
  const unresolved: Unresolved[] = people.filter(p => !fulfilled.has(p.id)).map(p => {
    const helpers = people.filter(a => teaches(a, p));
    const timed = helpers.some(a => commonStart([a, p], weekday, 15) !== undefined);
    return { member: p.id, reason: !helpers.length ? 'helper' : !timed ? 'time' : 'assigned' };
  });
  return { date, sessions, unresolved };
}
export const timeRange = (session: Session) => `${clock(session.start)}–${clock(session.end)}`;
