---
type: "query"
date: "2026-10-23T09:25:04.288506+00:00"
question: "Why does QuizPayload connect HIG Design Conventions & Vocabulary to Flagged Questions & Results UI, Web Vitals & Performance Optimization, and Curriculum Dashboard & Study Mode?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizPayload", "App.tsx", "ResultsDashboard.tsx", "QuizInterface.tsx", "StudyMode.tsx"]
---

# Q: Why does QuizPayload connect HIG Design Conventions & Vocabulary to Flagged Questions & Results UI, Web Vitals & Performance Optimization, and Curriculum Dashboard & Study Mode?

## Answer

Expanded from original query via vocab: ['quiz', 'payload', 'hig', 'design', 'vocabulary', 'flagged', 'results', 'vitals', 'performance', 'dashboard', 'study', 'mode']. Then traversed BFS/DFS from QuizPayload in graphify-out/graph.json. QuizPayload acts as the central state hub in src/app/App.tsx (L101-L107), bridging curriculum navigation (Dashboard, StudyMode) with solving engines (QuizInterface, ResultsDashboard, FlaggedQuestionsScreen), enforced by Apple HIG modal drill-down contracts and optimized for Core Web Vitals (sub-100ms INP lazy bank slicing).

## Outcome

- Signal: useful

## Source Nodes

- QuizPayload
- App.tsx
- ResultsDashboard.tsx
- QuizInterface.tsx
- StudyMode.tsx