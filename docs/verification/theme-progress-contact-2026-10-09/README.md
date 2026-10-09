# Local student experience refinements — 9 October 2026

## Changes
- Apply saved theme synchronously in the document head, before the first lazy loading boundary. Dark is the default; explicit light remains light; inaccessible storage is safe. Theme provider updates document color scheme and theme-color consistently.
- Rename visible Learning Hub labels to My Progress / تقدمي, preserving routes, stored progress and reward data.
- Footer Contact opens a native modal with WhatsApp and Email choices. Escape, close and backdrop dismissal work; page scrolling is locked while open and restored on close; focus returns to Contact. Links open only when the student chooses a channel.
- Support page language button shows only the globe, with an accessible language label. Personal note covers the IGCSE topic-classified question-bank inspiration and the wish for this resource during early university. Support is explicitly optional and access remains free.

## iPhone Safari background music
The old quiz engine played cloned HTML audio elements. Safari can assign those playback focus, pausing another app. Level-up tones additionally had an independent default-on preference.

Both engines now use one explicit opt-in preference (`asu_feedback_sound_enabled`). Missing preferences and legacy default-on preferences remain silent. Enabling sounds in quiz settings persists opt-in; muting also silences future reward tones. With storage blocked the preference still works for the session.

Before audio initialization, request `navigator.audioSession.type = 'ambient'`, which describes mixable audio in the [Audio Session specification](https://www.w3.org/TR/audio-session/#audio-session-types). Quiz assets are decoded and played through WebAudio rather than HTML media playback. Audio contexts suspend when feedback finishes; download/play failures do not break answering. Reward tones also request mixing and release their idle context.

Older iPhone/iPad browsers without a usable Audio Session API stay silent even when sounds are enabled, preventing background music interruption. Desktop browsers without that API use normal WebAudio. No microphone permissions or external media control is requested.

## Verification
- 569 tests across 98 files passed; production build including TypeScript passed (logs attached).
- Regression tests cover startup theme before module execution, contact channels/dismissal/scroll restoration, silence by default across quiz and reward engines, legacy preference migration, explicit opt-in, ambient session before audio creation, old iPhone fallback, cue playback and context suspension.
- Actual local browser: Contact popup renders both channels and dismisses with Escape; support copy and globe-only button checked. Screenshot attached.
- A real iPhone with Spotify/YouTube is not available to this desktop session. Before releasing, test default silence, opt-in mixing, correct/incorrect answers and a level-up on iPhone Safari while music plays. Automated tests verify code behavior, not the iOS audio mixer.

All changes remain local; nothing committed or pushed.

## Owner-supplied cost breakdown
Hosting $20/month, AI/API $20/month, database approximately $5/month, domain $70/year. Monthly average: $50.833333…, displayed $50.83. EGP estimate uses 52.46 EGP/USD (EgyptRates CBE selling-rate listing checked 9 October 2026; direct CBE page rejected automated access). Conversion uses unrounded domain and total values before display rounding: 2,666.72 EGP/month. Both languages explain annual domain billing, estimates, date and bank fees. No donation totals or progress targets invented. Seven SupportPage tests and production build passed; 320px layout fits without horizontal overflow. Screenshot: monthly-costs.png. Future changes: edit costs.ts amounts and conversion together; update the visible checked date/rate copy in SupportPage.tsx.
