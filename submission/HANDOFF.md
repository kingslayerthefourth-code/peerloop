# PeerLoop review and submission handoff

Prepared October 30, 2026. The application, source, screenshots, video, project text and judge guide are ready for entrant review. **The Devpost entry has not been submitted.**

## Open these

| Item | Link |
| --- | --- |
| Working application | https://kingslayerthefourth-code.github.io/peerloop/ |
| Source repository | https://github.com/kingslayerthefourth-code/peerloop |
| Captioned 110-second demo | https://kingslayerthefourth-code.github.io/peerloop/demo/ |
| Download MP4 | https://kingslayerthefourth-code.github.io/peerloop/demo/peerloop-demo.mp4 |
| Download subtitles | https://kingslayerthefourth-code.github.io/peerloop/demo/peerloop-demo.srt |
| Desktop screenshot | https://kingslayerthefourth-code.github.io/peerloop/screenshots/english-plan.png |
| Arabic screenshot | https://kingslayerthefourth-code.github.io/peerloop/screenshots/arabic-plan.png |
| Mobile screenshot | https://kingslayerthefourth-code.github.io/peerloop/screenshots/mobile-plan.png |
| Event | https://csc-winter-sparkathon.devpost.com/ |

The completed source revision and CI receipt are retained locally in `release-artifacts/RELEASE.json`; source and checks are also visible through the repository history and Actions tab. Pre-event preparation remains recorded and disclosed.

## Review, then submit

1. Open the app, choose **Try fictional example**, and generate the plan. Read the three teaching steps; edit an availability range and see the unresolved requests. Review [the judge guide](JUDGE_GUIDE.md) so you can explain the choices yourself.
2. Review [the project copy](DEVPOST_DRAFT.md) and [AI disclosure](AI_DISCLOSURE.md). Replace the personal-learning placeholder only with what you actually learned or reviewed. The actual division is your product direction and constraints, with Codex implementation, verification and preparation; do not claim generated code as your own manual coding.
3. Join the event using your existing Devpost identity and complete any required consent yourself, with guardian support if required. Verify your existing eligibility information is accurate.
4. Add the project name **PeerLoop**, tagline, explanation, tools, individual team identity, source/demo links, and screenshots. Add the hosted video-page URL as an additional project/demo link. The event accepts websites, screenshots and other demo evidence; a 1–2 minute video is encouraged and optional.
5. If Devpost's optional embedded-video field accepts only YouTube/Vimeo, leave that field empty and retain the hosted demo link, or upload the MP4 to your own account as an unlisted video and paste the resulting supported link. No YouTube/Vimeo publication has been claimed.
6. Review and explicitly opt in to CSC award consideration. This includes permission for CSC to feature the project; the entrant must make that choice personally.
7. Open all links while signed out, then click **Submit** and verify Devpost shows **Submitted**. Save the confirmation URL and screenshot. Keep judging links available.

Aim to submit **November 28, 2026 at 8 p.m. Asia/Dubai**. The header/schedule and rules still disagree by twelve hours; use **November 30 at noon Asia/Dubai** as the earlier operational cutoff. Recheck the [rules](https://csc-winter-sparkathon.devpost.com/rules) when submitting.

## What was verified

Strict TypeScript, 26 tests and production build passed. The final 30-member/eight-window fixture took 446.54 ms locally. Core browser flows, mobile widths, English/Arabic, storage after reload, selected keyboard flows, print styling, export and offline generation were checked. Selected axe views reported zero violations. See [the exact verification record](../planning/VERIFICATION.md), including its limits.

Chrome file chooser automation could not be verified with local file access disabled. Both import failure preservation and confirmed valid replacement are tested through the real React handler and parser in jsdom. You can keep browser file access disabled; no permission change is required to review or submit the hosted links.

## Local package

- `release-artifacts/video/peerloop-demo.mp4` and `.srt`: final media.
- `release-artifacts/screenshots/`: actual captures, including the printable plan and conflict.
- `release-artifacts/checks.txt`: command output.
- `release-artifacts/video/VERIFICATION.json`: duration, full decode, checksum and provenance.
- `public/demo/`: the same small final video and its free hosted player page.

New spending: **$0**. Winning is uncertain; the entry has not been registered or submitted by Codex.
