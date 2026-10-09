# History, Case Solver and GIT marks — 8 October 2026

## Delivered
- History now navigates to the matching year/module quiz route after rebuilding saved results. Returning from historical results navigates back to `/history`, including the missed-practice subset.
- Ten missing Case Solver files replaced by original local SVG educational reference illustrations. Existing three images retained. References use `contain` to prevent cropping. Fallback no longer leaks the diagnosis; keyed image and fallback DOM reset when switching cases. No GIT question-bank media was added.
- GIT official preset: 34 assessment 1 + 34 assessment 2 + 58 computer lab + 20 real lab + 10 activities + 36 final paper 1 + 68 final paper 2 = 260, 13 CP. Activities confirmed directly by the user.
- A ≥221; B ≥195; C ≥169; D ≥156. Both overall ≥156 and combined final ≥41.6/104 are required. Final papers are counted once. Blank final inputs remain pending. Invalid marks show errors. Cached old preset definitions resolve to the current official configuration.

## Verification
- 42 test files / 296 tests pass; production build passes on Node 24.
- Browser: reproduced the dead history button before the fix; after the fix opened the saved 3/21 result and returned to History. Opened missed practice 4/18 result with exactly 18 questions.
- Browser: GIT displays seven inputs and 260 total with independent final gate; screenshot included.
- All 13 referenced local case assets exist. Parkinson reference tested through actual Case Solver rendering, error fallback, and browser image rendering. Browser confirmed the existing DKA reference loads with natural width >0.
- Strict application TypeScript check remains blocked by pre-existing diagnostics; see types.txt and type-delta.txt. Tests and build passing do not imply that the whole repository is type-clean.
- No Git push or production deployment performed. Local preview: http://127.0.0.1:5183/.

## Reference image scope
The ten new assets are original schematic teaching illustrations, not real patient scans, measured waveforms, or diagnostic evidence. They are explicitly labelled and have no external image dependency. Regenerate them from the repository root with `python3 scripts/generate-case-references.py`.

Clinical reference context:
- NINDS explains that DaT imaging can support diagnosis but cannot distinguish Parkinson disease from atypical parkinsonism: https://www.ninds.nih.gov/current-research/focus-disorders/parkinsons-disease-research/parkinsons-disease-challenges-progress-and-promise
- NEI describes retinal detachment as separation from the normal position: https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment
These sources inform the teaching context; the illustrations are not copied from them. Existing case medical answer text was not revised during this UI task.
