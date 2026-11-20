#!/usr/bin/env python3
"""Read-only evidence validation. Does not perform medical or visual review."""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def unique(values, label):
    require(isinstance(values, list), f'{label}: expected list')
    require(all(nonempty(x) for x in values), f'{label}: empty/non-string ID')
    require(len(values) == len(set(values)), f'{label}: duplicate ID')
    return set(values)


def indexed(rows, label):
    require(isinstance(rows, list), f'{label}: expected list')
    unique([r['id'] for r in rows], label)
    return {row['id']: row for row in rows}


def verify_bundle(selection_path, review_path):
    selection_path, review_path = Path(selection_path), Path(review_path)
    selection = json.loads(selection_path.read_text())
    review = json.loads(review_path.read_text())
    base = selection_path.parent

    def checked_file(row):
        require(nonempty(row.get('path')), 'missing file path')
        path = base / row['path']
        require(path.is_file(), f'missing file: {path}')
        require(sha256(path) == row.get('sha256'), f'hash mismatch: {path}')
        return path

    require(selection.get('schema_version') == 1, 'unsupported bundle schema')
    sources = indexed(selection['sources'], 'sources')
    for source in sources.values():
        checked_file(source)
    assets = indexed(selection['assets'], 'assets')
    for asset in assets.values():
        path = checked_file(asset)
        require(asset['source_id'] in sources, f'unknown source: {asset["id"]}')
        require(nonempty(asset.get('source_location')), f'missing source location: {asset["id"]}')
        require(nonempty(asset.get('provenance')), f'missing provenance: {asset["id"]}')
        require(nonempty(asset.get('reuse_status')), f'missing reuse status: {asset["id"]}')
        with Image.open(path) as image:
            image.load()
            require([image.width, image.height] == [asset.get('width'), asset.get('height')],
                    f'dimensions mismatch: {asset["id"]}')
        check = asset['first_review']
        require(check.get('status') == 'pass' and check.get('reviewed_sha256') == asset['sha256'],
                f'incomplete/stale asset review: {asset["id"]}')
        for key in ['reviewer', 'reviewed_at', 'evidence']:
            require(nonempty(check.get(key)), f'missing {key}: {asset["id"]}')
        for key in ['viewed', 'upright', 'proportions_preserved', 'labels_complete', 'visible_text_checked']:
            require(check.get(key) is True, f'unaccepted {key}: {asset["id"]}')

    expected = unique(selection['expected_note_ids'], 'expected notes')
    notes = indexed(selection['notes'], 'notes')
    require(set(notes) == expected, 'selection note coverage mismatch')
    draft = selection.get('draft')
    if expected:
        require(isinstance(draft, dict), 'card pairing requires a draft snapshot')
    if draft is not None:
        draft_path = checked_file(draft)
        draft_notes = indexed(json.loads(draft_path.read_text()), 'draft notes')
        require(set(draft_notes) == expected, 'draft note coverage mismatch')
    pairs = set()
    for note in notes.values():
        asset_ids = unique(note['asset_ids'], f'{note["id"]} assets')
        require(asset_ids <= set(assets), f'unknown pairing asset: {note["id"]}')
        require(nonempty(note.get('reason')), f'missing relevance/no-image reason: {note["id"]}')
        require(note.get('decision') == ('use' if asset_ids else 'no_image'),
                f'inconsistent pairing decision: {note["id"]}')
        pairs.update((note['id'], aid, assets[aid]['sha256']) for aid in asset_ids)

    require(review.get('status') == 'pass', 'second review did not pass')
    require(review.get('blocking_findings') == [], 'unresolved/missing blocking findings')
    require(review.get('selection_sha256') == sha256(selection_path), 'stale selection review')
    require(review.get('draft_sha256') == (draft['sha256'] if draft else None), 'stale draft review')
    for key in ['reviewer', 'reviewed_at', 'evidence']:
        require(nonempty(review.get(key)), f'missing second-review {key}')
    require(unique(review['checked_note_ids'], 'reviewed notes') == expected, 'second-review note coverage mismatch')
    asset_reviews = indexed(review['checked_assets'], 'second-review assets')
    require(set(asset_reviews) == set(assets), 'second-review asset coverage mismatch')
    for aid, row in asset_reviews.items():
        require(row.get('sha256') == assets[aid]['sha256'] and row.get('viewed') is True,
                f'stale/unviewed second-review asset: {aid}')
    checked_pairs = [(r['note_id'], r['asset_id'], r['sha256']) for r in review['checked_pairs']]
    require(len(checked_pairs) == len(set(checked_pairs)), 'duplicate second-review pair')
    require(set(checked_pairs) == pairs, 'second-review pair coverage mismatch')
    return {'status': 'PASS', 'sources': len(sources), 'assets': len(assets),
            'notes': len(notes), 'pairs': len(pairs),
            'scope': 'Declared evidence, file hashes and dimensions only; not medical/visual or permissions adjudication.'}


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: verify_visual_bundle.py SELECTION.json SECOND_REVIEW.json')
    try:
        print(json.dumps(verify_bundle(*sys.argv[1:]), indent=2))
    except (ValueError, KeyError, TypeError, OSError) as error:
        sys.exit(f'FAIL: {error}')
