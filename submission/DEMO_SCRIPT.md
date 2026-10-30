# PeerLoop demo — completed video

The final local video is **110 seconds** at 1920 × 1080, H.264 MP4, with readable English captions burned into the picture. A matching UTF-8 SRT is provided. It has no narration, music, face, or live student participation.

- Video: `release-artifacts/video/peerloop-demo.mp4`
- Subtitles: `release-artifacts/video/peerloop-demo.srt`
- Production source and timeline: `release-artifacts/video/build_demo.py` and `timeline.json`
- Capture provenance: `release-artifacts/recording/README.md`
- Hosted player: https://kingslayerthefourth-code.github.io/peerloop/demo/
- Hosted MP4: https://kingslayerthefourth-code.github.io/peerloop/demo/peerloop-demo.mp4

This is an **edited screen-capture walkthrough**, assembled from actual working-application screencast frames and screenshots captured on October 30, 2026. Readable holds, crops, and caption bars are editing choices; it is not continuous real-time footage or a performance benchmark. Its persistent label says “Edited screen captures · fictional data · pauses trimmed.” No application results or student outcomes were fabricated for the video.

## Final timeline

| Time | Actual application material | Caption purpose |
| --- | --- | --- |
| 0–7 s | Empty club | Introduce free peer support. |
| 7–17 s | Fictional example loaded | Identify the demonstration as fictional. |
| 17–28 s | Noor, Sami, and Lina’s profiles | Explain their offers and requests. |
| 28–35 s | Meeting-date control | Explain the availability constraint. |
| 35–43 s | Generated 3/3 plan | Show the three-person result. |
| 43–57 s | Actual loop diagram and timeline | Explain all three teaching turns. |
| 57–65 s | Actual member-edit form with Noor at 18:00–19:00 | Show the time conflict entered into the form. |
| 65–77 s | Actual 1/3 result after a time conflict | Show the remaining requests and explanations. |
| 77–81 s | Replacement confirmation | Show that replacing the club requires consent. |
| 81–91 s | Actual Arabic plan | Show right-to-left presentation. |
| 91–100 s | Actual expanded club-file panel | Explain JSON portability and organizer confirmation. |
| 100–110 s | Original end card with verified project links | Provide demo/source URLs and Codex-assistance credit. |

The video describes printing as an application feature; it does not stage a print-preview capture. The form scene uses an actual additional capture showing the conflicting 18:00–19:00 availability.

## Entrant upload step

The completed video is hosted with the application on free GitHub Pages. Add the player URL as an additional project/demo link. The event accepts websites and other demo evidence and makes a 1–2 minute video optional. If the optional Devpost embedded-video field only accepts YouTube/Vimeo and you want that embed, upload `release-artifacts/video/peerloop-demo.mp4` to your own channel as **Unlisted**, then paste the actual supported watch URL. If YouTube asks you to make audience, rights, or consent declarations, complete those yourself accurately. Open the resulting link in a signed-out browser before submission. Keep the video available through judging.

The October 25 storyboard was pre-event preparation. The screen captures, video, subtitles, and final editing were created during the event on October 30; see the development disclosure.

## Verification

The final MP4 decoded in full with FFmpeg (exit 0), producing 2,640 frames at 24 fps over exactly 110.00 seconds. Representative frames were extracted at eight points across the video; captions and the loop, conflicting-time form, Arabic plan, and end card were inspected. The video is 1,645,367 bytes. Retained evidence is in `release-artifacts/video/VERIFICATION.json` and `decode-verification.log`.
