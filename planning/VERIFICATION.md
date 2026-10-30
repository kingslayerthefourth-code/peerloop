# Verification record

The verification cases were prepared October 25, 2026. Application checks below were performed October 30, during the event. This file replaces the pre-event pending checklist with actual results; the preparation remains disclosed in the progress log.

## Automated checks

Strict TypeScript, all **26 tests across three files**, and the production/PWA build passed. Reproduce with Node.js 22+ and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

[Recorded output](evidence/checks.txt) preserves the local commands and results. The three files cover:

- Ten model cases: versioned JSON round trips including Arabic aliases; duplicate normalized aliases and IDs; structural fields; subjects, time zones, file/record limits; overlapping or invalid times; dates; failed validation preserving input.
- Eleven matching cases: the fictional loop, reciprocal and one-way help, 14/15-minute boundary, earliest compatible window, adjacent windows and real gaps, unique assignments, stable ordering, different weekdays, missing/assigned helpers, and the dense fixture.
- Five React DOM integration cases: a failed read never autosaves an empty club; explicit replacement after a read failure; pending and failed queued writes retain accurate status; an invalid imported file preserves the club without saving; a valid import waits for confirmation and preserves IDs, Arabic aliases, and time zone.

The DOM tests use jsdom, real React handlers and the real club parser. File.text and native dialog methods are supplied by the test harness. These are not a claim that Chrome's native file chooser was tested successfully.

The final local dense fixture (30 members, eight availability windows each) took **446.54 ms**, below one second on this development Mac. Earlier runs ranged from 222.30 to 357.04 ms. This is a synthetic fixture measurement, not a universal device guarantee or browser benchmark.

## Browser verification

Performed through the connected Chrome browser and a separate in-app browser, using fictional data:

| Flow | Observed result |
| --- | --- |
| Empty first visit | No profiles created silently; example is a separate action. |
| Fictional example | One 16:00–16:45 loop; Lina teaches design to Sami, Sami teaches mathematics to Noor, Noor teaches Python to Lina; 3/3 fulfilled. |
| Profile creation, duplicate, deletion | New profile saved; normalized duplicate Noor rejected; confirmed deletion removed the test profile. |
| Changed availability | Noor at 18:00–19:00 produced only Lina→Sami at 16:00–16:15; the other requests retained an insufficient-time explanation. |
| Persistence and example label | Reload restored the club, language and fictional label; plans were regenerated from saved inputs. |
| English / Arabic | Language switch retained suggestions, changed labels and RTL layout; aliases retained. Arabic edit form inspected. |
| Keyboard | Enter activated generation and language/form controls; Escape dismissed the modal and restored Edit Noor focus. |
| 390px / 320px | Final plan document width equalled viewport width (390/390 and 320/320); vertical exchange and reachable controls. Earlier member view also checked. |
| JSON export | Save club downloaded a real file; parsed format peerloop, version 1, three expected profiles. |
| Native JSON import | Chrome upload automation was unavailable because file access permission was disabled. No success is claimed for that browser chooser. Import behavior is covered by the DOM tests above. |
| Printing | Print media view showed the date, time zone, teaching timeline, explanation, unresolved section and fictional label, without navigation/buttons. Captured and inspected. Native print output was not sent to a physical printer. |
| Offline | After online installation, network-offline reload restored three members and suggestion generation worked with navigator.onLine false. Offline first-ever visit and every platform/browser are not claimed. |
| Public links | Public repository and deployed project-path app opened in a separate signed-out browser; example generation worked. Final release URLs are recorded in the handoff. |

## Accessibility

axe-core found contrast and heading-order issues during development. The fixes were verified on a fresh production origin to avoid the earlier offline cache. Recorded checks using WCAG 2 A/AA, WCAG 2.1 AA and best-practice tags:

| View | Pass rules | Violations |
| --- | --- | --- |
| English members | 38 | 0 |
| English profile form | 26 | 0 |
| English plan | 34 | 0 |
| Arabic profile form | 26 | 0 |
| Arabic plan | 34 | 0 |

Reports are in [evidence/](evidence/). These automated checks and selected keyboard checks do not establish full accessibility or a screen-reader audit. The diagram has a text timeline equivalent. CSS limits decorative transitions to users who have not requested reduced motion. No Arabic native-speaker usability review or real-club study is claimed.

## Publication and media

- [Public repository](https://github.com/kingslayerthefourth-code/peerloop)
- [Working application](https://kingslayerthefourth-code.github.io/peerloop/)
- [110-second captioned demo](https://kingslayerthefourth-code.github.io/peerloop/demo/)
- [GitHub Actions](https://github.com/kingslayerthefourth-code/peerloop/actions)
- [Desktop](../public/screenshots/english-plan.png), [Arabic](../public/screenshots/arabic-plan.png), [mobile](../public/screenshots/mobile-plan.png) captures from the actual application.

The video is H.264, 1920×1080, 24 fps, exactly 110 seconds and 2,640 decoded frames. Full decode exited 0; representative encoded frames were inspected. It has burned English captions and downloadable SRT/WebVTT captions. It is an edited guided demo assembled from actual captured screens, with readable still holds and crops, rather than continuous real-time footage. All demonstration data is fictional. See [media verification](evidence/video.json) and [recording notes](../submission/DEMO_SCRIPT.md).

The standalone demo route is excluded from the application navigation fallback; a controlling service worker was updated locally and the /demo/ page loaded the real player with duration 110 seconds and playback advancing.

The first published application commit was 83f352e7a349ffb7525235f1b8c8c2d41ac80201. The completed release adds persistence fixes, adjacent-window handling, extra tests, media and documentation. The exact completed release SHA and CI result are recorded in the local release handoff after publication.

## Remaining entrant actions and limits

The entrant reviews and explains the work, completes required consent and award opt-in, and submits personally. No Devpost submission has been made. No users, feedback, personal learning or improvements in student outcomes have been invented. Browser-native file importing remains an explicitly unverified check; the real handler is covered by automated integration tests. No paid service or runtime AI API was introduced.
