# Entrant walkthrough and judge questions

This guide describes the working October 30 release. It supports your review; reading it does not establish that you have reviewed or understood the project.

## A short explanation

PeerLoop helps a school-club organizer turn skill offers and help requests into suggested sessions. It checks subjects and shared availability and explains every teaching step. Three-person exchanges let students support each other when a direct two-person swap cannot connect them.

## Five-minute demonstration

1. Open the [live demo](https://kingslayerthefourth-code.github.io/peerloop/). Choose **Try fictional example**. If a club already exists, save its file before confirming replacement.
2. Inspect Noor, Sami, and Lina. Noor offers Python and needs mathematics; Sami offers mathematics and needs design; Lina offers design and needs Python. The example uses today's weekday, with all three available from 16:00 to 17:00.
3. Choose **Suggest sessions**. The plan fulfills three requests in a 16:00–16:45 loop: Lina teaches design to Sami, Sami teaches mathematics to Noor, and Noor teaches Python to Lina.
4. Return to **Members**, edit Noor's time to 18:00–19:00, and save. Generate fresh suggestions. Lina can still help Sami, while the other requests show that their helpers lack shared time.
5. Restore the fictional example and generate again. Switch to Arabic. The plan remains, and the layout and subject labels change; entered aliases stay intact.
6. Return to English. Use **Print session plan** to inspect the printable plan. In **Members**, expand **Your club file** to save or load JSON. Reload the page to see the profiles restored; generate a fresh plan afterward.

These are fictional records. Confirm any real plan with the participants before treating it as an arrangement.

## Questions to be ready for

**Who operates it?** One organizer on one device. Members do not create accounts. The organizer confirms sessions outside the app and shares a printed plan or club file deliberately.

**How does matching work?** It checks exact subject IDs and shared time windows for the selected meeting day. One-way help needs 15 minutes, a reciprocal pair needs 30 minutes, and a three-person loop needs 45 minutes. Every member must be available for the full group block. Candidates that fulfill more requests come first, followed by earlier start times and a stable identifier tie-break. The engine selects groups without using a person twice.

**Is the result optimal?** No. Selection uses a greedy method. A locally attractive group can prevent a better combination of groups. The app presents suggestions and leaves unresolved requests visible so an organizer can review the tradeoff.

**What makes the three-person example useful?** No direct reciprocal pair exists among the three profiles. The loop connects three different offers and requests in one shared block, with one teaching turn per person.

**What happens when matching fails?** The app distinguishes a missing helper, insufficient shared time, and a compatible helper already assigned elsewhere. A person who helps in a one-way session may still have an unmet request.

**Where does the data go?** Profiles and display language are saved in IndexedDB on the organizer's device. Club records are not sent to an application server. Exported JSON contains aliases, skills, and availability, so the organizer controls who receives it. The static hosting provider still receives ordinary site requests.

**Can it work offline?** A service worker caches application assets after an online visit. Offline reload and matching were verified. Offline availability depends on the browser keeping that cache. A first visit still needs a network connection.

**What does import accept?** A UTF-8 JSON file with format `peerloop`, version `1`, a time zone, and profiles. The app validates the complete file before replacing data. It rejects unknown fields, duplicate IDs or aliases, invalid subjects and times, files over 256 KiB, and more than 30 profiles. A non-empty club requires replacement confirmation.

**Where is AI used?** Codex assisted with development: application code, design, translations, tests, verification, deployment, and documentation. The app's matching decisions use explicit rules and have no runtime AI service. Pre-event research and specification work from October 25 are disclosed.

**What did you contribute?** You approved the scope, $0 budget, individual-entry approach, and review and submission roles. Add only review, changes, testing, or learning that you actually complete. Do not claim Codex-generated implementation as your own manual coding.

**How was it verified?** TypeScript checks, 26 tests, and the production build passed. The tests cover loops, reciprocal and one-way sessions, time conflicts, deterministic ordering, and data validation. A dense 30-member/eight-window fixture measured 446.54 ms on the development machine. Browser checks covered key profile flows, persistence, Arabic, focus return, and narrow layouts. Axe reported zero violations in the English and Arabic plan views; that is a bounded automated result, not a guarantee of complete accessibility. See [VERIFICATION.md](../planning/VERIFICATION.md) for the full record and remaining checks.

**Did students benefit?** No real-student trial or outcome study has been conducted. The deployed demo is a working prototype with fictional records. Its potential benefit is easier organization of free peer support; improved grades or learning have not been measured.

**What are its limits?** Six fixed subjects, one request per member, at most 30 members, and one organizer's browser. It does not synchronize devices, send messages, evaluate tutoring ability, or book a session. Availability uses the club's displayed time zone.

## Source map for review

| File | What to inspect |
| --- | --- |
| `src/model.ts` | Club types, validation, dates, and fictional profiles |
| `src/matching.ts` | Candidate enumeration, shared time, ranking, and unresolved reasons |
| `src/storage.ts` | IndexedDB persistence |
| `src/App.tsx` | Profile forms, file import/export, dialogs, and plan rendering |
| `src/i18n.ts` | English and Arabic interface strings |
| `src/styles.css` | Responsive, RTL, focus, and print layouts |
| `src/*.test.ts` | Executable matching and validation cases |

Before submission, open the demo yourself, inspect the code paths you want to discuss, and write your own account of what you learned. If a judge asks about something you do not understand, say so.
