# Agent Skills, Design & Memory Playbook
*The Canonical Operating System for AI Coding Agents in ASU Medical Portal and Future Projects*

---

## Executive Summary

Frontier AI coding agents (Claude Code, Google Antigravity, OpenAI Codex, Cursor) possess unprecedented code generation speed. However, without strict architectural guardrails, agents fall victim to four universal failure modes:
1. **AI Amnesia:** Losing decisions, context, and bug fixes across chat sessions.
2. **Context Rot & Token Exhaustion:** Burning through token budgets with verbose file reads and chat filler.
3. **Over-Engineering:** Inventing unrequested abstractions, unnecessary packages, and speculative complexity.
4. **Design Slop:** Producing generic, low-contrast, uninspired user interfaces.

This playbook establishes the unified standard used in the **ASU Medical Portal (A-Plus)** to eliminate these failure modes completely. It defines our **4-Layer Memory Model**, the **Operational Guide for Every Installed Skill**, and a **30-Second Bootstrap Blueprint for Any Future Project**.

---

## Part I: The 4-Tier Unified Memory Operating System

Knowledge is divided into four distinct tiers so that agents never start from zero while avoiding prompt pollution.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Tier 1: Directives & Brand Invariants (Active System Prompt Context)  │
│  Files: CLAUDE.md, AGENTS.md, docs/BRANDING.md, MEMORY.md              │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 2: Structural Memory & Semantic Relationships (Graphify AST)     │
│  Files: graphify-out/graph.json, graph.html, wiki/index.md             │
│  Access: `graphify query "<topic>"`, `graphify path A B`              │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 3: Episodic Cross-Session Memory (Claude-Mem + AgentMemory)      │
│  Backing: SQLite FTS5 + Vector hybrid recall                           │
│  Scope: Session decisions, past bug logs, user preferences             │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 4: Repository Snapshot & Audit Packaging (Repomix)               │
│  Tool: `repomix` via repomix.config.json (1.1M tokens clean code)      │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Tier 1: Directives & Brand Invariants (`CLAUDE.md`, `AGENTS.md`, `MEMORY.md`)
* **Role:** High-priority, unalterable constraints loaded on every turn.
* **Contents:**
  * Strict project commandments (e.g. `IBM-1` vs `MBMG-1`, no subject color box, sound toggle icon only).
  * Design tokens, typography rules, accessible minimums (Apple HIG).
  * Quality gates and test commands.
* **Maintenance:** Updated only when foundational system contracts evolve.

### 2. Tier 2: Structural Memory (`Graphify`)
* **Role:** Architectural map of how every class, function, file, and component connects.
* **The Rule:** An agent must **never** run blind `grep` or read dozens of raw files to figure out how code is organized.
* **Workflow:**
  1. Search: `graphify query "How does quiz session resumption work?"`
  2. Call-flow paths: `graphify path "QuizInterface.tsx" "useQuizEngine.ts"`
  3. Concept breakdown: `graphify explain "LearningSession"`
  4. Only read the specific line numbers surfaced by Graphify.
* **Maintenance:** Re-run `graphify update .` after making structural code changes (AST-only, 0 token cost).

### 3. Tier 3: Episodic Session Memory (`claude-mem` + `agentmemory`)
* **Role:** Preserves the history of *what was done*, *why choices were made*, and *what was fixed*.
* **Tools:**
  * **`claude-mem`**: Automatically captures observations, tool execution results, and summary timelines in SQLite FTS5. Next session, Claude Code auto-queries this memory before asking questions.
  * **`agentmemory`**: Allows agents to run `/remember "..."`, `/recall "..."`, and `/session-history`.
* **Maintenance:** Runs automatically in the background during active sessions.

### 4. Tier 4: Snapshot Context Packaging (`Repomix`)
* **Role:** When preparing for a massive refactor, security audit, or passing codebase context to a frontier reasoning model, Repomix bundles the codebase into a single AI-friendly Markdown file.
* **Our Standard (`repomix.config.json`):**
  * Strips binary media (`.pdf`, `.png`, `.svg`, `.mp4`).
  * Excludes heavy data dumps (`docs/verification/**`, `data-format-v2/banks/**`).
  * Reduces total tokens from **35,000,000+** down to **1,178,000 clean tokens** (97% reduction).
* **Execution:**
  ```bash
  repomix
  ```

---

## Part II: Skill & Plugin Reference Guide

### 1. Token Savers & Observability

#### `claude-hud` (Real-Time Terminal Heads-Up Display)
* **What it does:** Displays an active statusline under your terminal prompt showing real-time token count, cost, active tools, and background task progress.
* **Why it matters:** Eliminates the need to interrupt your flow by typing `/context` or `/cost`.
* **Configuration:** Pre-configured and enabled globally.

#### `caveman` (Telegraphic Communication Mode)
* **What it does:** Forces the agent into an ultra-concise, telegram-style output voice ("why use many token when few token do trick").
* **When to use:** During long-running refactors, test fixes, and terminal execution loops where conversational pleasantries needlessly consume hundreds of tokens per turn.
* **Usage Commands in Claude Code:**
  ```text
  /caveman on       # Enable concise mode
  /caveman ultra    # Maximum token savings
  /caveman off      # Return to standard conversational prose
  ```

#### `RTK` (Rust Token Killer)
* **What it does:** A CLI proxy that intercepts terminal command outputs (e.g. `npm test`, `git log`, `cargo test`) and condenses verbose logs down to essential failures before sending them to the LLM.
* **When to use:** Terminal-heavy execution environments where test suites emit thousands of lines.

---

### 2. Engineering Discipline & Minimalism

#### `ponytail` (Minimalist Developer Discipline)
* **What it does:** Injects the "laziest senior developer" mindset. Forces the agent to evaluate requests against the **Minimalism Ladder** (YAGNI):
  1. Does this need to exist at all? (If no, skip).
  2. Is it already in the codebase? (Reuse existing helpers).
  3. Can the standard library or platform do it?
  4. Is there an already-installed dependency? (Never install an npm package for 5 lines of code).
  5. Only write the absolute minimum code that works.
* **Usage Commands in Claude Code:**
  ```text
  /ponytail full    # Standard minimalism filter (default)
  /ponytail ultra   # Extreme simplicity enforcement
  ```

#### `karpathy-guidelines` (Behavioral Guidelines)
* **The 4 Core Tenets:**
  1. **Think Before Coding:** Don't assume. Surface tradeoffs. State assumptions explicitly.
  2. **Simplicity First:** Minimum code that solves the problem. Nothing speculative.
  3. **Surgical Changes:** Touch only what you must. Don't refactor adjacent code. Match existing style.
  4. **Goal-Driven Execution:** Define clear success criteria (tests/checks). Loop until verified.

#### `superpowers` (Systematic TDD & Worktrees)
* **What it does:** Enforces strict Test-Driven Development (Red $\rightarrow$ Green $\rightarrow$ Refactor), systematic debugging protocols, and isolated git worktrees.
* **When to use:** Before writing any core logic, write the failing test first, verify the failure, implement the minimum code to pass, and refactor surgically.

---

### 3. Design Intelligence & Accessibility

#### `apple-design` & `taste-skill`
* **What they do:** Prevents "AI-slop"—generic three-column landing pages, unstyled inputs, and low-contrast palettes.
* **Core Design Rules for Every Web View:**
  * **Touch Targets:** Interactive controls must be at least **44 × 44 pixels**.
  * **Contrast:** Minimum 4.5:1 contrast ratio for normal text (WCAG AA).
  * **Typography Scale:** Strict hierarchy: Large Title $\rightarrow$ Title 1 $\rightarrow$ Title 2 $\rightarrow$ Headline $\rightarrow$ Body $\rightarrow$ Caption.
  * **Semantic Themes:** Never hardcode colors; use semantic CSS tokens (`bg-background`, `text-foreground`, `border-border`) that adapt seamlessly to light and dark modes.
  * **Fluid Feedback:** Every interactive control must provide immediate visible feedback (hover, active, focus-visible).

---

### 4. Cross-Harness Workflow Marketplaces

#### `claude-code-workflows` (`wshobson/agents`)
* **What it provides:** Over 90 specialized subagents and task workflows for domain-specific tasks.
* **Key Subagents to Invoke:**
  * `ui-design`: Advanced layout and component architecture.
  * `security-scanning` & `protect-mcp`: Vulnerability and credential exposure scanning.
  * `c4-architecture`: System-level architectural diagrams.
  * `database-migrations`: Schema and PostgreSQL tuning.

---

## Part III: The 30-Second Blueprint for Future Projects

To set up any new repository with this exact high-performance stack, copy this standardized structure:

### 1. Project Directory Structure
```
my-new-project/
├── .agents/
│   └── AGENTS.md                  # Agent rules and quality gates
├── .claude/
│   └── settings.json              # Pre-configured hooks and plugin settings
├── docs/
│   ├── ARCHITECTURE.md            # Master architecture overview
│   └── BRANDING.md                # Design tokens and visual rules
├── CLAUDE.md                      # Graphify rules & memory pointers
├── MEMORY.md                      # Persistent project scratchpad
└── repomix.config.json            # Token-optimized context packaging config
```

### 2. Standard `repomix.config.json` Template
```json
{
  "$schema": "https://raw.githubusercontent.com/yamadashy/repomix/main/repomix.config.schema.json",
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": true,
    "fileSummary": true,
    "directoryStructure": true,
    "showLineNumbers": true,
    "removeComments": false,
    "removeEmptyLines": true,
    "topFilesLength": 10
  },
  "include": ["src/**/*", "docs/**/*", "*.md", "*.json", "*.ts", "*.tsx"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "**/*.svg", "**/*.png", "**/*.jpg", "**/*.pdf",
      "node_modules/**", "dist/**", "build/**",
      ".git/**", "graphify-out/**", "repomix-output.*"
    ]
  },
  "security": { "enableSecurityCheck": true },
  "tokenCount": { "encoding": "o200k_base" }
}
```

### 3. One-Command Setup Script for Any Machine
```bash
# 1. Install Repomix globally
npm install -g repomix

# 2. Add core marketplaces to Claude Code
claude plugin marketplace add jarrodwatts/claude-hud
claude plugin marketplace add JuliusBrussee/caveman
claude plugin marketplace add DietrichGebert/ponytail
claude plugin marketplace add Leonxlnx/taste-skill
claude plugin marketplace add thedotmack/claude-mem
claude plugin marketplace add wshobson/agents

# 3. Install core plugins into Claude Code
claude plugin install claude-hud@claude-hud
claude plugin install claude-mem@thedotmack
claude plugin install caveman@caveman
claude plugin install ponytail@ponytail
claude plugin install taste-skill@taste-skill

# 4. Initialize Graphify
graphify update .
```

---

## Summary Checklist for Agents

Before completing any task in this codebase, verify:
* [ ] **Queried Graphify First:** Used `graphify query` instead of grep-crawling raw files.
* [ ] **Checked Invariants in `MEMORY.md`:** Respected all medical intake and UI design constraints.
* [ ] **Surgical Implementation:** Changed only the lines directly related to the user request.
* [ ] **Tested Completely:** Ran all automated Vitest test suites.
* [ ] **Updated Documentation:** Kept schema, documentation, and Graphify in sync.
