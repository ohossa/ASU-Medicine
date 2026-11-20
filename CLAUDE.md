## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Skills & Memory Architecture

This project uses the **4-Tier Unified Memory Operating System** and active skills outlined in [`docs/AGENT_SKILLS_AND_MEMORY_PLAYBOOK.md`](docs/AGENT_SKILLS_AND_MEMORY_PLAYBOOK.md):

1. **Persistent Directives & Gotchas:** Consult [`MEMORY.md`](MEMORY.md) and [`AGENTS.md`](AGENTS.md) for non-negotiable medical intake and UI design constraints.
2. **Structural Map:** Use `graphify query` before touching source code.
3. **Episodic Decision Log:** Rely on `claude-mem` and `agentmemory` to track past sessions and architectural choices.
4. **Codebase Packaging:** Use `repomix` (`repomix.config.json`) for clean, token-efficient whole-repo exports (1.1M clean tokens).

### Execution Discipline
- **Token Efficiency:** Keep `claude-hud` active to monitor token consumption. Enable `/caveman on` during heavy refactoring loops.
- **Simplicity & YAGNI:** Apply `ponytail` principles—reuse existing patterns, avoid adding unrequested packages.
- **Surgical Changes:** Follow Karpathy guidelines—touch only what you must, define verifiable criteria, and test before finishing.
- **UI Integrity:** Adhere to `apple-design` and `taste-skill` standards (44px touch targets, WCAG AA contrast, no subject colour-coding box).


## Medical Anki and image workflows

For medical flashcard creation or illustrated APKG updates, start at [docs/medical-anki/START_HERE.md](docs/medical-anki/START_HERE.md). Read [MEDICAL_ANKI_WORKFLOW.md](MEDICAL_ANKI_WORKFLOW.md) and [IMAGE_EXTRACTION_WORKFLOW.md](IMAGE_EXTRACTION_WORKFLOW.md), then use both repository-local skills in `.agents/skills/medical-anki-production/` and `.agents/skills/medical-image-extraction/`. These are real portable project files; a skill loader is optional. Preserve the source/coverage, visual/pairing, stable-identity and native update gates; historical blanket 300-DPI/minimum-pixel/catalogue-perfection rules are superseded. A current source file takes precedence over an older graph summary of it.


### Approved medical-card Extra layout (12 November 2026)

Both Basic and Cloze require the conditional Extra Section box: title, supplementary text and images centred; empty Extra hidden; main question/answer alignment unchanged. Preserve amber/gold revealed Cloze contrast. Use `.agents/skills/medical-anki-production/references/answer-layout.md` and the five matching `assets/` files; CSS alone does not create the Cloze wrapper. This supersedes the earlier Basic-only/left-aligned Extra guidance and does not authorise new card content or modification of existing APKGs.
