import { describe, expect, it } from 'vitest';
import { demoClub, emptyClub, type Club, type Profile } from './model';
import { generatePlan } from './matching';
const date = '2026-10-30';
const make = (id: string, offers: Profile['offers'], request: Profile['request'], start = '16:00', end = '17:00'): Profile => ({ id, alias: id, offers, request, availability: [{ weekday: 5, start, end }] });
const club = (...profiles: Profile[]): Club => ({ ...emptyClub(), profiles });
describe('meaningful peer exchanges', () => {
  it('finds a three-person cycle when no reciprocal pair exists', () => {
    const p = generatePlan(demoClub(date), date);
    expect(p.sessions).toHaveLength(1);
    expect(p.sessions[0].kind).toBe('loop');
    expect(p.sessions[0].end - p.sessions[0].start).toBe(45);
    expect(p.sessions[0].edges).toEqual(expect.arrayContaining([
      { from: 'noor', to: 'lina', subject: 'python' },
      { from: 'lina', to: 'sami', subject: 'design' },
      { from: 'sami', to: 'noor', subject: 'mathematics' },
    ]));
    expect(p.unresolved).toEqual([]);
  });
  it('creates a reciprocal pair only with enough time for both turns', () => {
    const c = club(make('a', ['python'], 'design'), make('b', ['design'], 'python'));
    expect(generatePlan(c, date).sessions[0].kind).toBe('pair');
    c.profiles[1].availability[0].end = '16:15';
    const p = generatePlan(c, date);
    expect(p.sessions[0].kind).toBe('oneway');
    expect(p.unresolved).toHaveLength(1);
  });
  it('keeps a one-way helper’s own request unresolved', () => {
    const p = generatePlan(club(make('a', ['python'], 'arabic'), make('b', ['design'], 'python')), date);
    expect(p.sessions[0].edges).toHaveLength(1);
    expect(p.unresolved).toEqual([{ member: 'a', reason: 'helper' }]);
  });
  it('rejects fourteen minutes and accepts fifteen', () => {
    const c = club(make('a', ['python'], 'arabic'), make('b', ['design'], 'python', '16:46'));
    expect(generatePlan(c, date).sessions).toHaveLength(0);
    expect(generatePlan(c, date).unresolved).toContainEqual({ member: 'b', reason: 'time' });
    c.profiles[1].availability[0].start = '16:45';
    expect(generatePlan(c, date).sessions).toHaveLength(1);
  });
  it('uses the earliest qualifying intersection across multiple windows', () => {
    const a = make('a', ['python'], 'design', '10:00', '10:15');
    a.availability.push({ weekday: 5, start: '16:00', end: '17:00' });
    const b = make('b', ['design'], 'python', '09:00', '17:00');
    const p = generatePlan(club(a, b), date);
    expect(p.sessions[0].kind).toBe('pair');
    expect(p.sessions[0].start).toBe(960);
  });
  it('never schedules a person twice or uses self-help', () => {
    const c = demoClub(date); c.profiles.push(make('extra', ['python'], 'mathematics'));
    const p = generatePlan(c, date);
    const members = p.sessions.flatMap(s => s.members);
    expect(new Set(members).size).toBe(members.length);
    expect(p.sessions.flatMap(s => s.edges).every(e => e.from !== e.to)).toBe(true);
    expect(generatePlan(club(make('self', ['python'], 'python')), date).sessions).toEqual([]);
  });
  it('joins adjacent windows but preserves even a one-minute gap', () => {
    const c = demoClub(date);
    c.profiles[0].availability = [
      { weekday: 5, start: '16:15', end: '17:00' },
      { weekday: 5, start: '16:00', end: '16:15' },
    ];
    expect(generatePlan(c, date).sessions[0]).toMatchObject({ kind: 'loop', start: 960, end: 1005 });
    c.profiles[0].availability[0].start = '16:16';
    expect(generatePlan(c, date).sessions.some(s => s.kind === 'loop')).toBe(false);
  });
  it('is independent of input ordering', () => {
    const c = demoClub(date);
    expect(generatePlan(c, date)).toEqual(generatePlan({ ...c, profiles: [...c.profiles].reverse() }, date));
  });
  it('rejects disjoint windows and a different weekday', () => {
    const a = make('a', ['python'], 'design', '10:00', '11:00'), b = make('b', ['design'], 'python');
    expect(generatePlan(club(a, b), date).sessions).toEqual([]);
    b.availability[0] = { weekday: 4, start: '10:00', end: '11:00' };
    expect(generatePlan(club(a, b), date).sessions).toEqual([]);
  });
  it('reports a helper already committed to a stronger exchange', () => {
    const c = demoClub(date); c.profiles.push(make('z', ['arabic'], 'python'));
    expect(generatePlan(c, date).unresolved).toContainEqual({ member: 'z', reason: 'assigned' });
  });
  it('handles thirty dense profiles with eight windows in under one second', () => {
    const profiles = Array.from({ length: 30 }, (_, i) => ({ ...make(`member-${String(i).padStart(2, '0')}`, ['python', 'design', 'mathematics'], 'python'), availability: Array.from({ length: 8 }, (_, w) => ({ weekday: 5, start: `${String(w + 8).padStart(2, '0')}:00`, end: `${String(w + 8).padStart(2, '0')}:50` })) }));
    const start = performance.now(); const result = generatePlan(club(...profiles), date); const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1000); expect(result.sessions).toHaveLength(10);
    console.log(`30-member / 8-window matching: ${elapsed.toFixed(2)} ms`);
  });
});
