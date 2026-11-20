import copy
import json
import tempfile
import unittest
from pathlib import Path

from PIL import Image
from verify_visual_bundle import sha256, verify_bundle


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'source.txt').write_text('synthetic test source, not medical review evidence')
        (self.root / 'draft.json').write_text('[{"id":"N1"},{"id":"N2"}]')
        Image.new('RGB', (603, 392), 'white').save(self.root / 'image.png')
        digest = sha256(self.root / 'image.png')
        self.selection = {
            'schema_version': 1,
            'sources': [{'id': 'S1', 'path': 'source.txt', 'sha256': sha256(self.root / 'source.txt')}],
            'assets': [{'id': 'A1', 'path': 'image.png', 'sha256': digest,
                        'source_id': 'S1', 'source_location': 'synthetic test only',
                        'provenance': 'fixture image, not an extraction',
                        'reuse_status': 'synthetic local test fixture', 'width': 603, 'height': 392,
                        'first_review': {'status': 'pass', 'reviewed_sha256': digest,
                                         'reviewer': 'fixture', 'reviewed_at': 'fixture', 'evidence': 'synthetic fixture',
                                         'viewed': True, 'upright': True, 'proportions_preserved': True,
                                         'labels_complete': True, 'visible_text_checked': True}}],
            'expected_note_ids': ['N1', 'N2'],
            'notes': [{'id': 'N1', 'decision': 'use', 'asset_ids': ['A1'], 'reason': 'fixture'},
                      {'id': 'N2', 'decision': 'no_image', 'asset_ids': [], 'reason': 'fixture no match'}],
            'draft': {'path': 'draft.json', 'sha256': sha256(self.root / 'draft.json')}}
        self.review = {'status': 'pass', 'reviewer': 'fixture separate pass', 'reviewed_at': 'fixture',
                       'evidence': 'synthetic test evidence only', 'blocking_findings': [],
                       'draft_sha256': self.selection['draft']['sha256'], 'checked_note_ids': ['N1', 'N2'],
                       'checked_assets': [{'id': 'A1', 'sha256': digest, 'viewed': True}],
                       'checked_pairs': [{'note_id': 'N1', 'asset_id': 'A1', 'sha256': digest}]}
        self.save()

    def save(self):
        self.sel_path = self.root / 'selection.json'
        self.rev_path = self.root / 'review.json'
        self.sel_path.write_text(json.dumps(self.selection))
        self.review['selection_sha256'] = sha256(self.sel_path)
        self.rev_path.write_text(json.dumps(self.review))

    def verify(self):
        return verify_bundle(self.sel_path, self.rev_path)

    def test_small_native_dimensions_are_not_rejected(self):
        self.assertEqual(self.verify()['pairs'], 1)

    def test_source_tamper(self):
        (self.root / 'source.txt').write_text('changed')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            self.verify()

    def test_image_tamper(self):
        Image.new('RGB', (603, 392), 'black').save(self.root / 'image.png')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            self.verify()

    def test_stale_selection(self):
        self.selection['notes'][0]['reason'] = 'changed'
        self.sel_path.write_text(json.dumps(self.selection))
        with self.assertRaisesRegex(ValueError, 'stale selection'):
            self.verify()

    def test_stale_draft(self):
        (self.root / 'draft.json').write_text('[]')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            self.verify()

    def test_incomplete_pair_review(self):
        self.review['checked_pairs'] = []
        self.save()
        with self.assertRaisesRegex(ValueError, 'pair coverage'):
            self.verify()

    def test_incomplete_no_image_review(self):
        self.review['checked_note_ids'] = ['N1']
        self.save()
        with self.assertRaisesRegex(ValueError, 'note coverage'):
            self.verify()

    def test_duplicate_note(self):
        self.selection['notes'].append(copy.deepcopy(self.selection['notes'][0]))
        self.save()
        with self.assertRaisesRegex(ValueError, 'duplicate ID'):
            self.verify()

    def test_unviewed_asset(self):
        self.review['checked_assets'][0]['viewed'] = False
        self.save()
        with self.assertRaisesRegex(ValueError, 'unviewed'):
            self.verify()

    def test_visible_text_not_checked(self):
        self.selection['assets'][0]['first_review']['visible_text_checked'] = False
        self.save()
        with self.assertRaisesRegex(ValueError, 'visible_text_checked'):
            self.verify()

    def test_wrong_dimensions(self):
        self.selection['assets'][0]['width'] = 999
        self.save()
        with self.assertRaisesRegex(ValueError, 'dimensions mismatch'):
            self.verify()

    def test_missing_image(self):
        (self.root / 'image.png').unlink()
        with self.assertRaisesRegex(ValueError, 'missing file'):
            self.verify()

    def test_blocking_finding(self):
        self.review['blocking_findings'] = ['unresolved label']
        self.save()
        with self.assertRaisesRegex(ValueError, 'blocking findings'):
            self.verify()

    def test_appended_draft_note_cannot_be_omitted(self):
        (self.root / 'draft.json').write_text('[{"id":"N1"},{"id":"N2"},{"id":"N3"}]')
        self.selection['draft']['sha256'] = sha256(self.root / 'draft.json')
        self.review['draft_sha256'] = self.selection['draft']['sha256']
        self.save()
        with self.assertRaisesRegex(ValueError, 'draft note coverage'):
            self.verify()

    def test_duplicate_draft_note(self):
        (self.root / 'draft.json').write_text('[{"id":"N1"},{"id":"N2"},{"id":"N2"}]')
        self.selection['draft']['sha256'] = sha256(self.root / 'draft.json')
        self.review['draft_sha256'] = self.selection['draft']['sha256']
        self.save()
        with self.assertRaisesRegex(ValueError, 'duplicate ID'):
            self.verify()

    def test_library_without_cards(self):
        self.selection.update(expected_note_ids=[], notes=[], draft=None)
        self.review.update(draft_sha256=None, checked_note_ids=[], checked_pairs=[])
        self.save()
        result = self.verify()
        self.assertEqual((result['notes'], result['assets']), (0, 1))


if __name__ == '__main__':
    unittest.main()
