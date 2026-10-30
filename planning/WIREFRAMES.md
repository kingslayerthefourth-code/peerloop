# Interface sketches

Pre-event sketches dated October 25, 2026. These are proposed layouts, not implemented screens. Disclose them as preparation if carried into the final design.

## Members — desktop

```text
PeerLoop                                  English | العربية
Members                  Session plan                 About

Make room for everyone to help.
Arrange a free skill exchange for your next club meeting.

[Try fictional example]       [Load club] [Save club]

MEMBERS                                      [Add member]
Alias        Can help with       Needs help with       Edit
Noor         Python              Mathematics            ...
Sami         Mathematics         Design                 ...
Lina         Design              Python                 ...

Next meeting [date]      Times shown in [Asia/Dubai]
                                      [Suggest sessions]
```

## Session plan — desktop

```text
Session plan                         [Edit members] [Print]
Fictional example — not real students or measured results

3 requests connected • 1 suggested group

THREE-PERSON EXCHANGE                     16:00–16:45
                Noor
      Mathematics ↑  ↓ Python
                Sami ← Lina
                    Design

16:00–16:15  Noor helps Lina with Python
16:15–16:30  Lina helps Sami with Design
16:30–16:45  Sami helps Noor with Mathematics

Why this works
Each member can help another. All three are free for the block.

Unresolved requests
No unresolved requests in this fictional example.

These are suggestions. Confirm the plan with your group.
```

The arrows must represent the listed teaching directions. The timeline is the authoritative accessible explanation; do not rely on the diagram alone.

## Add/edit member

Use a labelled form or accessible dialog with alias, checkbox subject choices for offered skills, a requested-subject selector, and editable weekday/start/end rows. Show errors next to the relevant controls and keep entered values after an error. Put Cancel before Save in logical navigation order. Restore focus to the triggering button on close.

## Mobile

Stack the header, navigation, explanation, and primary action. Render members as cards with explicit Can help / Needs help labels. Use full-width form controls. Show exchange participants and teaching steps vertically. Keep import/export in a small, labelled secondary area. Printing excludes navigation and edit controls.

## Arabic

Set the document language to `ar` and direction to `rtl`. Mirror layout using CSS logical properties. Preserve chronological teaching order and unambiguous times. Keep aliases as entered, translate subject labels, and provide Arabic equivalents for all statuses, errors, instructions, and print labels. A language toggle must be operable by keyboard and retain the current view and data.

## Empty and failure states

- No members: explain how to start and offer the fictional example separately.
- No matching helper: show the unresolved subject and explain that another skill offer is needed.
- No compatible time: retain the request and suggest reviewing availability.
- Storage unavailable: state that the current session is temporary and recommend file export.
- Invalid import: identify the problem without replacing current data.
