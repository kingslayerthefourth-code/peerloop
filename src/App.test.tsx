// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { demoClub, emptyClub } from './model';

const storage = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock('./storage', () => storage);

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('storage and import recovery', () => {
  let container: HTMLDivElement;
  let root: Root;
  let restoreDialogs: () => void;
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const previousDialogMethods = Object.getOwnPropertyDescriptors(HTMLDialogElement.prototype);
    Object.defineProperties(HTMLDialogElement.prototype, {
      showModal: { configurable: true, value(this: HTMLDialogElement) { this.setAttribute('open', ''); } },
      close: { configurable: true, value(this: HTMLDialogElement) { this.removeAttribute('open'); } },
    });
    restoreDialogs = () => {
      for (const key of ['showModal', 'close']) {
        if (previousDialogMethods[key]) Object.defineProperty(HTMLDialogElement.prototype, key, previousDialogMethods[key]);
        else Reflect.deleteProperty(HTMLDialogElement.prototype, key);
      }
    };
    history.replaceState(null, '', '/');
    document.documentElement.lang = 'en'; document.documentElement.dir = 'ltr';
    container = document.createElement('div'); document.body.append(container);
    root = createRoot(container);
    storage.save.mockResolvedValue(undefined);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    restoreDialogs();
    vi.restoreAllMocks(); vi.unstubAllGlobals();
  });
  async function render() { await act(async () => { root.render(<App/>); }); }
  function button(text: string) {
    const match = [...container.querySelectorAll('button')].find(b => b.textContent?.includes(text));
    if (!match) throw new Error(`Missing button: ${text}`);
    return match;
  }
  async function chooseClub(contents: string) {
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error('Missing club file input');
    const file = new File([contents], 'club.json', { type: 'application/json' });
    // jsdom supplies File but not its asynchronous text reader.
    Object.defineProperty(file, 'text', { value: async () => contents });
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });
    await act(async () => { input.dispatchEvent(new Event('change', { bubbles: true })); });
  }

  it('does not overwrite stored work with an empty club after a failed read', async () => {
    storage.load.mockRejectedValue(new Error('read failed'));
    await render();
    expect(container.textContent).toContain('Temporary session:');
    expect(container.textContent).not.toContain('Loading your club');
    expect(storage.save).not.toHaveBeenCalled();

    // Merely changing presentation must not make the failed read destructive.
    await act(async () => button('العربية').click());
    expect(storage.save).not.toHaveBeenCalled();
  });

  it('allows an explicit replacement after a read failure and saves that replacement', async () => {
    storage.load.mockRejectedValue(new Error('read failed'));
    await render();
    await act(async () => button('Try fictional example').click());
    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(storage.save.mock.calls[0][0]).toMatchObject({ example: true, club: { profiles: [
      { alias: 'Noor' }, { alias: 'Sami' }, { alias: 'Lina' },
    ] } });
    expect(container.textContent).toContain('Fictional example — not real students or measured results');
    expect(container.textContent).not.toContain('Temporary session:');
  });

  it('keeps the latest queued write pending and retains its failure warning', async () => {
    const first = deferred<void>(), latest = deferred<void>();
    storage.load.mockResolvedValue({ club: emptyClub(), lang: 'en', example: false });
    storage.save.mockReset().mockImplementationOnce(() => first.promise).mockImplementationOnce(() => latest.promise);
    await render();
    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain('Saving…');

    await act(async () => button('العربية').click());
    expect(storage.save).toHaveBeenCalledTimes(1); // The new write waits for the first.
    await act(async () => first.resolve());
    expect(storage.save).toHaveBeenCalledTimes(2);
    expect(container.textContent).toContain('جارٍ الحفظ…');
    expect(container.textContent).not.toContain('محفوظ على هذا الجهاز');

    await act(async () => latest.reject(new Error('disk full')));
    expect(container.textContent).toContain('جلسة مؤقتة:');
    expect(container.textContent).not.toContain('جارٍ الحفظ…');
    expect(container.textContent).not.toContain('محفوظ على هذا الجهاز');
  });

  it('rejects an unsupported file version without changing or saving the current club', async () => {
    const original = demoClub('2026-10-30');
    storage.load.mockResolvedValue({ club: original, lang: 'en', example: true });
    await render();
    expect(storage.save).toHaveBeenCalledTimes(1);
    storage.save.mockClear();

    await chooseClub(JSON.stringify({ ...original, version: 99, profiles: [] }));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('unsupported version');
    expect([...container.querySelectorAll('.member-card h3')].map(h => h.textContent)).toEqual(['Noor', 'Sami', 'Lina']);
    expect(container.textContent).toContain('Fictional example — not real students or measured results');
    expect(storage.save).not.toHaveBeenCalled();
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('confirms a valid replacement before saving its original IDs and time zone', async () => {
    storage.load.mockResolvedValue({ club: demoClub('2026-10-30'), lang: 'en', example: true });
    await render();
    storage.save.mockClear();
    const replacement = { ...emptyClub(), timeZone: 'Europe/London', profiles: [{
      id: 'preserved-member-42', alias: 'علياء', offers: ['english'], request: 'arabic',
      availability: [{ weekday: 1, start: '09:00', end: '10:00' }],
    }] };

    await chooseClub(JSON.stringify(replacement));
    expect(container.querySelector('dialog')?.textContent).toContain('Replace your current club with this validated file?');
    expect([...container.querySelectorAll('.member-card h3')].map(h => h.textContent)).toEqual(['Noor', 'Sami', 'Lina']);
    expect(storage.save).not.toHaveBeenCalled();

    await act(async () => button('Continue').click());
    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(storage.save.mock.calls[0][0]).toEqual({ club: replacement, lang: 'en', example: false });
    expect([...container.querySelectorAll('.member-card h3')].map(h => h.textContent)).toEqual(['علياء']);
    expect(container.querySelector('dialog')).toBeNull();
    expect(container.textContent).toContain('Club loaded.');
  });
});
