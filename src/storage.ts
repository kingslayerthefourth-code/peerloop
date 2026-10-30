import { validateClub, emptyClub, type Club, type Language } from './model';
export type Saved = { club: Club; lang: Language; example: boolean };
const name = 'peerloop-v1';
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(name, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('settings');
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error('blocked'));
  });
}
async function access(mode: IDBTransactionMode, value?: Saved): Promise<unknown> {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('settings', mode);
      const req = value ? tx.objectStore('settings').put(value, 'club') : tx.objectStore('settings').get('club');
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
export async function load(): Promise<Saved> {
  const raw = await access('readonly') as Saved | undefined;
  if (!raw) return { club: emptyClub(), lang: 'en', example: false };
  return { club: validateClub(raw.club), lang: raw.lang === 'ar' ? 'ar' : 'en', example: raw.example === true };
}
export async function save(value: Saved) { await access('readwrite', value); }
