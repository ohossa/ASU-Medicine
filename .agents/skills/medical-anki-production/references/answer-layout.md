# Answer-side Extra Section standard

Approved 12 November 2026. Apply this to **both Basic and Cloze** cards. It supersedes the Basic-only box and the previous instruction to leave Extra text left-aligned. Main question/answer text keeps the approved left alignment and font; only the Extra contents are centred.

## Required result

- On the answer side, wrap nonempty Extra in a rounded dashed box titled **Extra Section**. Centre the heading, supplementary text and each image. Hide the entire wrapper when Extra is empty.
- Keep Source and any faculty-drug-list label outside this box. Keep Extra off the question side.
- Keep revealed Cloze targets amber/gold with separate accessible light/dark values; preserve the answer-only `cloze-answer` scope, including nested bold/underline/coloured spans. Do not recolour the entire paragraph.
- Use responsive image dimensions and automatic side margins. Small images stay at native size and centre; large images fit the available width without distortion. Do not centre an image by cropping/resampling/rotating source pixels or altering captions. Captions/labels baked into artwork remain source-faithful; centring applies to the HTML container, not re-typesetting image contents.
- This is presentation: do not add headings/markup into note fields, rewrite text, change GUID/model/field/template identities or reset scheduling.

## Shared Extra markup for BOTH back templates

Replace the old bare Extra block, once, with:

```html
{{#Extra}}
<div class="extra extra-box">
  <h3 class="extra-title">Extra Section</h3>
  <div class="extra-content">{{Extra}}</div>
</div>
{{/Extra}}
```

CSS alone cannot create this structural heading/wrapper. A common failure was adding the markup only to Basic while Cloze still rendered `{{Extra}}` directly. Use one shared tail when assembling both templates, and test both actual rendered backs.

The centring rules belong in Styling, outside other rules:

```css
.extra-box .extra-content {
  text-align: center;
}
.extra-box .extra-content img {
  display: block;
  float: none;
  max-width: 100%;
  height: auto;
  margin: 12px auto;
}
```

Keep the existing approved border/title/night-mode rules. Do not set `.card { text-align:center; }` or use a universal `img` selector just to centre Extra. Resolve competing inline alignment through scoped styling and inspect the actual result; do not silently rewrite frozen field content.

## Complete copyable assets

The sibling `../assets/` folder contains the tested current ASU template set:

- [basic-front.html](../assets/basic-front.html)
- [basic-back.html](../assets/basic-back.html)
- [cloze-front.html](../assets/cloze-front.html)
- [cloze-back.html](../assets/cloze-back.html)
- [styling.css](../assets/styling.css)

Basic fields are Front, Back, Extra, Source, FacultyDrugList; Cloze fields are Text, Extra, Source, FacultyDrugList. These assets contain no account scripts or medical facts. For a new compatible model, use them as the starting template. For a released model, preserve its field/schema/template IDs: apply the layout deliberately rather than pasting references to fields it does not have. Do not add FacultyDrugList to an incompatible published model without a tested migration.

The full CSS preserves the system font, 20px/19px responsive sizes and 1.55 line height. Main text is left-aligned; Extra is centred. Current light/dark Cloze values are #8a4b08/#ffd166, title #9a4300/#ffb86b and border #858995/#777982. Text colour contrast must remain at least4.5:1; relevant boundaries at least3:1. Treat these as the user's approved defaults, not a claim that every future custom palette passes.

## Verification before declaring a template ready

Test Basic AND Cloze, each with empty Extra, text plus a small image, and multiple images including a wide one. Use native Anki-generated question/answer HTML. Verify the wrapper/title appears exactly once only on populated backs; Extra text/title and image geometry are centred while main text remains left-aligned. Check loading, proportions, overflow and readable contrast at320/390/1100px in light, nightMode and night_mode. Inspect real screenshots too; do not rely on CSS strings alone.

The module's current builder and all five portable assets must agree; do not fix one copy and leave Cloze or an installed skill stale. Preserve original field/registry/media hashes. For an actual released APKG, also test fresh/repeat/import-update behaviour with established review history, local edits, deck assignments, flags/suspension, IDs and review logs. Refresh Python's model cache after backend imports before judging persisted templates.

For the tested ASU styling-only update route, merge note types, update types Always, update existing notes Never, and omit author learning progress. This intentionally replaces custom CSS for these shared note types. Restore normal note updates afterwards: later text/image/faculty-list updates require them. Reconfirm client options and schema compatibility for each future release; the style-only settings are not instructions for all imports.

Saving this standard does not retroactively alter imported cards or an older APKG. The November11 package had the Basic box only; the generator/assets now cover both types. Part2 authoring is a separate user-requested stage.

For a later rebuild of a shared package, use a new versioned output filename and preserve the published package. Adapt any historical source-specific builder before running it; saving these templates does not authorise overwriting an older release.
