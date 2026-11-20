# Portable visual evidence bundle

This optional format is for a new extraction/pairing job that lacks an equivalent validator. It is not a required migration of an existing reviewed project. The validator is read-only and requires Python 3.11+ and Pillow in the selected environment. It validates hashes/dimensions and declared evidence; it cannot verify the truth of a reviewer statement or provide image permissions, medical review or APKG testing.

`selection.json` contains `schema_version: 1`, `sources`, `assets`, `expected_note_ids`, `notes`, and `draft`. File paths are absolute or relative to the selection file. SHA-256 values are exact lowercase file digests. IDs within each list must be unique. Use actual evidence, not the illustrative review language below.

- `sources`: every source consumed by the approved bundle, each `{id, path, sha256}`. The broader project page/candidate inventory remains required by the workflow.
- `assets`: approved display assets only. Each has `{id, path, sha256, source_id, source_location, provenance, reuse_status, width, height, first_review}`. Store rejected/uncertain candidates in the separate inventory, not here.
- `source_location`: exact PDF index convention plus printed page/figure, or presentation slide ID/order. Never default unknown origins to page 1.
- `provenance`: how the display file relates to the source: native raster versus composite crop; exact regions/pages, render scale, rotations and authentic stitching, or a path to the full crop manifest. Include required additional source references for stitched multi-source assets. A readable description is required; the validator does not infer geometry.
- `reuse_status`: actual evidence or explicit unresolved status for the intended audience. A nonempty value is not clearance; unresolved permission must be dealt with before a distribution requiring it.
- `first_review`: `{status: "pass", reviewed_sha256, reviewer, reviewed_at, evidence, viewed: true, upright: true, proportions_preserved: true, labels_complete: true, visible_text_checked: true}`. `evidence` should name labels/key/identity actually read and relevant limitations. Flags must reflect an actual view.
- `notes`: one row per expected canonical note: `{id, decision, asset_ids, reason}`. `decision` is `use` with nonempty asset IDs or `no_image` with no asset IDs. Explain exact relevance/partial coverage or specific no-image reason.
- `draft`: `{path, sha256}` for the frozen complete card snapshot: a JSON array of canonical note records, each with a unique string `id`. Its ID set must exactly equal `expected_note_ids`; a subset batch needs its own complete batch snapshot. Appended/pilot notes cannot be silently omitted. For an image library without cards, use `draft: null`, `expected_note_ids: []`, `notes: []`.

`second_review.json` contains:

```json
{
  "status": "pass",
  "selection_sha256": "actual selection.json digest",
  "draft_sha256": "actual frozen draft digest, or null for a library",
  "reviewer": "actual separate reviewer or separate review pass",
  "reviewed_at": "actual timestamp",
  "evidence": "what this pass really checked, including limitations",
  "blocking_findings": [],
  "checked_note_ids": ["all expected IDs including no-image decisions"],
  "checked_assets": [{"id": "asset ID", "sha256": "exact asset digest", "viewed": true}],
  "checked_pairs": [{"note_id": "note ID", "asset_id": "asset ID", "sha256": "exact asset digest"}]
}
```

The checked asset set equals the whole approved display subset; checked pairs equal the complete selected mapping. Hashes cannot be populated until the frozen draft/selection exist. Any changed bytes, draft or pair need the appropriate reinspection and newly bound review. For large projects a delta scheme may retain valid unchanged evidence, but its assembler must verify base/final hashes and exact changed/unchanged sets; this small validator deliberately accepts only the assembled final record.

Run `python3 scripts/verify_visual_bundle.py /path/selection.json /path/second_review.json` from the skill directory. Exit zero/PASS proves only the checks described. `python3 -m unittest discover -s scripts -p 'test_*.py'` runs the synthetic regression cases; test review flags are fixtures, never production visual evidence.
