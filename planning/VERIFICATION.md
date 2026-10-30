# Verification plan

Prepared October 25, 2026. **None of the application checks below has run.** Write executable tests during the event alongside the implementation. Record actual commands, results, browser versions, timing measurements, and final commit SHA in this file when verified.

## Matching and data tests

| Case | Expected result |
| --- | --- |
| Fictional three-person fixture | One valid 45-minute loop fulfills three requests; every teaching edge is correct. |
| Reciprocal pair | Two requests fulfilled in a 30-minute block. |
| One-way pair | One request fulfilled in 15 minutes; the helper's own unmet request remains visible. |
| Only 14 minutes overlap | No suggested session; insufficient-time explanation. |
| 15 minutes but not 30/45 | One-way candidates allowed; reciprocal/loop candidates rejected. |
| Different weekdays or disjoint windows | No incompatible match. |
| Multiple availability windows | Earliest qualifying intersection selected. |
| Competing candidates | No person assigned twice; deterministic prioritization. |
| Input order changes | Stable IDs produce the same result. |
| Self-help | Never selected. |
| Missing helper | Request remains visible with the correct reason. |
| Thirty profiles with eight windows each | Generation completes in under one second; record fixture and measured duration. |
| Duplicate alias with case/whitespace changes | Inline error; no extra profile saved. |
| Arabic aliases | Saved and displayed intact. |
| Invalid or overnight range | Rejected without losing form input. |

## Import, persistence, and offline

- Export then import into an empty club preserves all v1 data, including IDs and time zone.
- Wrong format/version, duplicate IDs/aliases, invalid topics/times, unknown fields, oversized files, or more than 30 profiles leave the current club unchanged.
- Replacing a non-empty club and clearing data each require explicit confirmation.
- Reload restores profiles and selected language. A changed member invalidates the previous plan.
- Denied or failed storage produces an accurate warning and retains working export.
- After loading once, disconnect the network and verify CRUD, matching, JSON export, and the print view.
- First-ever offline visits show an honest unavailable state where possible, not a fabricated successful load.

## Browser checks

Use meaningful engine/validation unit tests and end-to-end browser tests. Plan to use Vitest and Playwright; resolve compatible versions during the event and retain the lockfile.

- Complete add/edit/delete, generate, export, import, and language-switch flows.
- Check 320px, 390px, and desktop widths for clipping and reachable controls.
- Complete the main flow by keyboard; check focus return, Escape, labels, errors, and status announcements.
- Check Arabic RTL in forms, result timelines, dialogs, and printing.
- Run automated accessibility checks and inspect contrast, zoom, and the plain-text diagram equivalent manually.
- Confirm reduced-motion settings suppress decorative movement.
- Verify the GitHub Pages project path and refresh behavior in a fresh, signed-out browser context.
- Confirm there are no external runtime API requests, credentials, private student records, paid services, or broken third-party assets.

## Release evidence

At completion, retain the reproducible source commit, passing check output, measured performance, representative screenshots, actual demo video, public URLs, and a clean signed-out review. Do not call a screenshot a tested flow, a storyboard a demo, or a planned URL a deployed site.

| Evidence | Current status |
| --- | --- |
| Application build | Not started |
| Unit and browser tests | Not started |
| Accessibility and RTL checks | Not started |
| Performance measurement | Not measured |
| Public repository and Pages | Not created |
| Demo recording | Not recorded |
| Submission | Not submitted |
