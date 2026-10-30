import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { subjects, emptyClub, validateClub, parseClub, today, validateDate, demoClub, clock, ValidationError, type Club, type Profile, type Language, type Availability, type Subject } from './model';
import { generatePlan, timeRange, type Plan, type Session } from './matching';
import { load, save } from './storage';
import { strings, subjectNames, weekdays } from './i18n';

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5"/></>,
    loop: <><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4m14 4H3"/></>,
    plus: <path d="M12 5v14M5 12h14"/>, arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>, close: <path d="m6 6 12 12M6 18 18 6"/>,
    print: <><path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 13h10v8H7z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.info}</svg>;
}
function Logo() { return <svg viewBox="0 0 48 48" width="39" height="39" aria-hidden="true"><rect width="48" height="48" rx="14" fill="currentColor"/><g fill="none" stroke="#fff" strokeWidth="3.5"><path d="M14 18a9 9 0 1 1 13 11M34 30a9 9 0 1 1-13-11"/></g><circle cx="14" cy="18" r="3" fill="#edc47a"/><circle cx="34" cy="30" r="3" fill="#edc47a"/></svg>; }
function Modal({ title, closeLabel, onClose, children }: { title: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current!; const previous = document.activeElement as HTMLElement | null; d.showModal(); return () => { d.close(); if (previous?.isConnected) previous.focus(); else document.getElementById('main')?.focus(); }; }, []);
  return <dialog ref={ref} onCancel={e => { e.preventDefault(); onClose(); }} aria-labelledby="dialog-title"><div className="dialog-head"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label={closeLabel}><Icon name="close"/></button></div>{children}</dialog>;
}
function ProfileForm({ initial, club, lang, onSave, onClose }: { initial?: Profile; club: Club; lang: Language; onSave: (p: Profile) => void; onClose: () => void }) {
  const t = strings(lang), names = subjectNames[lang];
  const [alias, setAlias] = useState(initial?.alias || '');
  const [offers, setOffers] = useState<Subject[]>(initial?.offers || []);
  const [request, setRequest] = useState<Subject>(initial?.request || 'mathematics');
  const [windows, setWindows] = useState<Availability[]>(initial?.availability || [{ weekday: 5, start: '16:00', end: '17:00' }]);
  const [error, setError] = useState('');
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const displayed = windows.map((_, i) => ({ weekday: Number(data.get(`weekday-${i}`)), start: String(data.get(`start-${i}`)), end: String(data.get(`end-${i}`)) }));
    const currentAlias = String(data.get('alias') || '');
    setWindows(displayed); setAlias(currentAlias);
    const p = { id: initial?.id || crypto.randomUUID(), alias: currentAlias, offers: data.getAll('offers') as Subject[], request: String(data.get('request')) as Subject, availability: displayed };
    try {
      const validated = validateClub({ ...club, profiles: [...club.profiles.filter(a => a.id !== p.id), p] });
      onSave(validated.profiles.find(a => a.id === p.id)!);
    } catch (e) { setError(t[`err_${e instanceof ValidationError ? e.code : 'unknown'}`]); }
  }
  return <Modal title={initial ? `${t.edit} ${initial.alias}` : t.add} closeLabel={t.close} onClose={onClose}><form onSubmit={submit} noValidate>
    <div className="form-body"><label htmlFor="alias">{t.alias}</label><input name="alias" id="alias" value={alias} maxLength={40} autoComplete="off" autoFocus onChange={e => setAlias(e.target.value)} aria-describedby="alias-hint form-error"/><small id="alias-hint">{t.aliasHint}</small>
    <fieldset aria-describedby="offers-hint form-error"><legend>{t.offer}</legend><small id="offers-hint">{t.offersHint}</small><div className="subject-options">{subjects.map(s => <label key={s} className={offers.includes(s) ? 'chosen' : ''}><input name="offers" value={s} type="checkbox" checked={offers.includes(s)} onChange={e => setOffers(e.target.checked ? [...offers, s] : offers.filter(a => a !== s))}/>{names[s]}</label>)}</div></fieldset>
    <label htmlFor="request">{t.request}</label><select name="request" id="request" value={request} onChange={e => setRequest(e.target.value as Subject)} aria-describedby="form-error">{subjects.map(s => <option value={s} key={s}>{names[s]}</option>)}</select>
    <fieldset aria-describedby="availability-hint form-error"><legend>{t.available}</legend><small id="availability-hint">{t.availabilityHint}</small>{windows.map((w, i) => <div className="time-row" key={i}>
      <label>{t.weekday}<select name={`weekday-${i}`} value={w.weekday} onChange={e => setWindows(windows.map((a, j) => j === i ? { ...a, weekday: Number(e.target.value) } : a))}>{weekdays[lang].map((d, k) => <option value={k + 1} key={d}>{d}</option>)}</select></label>
      <label>{t.from}<input name={`start-${i}`} type="time" value={w.start} onChange={e => setWindows(windows.map((a, j) => j === i ? { ...a, start: e.target.value } : a))}/></label>
      <label>{t.to}<input name={`end-${i}`} type="time" value={w.end} onChange={e => setWindows(windows.map((a, j) => j === i ? { ...a, end: e.target.value } : a))}/></label>
      <button type="button" className="icon-button" aria-label={`${t.removeTime} ${i + 1}`} disabled={windows.length === 1} onClick={() => setWindows(windows.filter((_, j) => i !== j))}><Icon name="close" size={16}/></button>
    </div>)}<button type="button" className="text-button" disabled={windows.length >= 8} onClick={() => setWindows([...windows, { weekday: 5, start: '17:00', end: '18:00' }])}><Icon name="plus" size={16}/>{t.addTime}</button></fieldset>
    <p className="error" id="form-error" role="alert">{error}</p></div><div className="dialog-actions"><button type="button" className="secondary" onClick={onClose}>{t.cancel}</button><button className="primary" type="submit">{t.save}<Icon name="check" size={17}/></button></div>
  </form></Modal>;
}
function Exchange({ session, club, lang }: { session: Session; club: Club; lang: Language }) {
  const t = strings(lang), names = subjectNames[lang];
  const member = (id: string) => club.profiles.find(p => p.id === id)!;
  return <article className="session-card"><header><div><span className="kicker">{session.kind === 'loop' ? t.loop : session.kind === 'pair' ? t.pair : t.oneWay}</span><h2>{session.members.map(id => member(id).alias).join(' · ')}</h2></div><span className="time-badge"><Icon name="clock" size={16}/><bdi>{timeRange(session)}</bdi></span></header>
    <div className="exchange-path" aria-hidden="true">{session.edges.map((e, i) => <div className="exchange-node" key={i}><div className={`avatar tone-${i}`}><bdi>{member(e.from).alias.slice(0, 1)}</bdi></div><strong><bdi>{member(e.from).alias}</bdi></strong><span className={`chip ${e.subject}`}>{names[e.subject]}</span><span className="node-arrow"><Icon name="arrow" size={26}/></span></div>)}<span className="loop-return">{session.kind === 'loop' || session.kind === 'pair' ? '↩' : <bdi>{member(session.edges[0].to).alias}</bdi>}</span></div>
    <div className="timeline" aria-label={t.steps}>{session.edges.map((e, i) => <div className="timeline-step" key={i}><span className="step-dot">{i + 1}</span><span className="step-time" dir="ltr">{clock(session.start + i * 15)}–{clock(session.start + (i + 1) * 15)}</span><p><strong><bdi>{member(e.from).alias}</bdi></strong> {t.teaches} <strong><bdi>{member(e.to).alias}</bdi></strong> {t.with} <span>{names[e.subject]}</span></p></div>)}</div>
    <div className="why"><Icon name="check"/><div><strong>{t.why}</strong><p>{t.whyText} <bdi>{session.edges.length * 15}</bdi> {t.minutes}.</p></div></div>
  </article>;
}
export default function App() {
  const [club, setClub] = useState<Club>(emptyClub);
  const [lang, setLang] = useState<Language>('en');
  const [example, setExample] = useState(false), [ready, setReady] = useState(false), [temporary, setTemporary] = useState(false), [saving, setSaving] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [date, setDate] = useState(today()), [zone, setZone] = useState('Asia/Dubai');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [view, setView] = useState(location.hash.slice(1) || 'members');
  const [editor, setEditor] = useState<Profile | 'new' | null>(null);
  const [confirmation, setConfirmation] = useState<{ text: string; action: () => void } | null>(null);
  const [status, setStatus] = useState(''), [error, setError] = useState('');
  const file = useRef<HTMLInputElement>(null), writes = useRef(Promise.resolve());
  const t = strings(lang), names = subjectNames[lang];
  useEffect(() => {
    let active = true;
    load().then(s => {
      if (!active) return;
      setClub(s.club); setZone(s.club.timeZone); setDate(today(s.club.timeZone)); setLang(s.lang); setExample(s.example); setCanSave(true);
    }).catch(() => { if (active) setTemporary(true); }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    // A failed read must never replace stored work with the initial empty club.
    if (!ready || !canSave) return;
    let latest = true;
    setSaving(true);
    writes.current = writes.current.then(() => save({ club, lang, example }))
      .then(() => { if (latest) setTemporary(false); })
      .catch(() => { if (latest) setTemporary(true); })
      .finally(() => { if (latest) setSaving(false); });
    return () => { latest = false; };
  }, [club, lang, example, ready, canSave]);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
  useEffect(() => { window.scrollTo({ top: 0 }); document.getElementById('main')?.focus({ preventScroll: true }); }, [view]);
  useEffect(() => { const change = () => setView(location.hash.slice(1) || 'members'); window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change); }, []);
  function go(next: string) { location.hash = next; setView(next); }
  function change(next: Club, nextExample = example) { setClub(next); setExample(nextExample); setCanSave(true); setPlan(null); setError(''); }
  function ask(text: string, action: () => void) { setConfirmation({ text, action }); }
  function sample() {
    const action = () => { const d = today(club.timeZone); setDate(d); change({ ...demoClub(d), timeZone: club.timeZone }, true); go('members'); setStatus(t.example); };
    if (club.profiles.length) ask(t.confirmExample, action); else action();
  }
  function clear() { ask(t.confirmReset, () => { change(emptyClub(), false); setZone('Asia/Dubai'); setDate(today()); go('members'); setStatus(''); }); }
  function suggest() {
    try { validateDate(date, club.timeZone); if (club.profiles.length < 2) { setError(t.noPeople); return; } setPlan(generatePlan(club, date)); setError(''); setStatus(t.generated); go('plan'); }
    catch (e) { setError(t[`err_${e instanceof ValidationError ? e.code : 'unknown'}`]); }
  }
  async function importFile(picked: File | undefined) {
    if (!picked) return;
    try {
      if (picked.size > 256 * 1024) throw new ValidationError('size');
      const next = parseClub(await picked.text());
      const action = () => { change(next, false); setZone(next.timeZone); setDate(today(next.timeZone)); setStatus(t.imported); go('members'); };
      if (club.profiles.length) ask(t.confirmImport, action); else action();
    } catch (e) { setError(t[`err_${e instanceof ValidationError ? e.code : 'unknown'}`]); }
    if (file.current) file.current.value = '';
  }
  function download() {
    const blob = new Blob([JSON.stringify(club, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = `peerloop-club-${today(club.timeZone)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus(t.exported);
  }
  const fulfilled = plan ? club.profiles.length - plan.unresolved.length : 0;
  const activeView = (['members', 'plan', 'about'].includes(view) ? view : 'members') as 'members' | 'plan' | 'about';
  return <div className="app-shell"><a className="skip-link" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>{t.skip}</a><aside className="sidebar no-print"><a href="#members" className="brand" aria-label="PeerLoop"><Logo/><span>Peer<span className="brand-light">Loop</span></span></a><p className="brand-tag">{t.tagline}</p>
    <nav aria-label={lang === 'en' ? 'Main navigation' : 'التنقل الرئيسي'}>{(['members', 'plan', 'about'] as const).map((key, i) => <a key={key} href={`#${key}`} aria-current={activeView === key ? 'page' : undefined}><Icon name={['people', 'loop', 'info'][i]}/>{t[key]}{key === 'members' && <span className="nav-count">{club.profiles.length}</span>}</a>)}</nav>
    <div className="sidebar-bottom"><div className="local-note"><Icon name="lock" size={18}/><span>{t.local}</span></div><button className="language-button" onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setStatus(''); setError(''); }} lang={lang === 'en' ? 'ar' : 'en'}>{t.language}<span aria-hidden="true">◎</span></button><span className="build-credit">PeerLoop · 2026</span></div></aside>
    <main id="main" tabIndex={-1}><div className="topbar no-print"><span className="breadcrumb">{t.yourClub} <span aria-hidden="true">/</span> {t[activeView]}</span><span className={`save-status ${temporary ? 'warning' : ''}`}><span className="status-dot"/>{saving ? t.saving : temporary ? t.storage : t.saved}</span></div>
    {!ready ? <p role="status">{t.waiting}</p> : <>
    {temporary && <p className="notice warning" role="status">{t.storage}</p>}
    {example && <div className="example-banner"><Icon name="info" size={18}/><span>{t.example}</span><button className="text-button no-print" onClick={clear}>{t.startOwn}<Icon name="arrow" size={15}/></button></div>}
    <div className="sr-only" role="status" aria-live="polite">{status}</div>{error && <div className="notice error" role="alert">{error}</div>}
    {activeView === 'members' && <>
      <section className="hero"><div className="hero-copy"><span className="eyebrow"><span/> {t.eyebrow}</span><h1>{t.title}</h1><p>{t.intro}</p><button className="hero-button" onClick={sample}>{t.try}<Icon name="arrow" size={18}/></button></div><div className="hero-art" aria-hidden="true"><svg viewBox="0 0 320 270"><path d="M160 48C20 65 16 226 164 225S300 67 160 48Z" fill="none" stroke="#7aafa0" strokeWidth="2" strokeDasharray="6 8"/><path d="m165 45-12 8 13 4M56 188l-2-15-9 10m222-3-12 5 10 8" fill="none" stroke="#edc47a" strokeWidth="3"/><circle cx="160" cy="48" r="32" fill="#f3e5bf"/><circle cx="57" cy="182" r="32" fill="#d8e8c7"/><circle cx="264" cy="182" r="32" fill="#c9dce9"/><text x="160" y="58" textAnchor="middle" fontSize="30" fill="#5a4a24">↗</text><text x="57" y="193" textAnchor="middle" fontSize="28" fill="#3e5d40">✦</text><text x="264" y="192" textAnchor="middle" fontSize="28" fill="#3e5a69">⌘</text><text x="160" y="150" textAnchor="middle" fontSize="47" fill="#fff" fontFamily="Georgia">↔</text></svg><span>{lang === 'en' ? 'give · learn · connect' : 'شارك · تعلّم · تواصل'}</span></div></section>
      <div className="stats"><div><span className="stat-number">{club.profiles.length.toLocaleString(lang)}</span><span>{t.people}</span></div><div><span className="stat-number">{new Set(club.profiles.flatMap(p => p.offers)).size.toLocaleString(lang)}</span><span>{t.offered}</span></div><div><span className="stat-number">{fulfilled.toLocaleString(lang)}</span><span>{t.requests}</span></div><div className="stats-note"><Icon name="lock" size={17}/>{t.privacy}</div></div>
      <section className="roster-section"><div className="section-heading"><div><h2>{t.roster}</h2><p>{t.rosterText}</p></div><button className="primary" onClick={() => setEditor('new')} disabled={club.profiles.length >= 30}><Icon name="plus" size={17}/>{t.add}</button></div>
      {club.profiles.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icon name="people" size={36}/></div><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="text-button" onClick={() => setEditor('new')}>{t.addFirst}<Icon name="arrow" size={17}/></button></div> : <div className="member-grid">{club.profiles.map((p, i) => <article className="member-card" key={p.id}><header><div className={`avatar tone-${i % 3}`}><bdi>{p.alias.slice(0, 1)}</bdi></div><h3><bdi>{p.alias}</bdi></h3><span className="member-number">{String(i + 1).padStart(2, '0')}</span></header><p className="card-label">{t.offer}</p><div className="chips">{p.offers.map(s => <span key={s} className={`chip ${s}`}>{names[s]}</span>)}</div><p className="card-label">{t.request}</p><span className="request-subject">{names[p.request]}<Icon name="arrow" size={14}/></span><div className="availability"><span className="sr-only">{t.available}</span>{p.availability.map((a, k) => <span key={k}><Icon name="clock" size={14}/>{weekdays[lang][a.weekday - 1]} <bdi>{a.start}–{a.end}</bdi></span>)}</div><footer><button className="text-button" aria-label={`${t.edit} ${p.alias}`} onClick={() => setEditor(p)}>{t.edit}</button><button className="text-button muted" aria-label={`${t.remove} ${p.alias}`} onClick={() => ask(t.confirmDelete, () => { change({ ...club, profiles: club.profiles.filter(a => a.id !== p.id) }); setStatus(t.deleted); })}>{t.remove}</button></footer></article>)}</div>}
      <p className="fine-print">{t.countHint}</p></section>
      <section className="meeting-panel"><div><span className="kicker">{t.meeting}</span><p>{t.dateNote}</p></div><label>{t.date}<input type="date" value={date} min={today(club.timeZone)} onChange={e => { setDate(e.target.value); setPlan(null); }}/></label><button className="primary" onClick={suggest}>{t.suggest}<Icon name="arrow" size={18}/></button></section>
      <details className="file-panel"><summary>{t.dataTitle}</summary><p>{t.exportHint}</p><div className="file-actions"><button className="secondary" onClick={() => file.current?.click()}><Icon name="upload" size={17}/>{t.load}</button><button className="secondary" onClick={download}><Icon name="download" size={17}/>{t.export}</button><button className="text-button danger" onClick={clear}>{t.reset}</button></div><form className="zone-form" onSubmit={e => { e.preventDefault(); try { const next = validateClub({ ...club, timeZone: zone }); change(next); setDate(today(zone)); setStatus(t.profileSaved); } catch { setError(t.err_timezone); } }}><label>{t.zone}<input value={zone} onChange={e => setZone(e.target.value)} spellCheck={false} dir="ltr"/></label><button className="secondary">{t.changeZone}</button></form></details>
    </>}
    {activeView === 'plan' && <><div className="page-heading"><span className="eyebrow">{t.plan}</span><h1>{t.planTitle}</h1><p>{t.planIntro}</p></div>{!plan ? <div className="empty-state"><div className="empty-icon"><Icon name="loop" size={36}/></div><h2>{t.noPlan}</h2><p>{t.noPlanText}</p><button className="primary" onClick={() => go('members')}>{t.back}<Icon name="arrow"/></button></div> : <><div className="plan-toolbar"><div><bdi>{plan.date}</bdi> <span>· <bdi>{club.timeZone}</bdi></span></div><div className="no-print"><button className="secondary" onClick={suggest}>{t.regenerate}</button><button className="primary" onClick={() => window.print()}><Icon name="print" size={17}/>{t.print}</button></div></div><div className="plan-metrics"><strong>{fulfilled.toLocaleString(lang)} / {club.profiles.length.toLocaleString(lang)}</strong><span>{t.progress}</span><span className="metric-divider"/><strong>{plan.sessions.length.toLocaleString(lang)}</strong><span>{t.groups}</span></div>
      <div className="sessions">{plan.sessions.map(s => <Exchange key={s.id} session={s} club={club} lang={lang}/>)}</div>{plan.sessions.length === 0 && <div className="notice"><strong>{t.noMatches}</strong><p>{t.adjust}</p></div>}
      <section className="unresolved"><h2>{t.unresolved}</h2>{!plan.unresolved.length ? <p className="all-connected"><Icon name="check"/>{t.allConnected}</p> : plan.unresolved.map(u => { const p = club.profiles.find(a => a.id === u.member)!; return <div className="unresolved-row" key={p.id}><span><strong><bdi>{p.alias}</bdi></strong> · {names[p.request]}</span><p>{t[u.reason]}</p></div>; })}</section><p className="plan-note"><Icon name="info" size={17}/>{t.suggestion}</p></>}</>}
    {activeView === 'about' && <><div className="page-heading"><span className="eyebrow">PEERLOOP</span><h1>{t.overview}</h1><p>{t.aboutText}</p></div><div className="about-steps">{[1, 2, 3].map((n, i) => <article key={n}><span className="step-dot">0{n}</span><Icon name={['people', 'clock', 'loop'][i]} size={30}/><h2>{t[`step${n}` as 'step1']}</h2><p>{t[`step${n}Text` as 'step1Text']}</p></article>)}</div><article className="about-box"><Icon name="lock" size={24}/><h2>{t.privacy}</h2><p>{t.privacyText}</p><p>{t.exportHint}</p></article><article className="about-box"><h2>{t.limitsTitle}</h2><p>{t.limitsText}</p></article><article className="about-box"><h2>{t.disclosureTitle}</h2><p>{t.disclosureText}</p></article></>}
    <footer className="main-footer no-print"><span>PeerLoop</span><p>{t.privacyText}</p><span>↗</span></footer></>}
    <input ref={file} hidden aria-label={t.load} type="file" accept=".json,application/json" onChange={e => void importFile(e.target.files?.[0])}/>
    </main>
    {editor && <ProfileForm club={club} lang={lang} initial={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} onSave={p => { change({ ...club, profiles: club.profiles.some(a => a.id === p.id) ? club.profiles.map(a => a.id === p.id ? p : a) : [...club.profiles, p] }); setStatus(t.profileSaved); setEditor(null); }}/ >}
    {confirmation && <Modal title={t.confirmTitle} closeLabel={t.close} onClose={() => setConfirmation(null)}><p className="confirmation-copy">{confirmation.text}</p><div className="dialog-actions"><button className="secondary" autoFocus onClick={() => setConfirmation(null)}>{t.cancel}</button><button className="primary" onClick={() => { confirmation.action(); setConfirmation(null); }}>{t.confirm}</button></div></Modal>}
  </div>;
}
