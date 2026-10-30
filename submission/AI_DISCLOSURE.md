# Development and AI disclosure

## Submission disclosure

The entrant approved PeerLoop's product scope, individual-entry approach, $0 budget, and review and submission roles. Codex generated and revised the application code, interface, Arabic strings, tests, and documentation, and carried out build checks, browser verification, and deployment. The entrant's final review and any personal learning are to be described separately after they occur.

Codex also helped with competition research, requirements, interface sketches, verification scenarios, and draft submission material on October 25, 2026, before the event. No application code, executable tests, production assets, deployment, or recording existed at that preparation stage. Application development began on October 30, during the event, after the approved noon Asia/Dubai start.

The shipped matching engine is deterministic. It does not call a runtime generative AI service. Demonstration profiles are fictional and do not represent real students or measured outcomes.

## Contribution record

| Work | Actual contribution | Evidence |
| --- | --- | --- |
| Product direction | The entrant approved the PeerLoop scope, $0 constraint, individual entry, and handoff roles. | Approved plan in the conversation |
| Pre-event preparation | Codex researched the rules and wrote the specification, sketches, verification plan, and submission drafts on October 25. | Retained planning files and dated progress history |
| Application implementation | Codex generated and revised the React, TypeScript, and Vite application, validation, persistence, and matching engine during the event. | First source creation recorded as `2026-10-30T08:17:40.645003+00:00`; `src/` and lockfile |
| Interface and Arabic | Codex produced the interface, original code-native SVGs, English and Arabic strings, and RTL layout. | `src/App.tsx`, `src/i18n.ts`, `src/styles.css`, and actual application captures |
| Verification and fixes | Codex wrote and ran unit tests and build checks, performed browser checks, and fixed form-state, contrast, heading and storage recovery issues found during verification. | `src/*.test.ts`, [verification record](../planning/VERIFICATION.md), and release artifacts |
| Publication | Codex created the public repository and configured GitHub Actions and free GitHub Pages deployment through the connected account. | [Source](https://github.com/kingslayerthefourth-code/peerloop), [live demo](https://kingslayerthefourth-code.github.io/peerloop/) |
| Submission material | Codex drafted and revised the project explanation, disclosure, demo material, and judge guide. | Files in `submission/`; final recording status is tracked in [CHECKLIST.md](CHECKLIST.md) |
| Entrant review and learning | Final review, required consent, award opt-in, and submission are reserved for the entrant. No completed personal learning or usability study is claimed. | Record these only after the entrant completes them |

## Third-party resources

The project uses React, TypeScript, Vite, vite-plugin-pwa / Workbox, IndexedDB browser APIs, GitHub Pages, Vitest, and axe-core. The dependency lockfile records exact resolved packages. Dependencies retain their upstream licenses; new PeerLoop source is MIT licensed. The app uses system fonts and original SVG assets generated as source code, with no stock photographs or purchased media.

Verification used browser automation and developer tooling. Those development tools do not run as an AI service inside the shipped application. No paid API or hosting service was purchased for the project.

## Release boundary

Application source commit `83f352e7a349ffb7525235f1b8c8c2d41ac80201` was published and verified on October 30. Subsequent documentation or release fixes may have a newer commit recorded in the handoff. The October 25 preparation remains part of the record and must be disclosed when used in the entry.

Do not describe generated code as manually written by the entrant, or treat this guide as evidence of review or understanding. No adoption, tutoring results, student feedback, or personal learning has been invented for the submission.
