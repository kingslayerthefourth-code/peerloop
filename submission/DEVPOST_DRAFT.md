# PeerLoop — Devpost copy

Release copy prepared October 30, 2026. The entrant must review it before submission, complete any personal contribution or learning field from their own experience. The October 25 preparation is disclosed in [AI_DISCLOSURE.md](AI_DISCLOSURE.md).

## Project name

PeerLoop

## Tagline

Turn what your club knows into the help everyone needs.

## Inspiration

A club can have the right skills without an obvious way to connect them. Someone who offers Python may need mathematics, while the person who offers mathematics needs design. A direct swap leaves the exchange unfinished.

PeerLoop explores whether a small, explainable scheduling tool can help a club organizer connect those offers and requests. This is a prototype built around a fictional example; no interviews or student outcome study have been conducted.

## What it does

PeerLoop turns a club's skills and availability into suggested peer-help sessions. An organizer enters aliases, subjects members can help with, one subject each member wants help with, and available times. The app supports up to 30 members and suggests one-way help, reciprocal pairs, and three-person loops.

The demonstration connects Noor, Sami, and Lina through Python, mathematics, and design. Each contributes one skill and receives help during a shared 45-minute block. The plan lists every teaching step and explains why the session fits. When a request cannot be fulfilled, the app distinguishes a missing helper, insufficient shared time, and a helper already assigned elsewhere.

The interface works in English and Arabic, including right-to-left layouts. Club data stays in the organizer's browser, with versioned JSON import/export for backup or transfer. The organizer can print a session plan and confirm the suggestions with the group outside the app.

## How it was built

The application uses React, TypeScript, and Vite, with IndexedDB for local persistence and GitHub Pages for static hosting. A PWA service worker caches local application assets after an initial visit. The shipped app makes no runtime AI calls and requires no student accounts or paid APIs.

The matching engine enumerates compatible one-way pairs, reciprocal pairs, and three-person loops. It checks exact subjects and shared time, ranks candidates by requests fulfilled, then start time and stable identifiers, and selects groups without assigning anyone twice. This deterministic greedy method produces understandable suggestions; it does not guarantee a globally optimal timetable.

The public file interface is JSON with `format: "peerloop"`, `version: 1`, an IANA time zone, and profiles. Complete validation occurs before a replacement is offered. Unsupported versions, duplicate aliases or IDs, invalid times and subjects, and excess records are rejected.

## Challenges and verification

Development checks caught mismatched form values, contrast and heading issues, and storage recovery behavior that could overwrite existing work after a failed read. Those were corrected, with regression tests for storage failures and confirmed imports.

The release passed TypeScript checks, 26 automated tests, and its production build. Tests cover the three-person loop, short and incompatible time windows, deterministic selection, duplicate records, invalid imports, and data round trips. A dense fixture with 30 members and eight availability windows each generated its plan in 446.54 ms on the development machine. This is a fixture measurement, not a performance promise for every device.

Browser checks verified the fictional loop, member editing and deletion, duplicate-alias errors, conflicting availability, persistence after refresh, Arabic layout, Escape and focus return, and layouts at 320 px and 390 px. Automated axe checks reported no violations in the English and Arabic plan views. Those checks do not establish complete accessibility. Offline reload and suggestion generation were also verified after the application had loaded online.

Detailed evidence and any remaining checks are recorded in [planning/VERIFICATION.md](../planning/VERIFICATION.md).

## AI assistance and contributions

I approved PeerLoop's product scope, individual-entry approach, $0 budget, and review and submission roles. Codex generated and revised the application code, interface, Arabic strings, tests, and documentation, and carried out build and browser checks and deployment. Codex also helped with research, specifications, sketches, and draft submission material on October 25, before the event. Application development began on October 30, during the event. The matching engine itself uses explicit rules and has no runtime generative AI service.

## What I learned

Entrant review required: add only what you actually reviewed, changed, tested, or learned. This field has intentionally not been written as a personal experience on your behalf. Use [JUDGE_GUIDE.md](JUDGE_GUIDE.md) to review the release, then replace this paragraph with your own accurate account before posting.

## What's next

The next useful step is a small, consent-based trial with a club organizer: observe how they enter availability, check the suggested exchanges, and identify where explanations are unclear. Future scheduling changes should follow that evidence.

V1 has a fixed subject list and runs on one organizer's device. It does not synchronize a community, assess tutoring quality, contact participants, or establish improvements in grades or learning.

## Links

- [Working demo](https://kingslayerthefourth-code.github.io/peerloop/)
- [Public source](https://github.com/kingslayerthefourth-code/peerloop)
- Initial published application source commit: `83f352e7a349ffb7525235f1b8c8c2d41ac80201` (later documentation updates may have a newer commit).
- [110-second captioned demo](https://kingslayerthefourth-code.github.io/peerloop/demo/) (edited actual app captures; fictional data).

## Built with

React, TypeScript, Vite, IndexedDB, vite-plugin-pwa / Workbox, GitHub Pages, Vitest, axe-core, and Codex. The interface uses original SVG assets and system fonts. New source is MIT licensed; dependencies retain their upstream licenses. See the lockfile for resolved versions.

Individual entry using the entrant's existing public Devpost identity. Consent, award opt-in, and final submission remain the entrant's responsibility.
