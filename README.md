# PeerLoop

**Everyone knows something. Someone needs it.**

PeerLoop helps a school-club organizer arrange free peer tutoring, reciprocal exchanges, and three-person skill loops. It checks subjects and shared availability, explains its suggestions, and leaves unresolved requests visible.

## Try it locally

Use Node.js 22 or later and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite. Choose **Try fictional example**, then **Suggest sessions**. Noor, Sami, and Lina connect through Python, mathematics, and design. The example is fictional and does not represent real students or measured outcomes.

```sh
pnpm check
pnpm build
pnpm preview
```

The production build is in `dist/`. GitHub Actions verifies source and publishes that directory to Pages. The Vite base is relative so the deployment works below a project path.

## What works

- Create, edit, and remove up to 30 alias-based profiles, with six subjects and multiple availability windows.
- Generate one-way help, reciprocal exchanges, and three-person loops for a chosen meeting date.
- Explain each teaching step and distinguish missing helpers, incompatible times, and already-assigned participants.
- Save data on the organizer’s device with IndexedDB; import/export validated, versioned JSON club files.
- Switch between English and Arabic, including right-to-left layouts; print the plan.
- Use a precached application shell after the first visit, subject to the browser retaining its offline cache.

No runtime AI API, backend, student accounts, analytics, payments, or automatic messages. A single organizer manages the club on one device. It does not synchronize data or confirm sessions with participants. The deterministic greedy method produces suggestions, not a globally optimal timetable.

## Data and privacy

Only aliases, offered subjects, requested help, and availability belong in a club. Use information you have permission to use. The application does not transmit club records to a server. Exported files contain those records, so share them deliberately. The hosting provider receives ordinary website requests; see its own privacy terms.

The portable interface uses `format: "peerloop"`, `version: 1`, `timeZone`, and `profiles`. Each profile has `id`, `alias`, `offers`, `request`, and `availability` (`weekday`, `start`, `end`). Imports validate completely before replacement, and replacement requires confirmation when a club is already present.

## Verification and competition record

Application development began **October 30, 2026**, after the approved start. October 25 requirements, sketches, and submission preparation are retained and disclosed. Codex generated and revised application code, Arabic strings, tests, and documentation under the entrant’s approved scope. The entrant’s review and personal learning must be described separately and honestly.

See [verification evidence](planning/VERIFICATION.md), [progress](planning/PROGRESS.md), [development disclosure](submission/AI_DISCLOSURE.md), and the [submission checklist](submission/CHECKLIST.md). The current release record distinguishes completed checks from remaining work. No Devpost submission has been made.

## Design and credits

React, TypeScript, Vite, vite-plugin-pwa/Workbox, IndexedDB, Vitest, and axe-core. Original interface SVGs and system fonts. See the dependency lockfile for exact versions and upstream licenses. Source is MIT licensed.

The pre-event [specification](planning/BUILD_SPEC.md), [sketches](planning/WIREFRAMES.md), and [event notes](planning/EVENT.md) explain the design decisions. The [demo storyboard](submission/DEMO_SCRIPT.md) and [judge guide](submission/JUDGE_GUIDE.md) support the final handoff.
