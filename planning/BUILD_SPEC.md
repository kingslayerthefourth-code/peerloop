# PeerLoop build specification

Prepared October 25, 2026. This is a pre-event specification, not application source. Begin implementation no earlier than October 30, 2026, noon Asia/Dubai.

## Outcome

A school-club organizer can enter members' skills, requests, and availability, then produce an understandable plan for free help sessions. The demonstration must show a useful three-person exchange where a direct reciprocal pair is impossible.

The organizer operates one browser. Plans are shared through printing or file export. Data does not synchronize across devices. Participants do not create accounts or communicate through PeerLoop.

## Product decisions

- Use React, TypeScript, and Vite; a static GitHub Pages deployment; browser IndexedDB persistence; no backend or external runtime API.
- Use a single page with Members, Session plan, and About views. Use hash navigation so refreshing a GitHub Pages project URL works.
- Offer English and Arabic, with full right-to-left layout in Arabic. Localize interface text and subject labels; leave user-entered aliases untouched.
- Build an installable application with local assets and an offline shell. After the first successful visit, CRUD, matching, export, and printing must work without a network connection.
- Use the existing local workspace. Create the application and dependency lockfile during the event. Use a new public `peerloop` repository under the connected GitHub account if that name is available; otherwise use `peerloop-csc-2026`. Do not reuse an unrelated repository.
- Use GitHub Actions to run checks and deploy to Pages. Use the repository's actual project path as Vite's base. No domain purchase, paid service, card requirement, or OpenAI API key.
- License new source under MIT and credit dependencies. Do not include private account eligibility details in the public repository.

## Organizer flow

1. On a first visit show an empty club, a short explanation, and a separate **Try fictional example** action. Never silently create example members in a real club.
2. The organizer adds a profile with an alias, one to three offered subjects, one requested subject, and at least one available weekday/time range.
3. The organizer chooses the date for the next club meeting and generates suggestions. Show the club's time zone prominently; default to Asia/Dubai.
4. Display suggested sessions, the skills exchanged, start/end times, explanations, and unresolved requests. The organizer confirms details outside the app.
5. The organizer can print the plan or download the club file. Profile editing invalidates the generated plan until it is generated again.

Changing the display language does not invalidate a plan. Reloading restores the last saved club and language. Restored plans must be regenerated from current data rather than trusting an imported result.

## Profiles and availability

- Generate stable random IDs when creating profiles. Compare trimmed aliases case-insensitively and reject duplicates with an inline error. Do not silently merge or rename people.
- Alias: 1–40 characters. Accept Unicode, including Arabic. Render all user text as text, never HTML.
- Subject IDs: `python`, `mathematics`, `design`, `english`, `arabic`, and `physics`. English/Arabic translations are presentation labels for the same IDs.
- Each profile has one requested subject and at least one offered subject. Requesting a skill that the person also offers is allowed, but the matcher never assigns self-help.
- Availability uses ISO weekdays (1–7) and local 24-hour `HH:mm` boundaries in the club's IANA time zone. Start must precede end on the same day. Reject overnight and overlapping windows within a profile. A 15-minute overlap is the minimum for any session.
- Limit a club to 30 profiles and eight availability windows per person. Explain limits before rejecting input. No email, age, school name, contact details, grades, or sensitive free-text notes are collected.
- The meeting date must be valid, today or later, and within the following 90 days. Offer a clearly labelled demonstration date for the fictional example.

## Matching behavior

Match exact subject IDs and compatible availability. Do not invent skill proficiency, translate user text with an API, or infer personal characteristics.

Enumerate candidates for the selected meeting date:

- **One-way pair:** A offers B's requested subject; reserve 15 continuous minutes for both.
- **Reciprocal pair:** A offers B's requested subject and B offers A's; reserve 30 continuous minutes, with one 15-minute turn in each direction.
- **Three-person loop:** A teaches B, B teaches C, and C teaches A; reserve 45 continuous minutes and schedule the three 15-minute turns in that order. All three must be available for the full block so the result is one coherent club activity.

For each distinct candidate choose the earliest qualifying interval, intersecting the members' windows on the chosen weekday. Generate rotations of the same loop only once. Opposite teaching directions are separate candidates if both are valid.

Rank candidates by: (1) number of requests fulfilled, descending; (2) earliest start; (3) stable participant IDs and directed teaching edges, lexicographically. Greedily select candidates whose participants have not already been selected. Each person appears in at most one session block in a generated plan. This deliberately simple heuristic is deterministic; do not describe it as globally optimal.

Explain selected candidates using the exact subjects, teaching directions, common window, and fulfilled-request count. For each unfulfilled request, distinguish no other matching helper, insufficient common time, and a compatible helper already assigned elsewhere. A person who teaches in a one-way pair may still have an unresolved request.

Never auto-generate a calendar invite, contact a member, or treat a suggestion as a booked session. Include printable wording that the organizer should confirm with participants.

## Public file interface

The only portable data interface is a UTF-8 JSON club file with `format: "peerloop"`, `version: 1`, an IANA `timeZone`, and a `profiles` array. Profiles contain `id`, `alias`, `offers`, `request`, and `availability`. Each availability item contains `weekday`, `start`, and `end`.

Do not export generated plans as authoritative source data. A separate printable plan can show the chosen meeting date and suggestions. The JSON filename is `peerloop-club-YYYY-MM-DD.json`.

Validate the complete import before touching existing data. Reject unsupported versions, duplicate IDs/aliases, invalid subjects, unknown structural fields, oversized files over 256 KiB, missing fields, invalid times, and excess records. Show a useful error and retain the previous club. A valid import uses an explicit confirmation before replacing an existing non-empty club; an empty club can import directly. Preserve IDs during a round trip. Changes are persisted only after successful validation.

Store only data owned by the app under a versioned IndexedDB database. A reset action affects only PeerLoop data and requires confirmation. Handle unavailable storage with a visible temporary-session warning and working file export; never claim a failed save succeeded.

## Fictional demonstration

Create the actual demo fixture during the event, based on this pre-event storyboard:

| Alias | Offers | Requests | Shared availability |
| --- | --- | --- | --- |
| Noor | Python | Mathematics | Same selected weekday, 16:00–17:00 |
| Sami | Mathematics | Design | Same selected weekday, 16:00–17:00 |
| Lina | Design | Python | Same selected weekday, 16:00–17:00 |

Expected result: one 16:00–16:45 loop, with Noor teaching Python to Lina, Lina teaching Design to Sami, and Sami teaching Mathematics to Noor. The exact list can rotate without changing those edges. Display **Fictional example — not real students or measured results** throughout example mode and in the video.

The example button asks before replacing a non-empty club. Exiting example mode does not blend example records into real data.

## Presentation

Use a calm light interface with warm paper, dark ink, and teal as the primary action color. Draw simple loop and subject illustrations with code-native SVG during the event. Use local/system fonts and original assets. Color must not carry meaning alone.

The plan view is the visual centerpiece: clear arrows between members, subject labels, a timeline, and a readable explanation. On small screens use a vertical sequence instead of squeezing a desktop graph. Include a plain text equivalent for assistive technology and printing.

Use semantic forms, visible focus, focus restoration after dialogs, Escape to dismiss, inline validation tied to controls, polite status announcements, and sufficient text contrast. Avoid drag-only controls, rapid animation, and unnecessary modal steps. Respect reduced-motion settings.

## Implementation order and completion

1. At the build start, recheck event rules and dates; record the first source-code timestamp in the progress log.
2. Scaffold the application, establish types and bilingual strings, and implement input validation and persistence.
3. Implement and test the pure matching engine before wiring it into the plan view.
4. Complete profile editing, import/export, fictional mode, plan explanations, printing, and offline support.
5. Run the verification plan. Fix concrete failures before broadening scope.
6. Publish the source and Pages deployment, verify both signed out, record actual URLs and commit SHA.
7. Capture the actual application and produce the video, screenshots, disclosures, and final handoff. Replace draft claims with measured evidence and mark any missing output plainly.

Keep analytics, payments, multi-device synchronization, tutoring chat, runtime generative AI, real student recruitment, and additional competition entries outside v1.
