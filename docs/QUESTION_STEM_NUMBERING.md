# Source numbering cleanup — 8 October 2026

Student-facing question loading removes leading source question labels before rendering. This applies to legacy and V2 questions, case children, and published admin updates. Practice, past exams, search, flags and results receive the same cleaned data.

Source JSON, IDs, options, answers, explanations, ordering, grading, version hashes and routing remain unchanged. The source records retain numbering for provenance; the quiz's live progress indicator supplies the current question position.

The parser recognizes explicit Question/Q labels, punctuated numbers, matching ranges, parenthesized labels and spaced hyphens. It preserves clinical ages, decimal doses, drug names, chemical names and internal numbered lists. Two known ondansetron stems omit punctuation and have a narrowly constrained cleanup rule. Repeated source labels such as `2. Question 2:` are handled.

GIT audit: 6,178 parent questions and 301 case children; 2,259 parent stems and 32 children have source labels removed. No recognizable source labels remain in the displayed GIT stems. Original bank hash and all scored fields remain covered by the integration suite.

Verification: 49 suites / 347 tests passed in the isolated release tree. Strict application, tooling and API type checks and production build passed. Signed-in account flows and physical-device testing remain outside this fix's verification scope.
