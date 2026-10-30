# Entrant walkthrough and judge questions

This explains the planned design. Review it against the actual implementation after the build; revise anything that changes. Reading this file does not itself establish that the entrant has reviewed or understood the project.

## A short explanation

PeerLoop is intended to help a school-club organizer turn skill offers and help requests into possible sessions. It checks skills and availability, suggests useful groups, and explains why they work. It includes three-person exchanges so students can support each other even when a direct two-person swap is not possible.

## Questions to be ready for

**Who operates it?** One organizer on one device. Members do not create accounts. The organizer shares a printed plan and confirms the details with the group.

**How does matching work?** It checks exact subject IDs and shared time windows, enumerates individual help, reciprocal pairs, and three-person loops, then prioritizes the candidates that fulfill more requests without reusing participants. A stable tie-break makes repeated runs predictable.

**Is the result optimal?** No. The planned selection uses a simple greedy method. It produces explainable suggestions and leaves unfulfilled requests visible.

**What is the three-person example?** Noor teaches Python to Lina, Lina teaches design to Sami, and Sami teaches mathematics to Noor. Everyone receives help and contributes a skill during one shared 45-minute block.

**Why store data locally?** It permits a small club to use the tool with no server bill or student account system. The tradeoff is that data does not synchronize across devices. Export and printing support organizer-managed sharing.

**Where is AI used?** Codex assists with development. The planned matching engine uses explicit rules rather than an AI model making recommendations about students. The final answer must reflect what was actually built.

**How was it verified?** Pending. After implementation, point to actual tests for the loop, conflicts, imports, persistence, accessibility, RTL, and measured performance. Do not say a planned check passed.

**Did students benefit?** No study or real deployment has been completed. The example uses fictional students. Describe potential usefulness and the next consent-based validation step, not invented learning or grade improvements.

**What did you do and learn?** Answer from your own experience after reviewing the finished entry. Separate your direction and review from Codex's generated work. You may be asked to open a feature and explain it.

## Ten-minute review after delivery

1. Open the demo and generate the fictional loop.
2. Read the timeline aloud and identify who teaches each subject.
3. Change an availability range and inspect the unresolved request.
4. Save a club file, reload, and explain the local-storage tradeoff.
5. Switch to Arabic and inspect the layout.
6. Read the final AI disclosure and actual verification results.

Record only what you actually reviewed. If a judge asks about something you do not know, say so rather than presenting this guide as personal experience.
