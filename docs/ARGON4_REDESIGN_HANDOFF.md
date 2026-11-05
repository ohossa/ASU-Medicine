# A-Plus (`A⁺`) — Complete Master Redesign Handoff for Gemini Argon 4

> **Context for Gemini Argon 4:**  
> You are designing the complete visual and UI/UX redesign of **A-Plus (`A⁺`)**, an independent, 100% free medical question bank and study engine built by medical student **Omar Hossam** for undergraduate students at **Ain Shams University Faculty of Medicine (ASU Med)** in Cairo, Egypt.  
> The platform lives at **`https://asu.codes`**.  
>  
> **Your Mandate:** Modernize the entire visual aesthetic into an elite, world-class standard combining **Apple Human Interface Guidelines (HIG)**, **Linear app precision**, and **Amboss clinical clarity**.  
> Keep all structural workflows, routing taxonomy, and functional capabilities identical, but elevate the interface from "dated student portal" to a breathtaking, distraction-free modern study weapon.

---

## Part 1: Non-Negotiable Architectural Ground Rules

1. **Keep Structural Code & Data Contracts Identical:**
   * **Catalog Hierarchy:** `Year (1 to 5) → Semester (1 & 2) → Module Code (e.g. CVS-2, MGL-3, IBM-1) → Chapter → Subject → Topic/MCQs`.
   * **Question Engine:** Single-choice MCQs (4 options), matching questions, fill-in-the-blank, and clinical vignettes with immediate feedback, detailed rationales, and key concepts.
   * **Bilingual Support:** Instant switch between English and Arabic (`RTL` layout with mirrored navigation).
   * **100% Free & Altruistic:** Zero paywalls, zero subscriptions, zero ad banners.
2. **Brand & Domain Harmony:**
   * **Product Name:** **A-Plus** (styled as **`A⁺`**).
   * **Web Domain:** **`asu.codes`**.
   * **Dual Brand Lockup:** 3D Cobalt `A⁺` Squircle + Bold `A-Plus` + Subtle `asu.codes` domain badge.
3. **Subtle Creator Attribution:**
   * The creator is **Omar Hossam** (3rd Year medical student at Ain Shams).
   * His name appears as a sleek, nonchalant engineering signature on the Results scorecard (`A⁺ by Omar Hossam · asu.codes`) and in the site footer, never as an aggressive billboard.
4. **Anti-Slop Visual Philosophy:**
   * **NO** blurry aurora blobs, gradient meshes, or dark-violet clichés.
   * **NO** fake glassmorphism transparency that impairs readability.
   * Solid, crisp surfaces with unmistakable value contrast (white text on dark obsidian; dark ink on white forms).

---

## Part 2: Master Design Tokens & Material System

### 1. Color Palette

| Token | Hex | Role & Application |
| :--- | :--- | :--- |
| **Electric Cobalt** | `#2743ff` | Primary brand color, primary CTA buttons, active tab indicators, focus rings. |
| **Cobalt Light / Dark** | `#3b5bfd` / `#1832cc` | Subtle vertical gradient for brand panels and tactile button bevels. |
| **Obsidian Dark** | `#080c16` | Main dark-mode background (deep, ink-black base with subtle blue undertone). |
| **Slate Surface** | `#0f1524` | Elevated cards, quiz options, search bars, and floating controls. |
| **Hairline Borders** | `#1f2a40` / `rgba(255,255,255,0.08)` | 1px razor-sharp borders separating sections without clutter. |
| **Warm Apricot** | `#ffc95c` | **Strictly rationed.** Used *only* for the 5-star testimonial rating and editorial underlines. |
| **Clinical Success** | `#10b981` (Emerald) | Correct answers, passing scores, mastery badges. |
| **Clinical Alert** | `#f43f5e` (Rose) | Incorrect answers, flagged items, danger states. |
| **Pure White** | `#ffffff` | Primary headings, question stems, and high-contrast labels. |

### 2. Typography Stack

* **Headlines & Display:** `Bricolage Grotesque` (Weights: 700 to 800, tight tracking `-0.03em`). Conveys modern, confident craft.
* **UI Controls & Question Stems:** `Inter` (Weights: 400 Regular, 500 Medium, 600 SemiBold) paired with `Plus Jakarta Sans`. High x-height engineered for zero eye fatigue during 3-hour cram sessions.
* **Metadata, Stats & Code:** `JetBrains Mono` (Weights: 400, 500). Used for question numbers, timers, domain badges, and statistical percentiles.
* **Arabic Typography:** `Amiri` & system Arabic fallbacks with balanced baseline alignment.

### 3. Surface & Elevation (Apple HIG Liquid Glass & Solid Fields)

* **Top Navigation Toolbar:** Sticky `h-16`, frosted backdrop blur (`backdrop-blur-xl`), `bg-[#080c16]/80` with a 1px border `border-white/[0.06]`.
* **Touch Targets:** Minimum **44×44 pt** for all interactive elements (buttons, checkboxes, option pills, back controls).
* **Corner Radii:**
  * App Tile / Master Icon: Apple superellipse squircle radius (~22.4%).
  * Large Cards / Modals: `16px` to `20px` (`rounded-2xl`).
  * Option Buttons & Inputs: `12px` (`rounded-xl`).
  * Badges & Pills: `9999px` (`rounded-full`).

---

## Part 3: Screen-by-Screen Redesign Blueprint & Prompts

Here are the 5 core screens of the platform, along with exact, ready-to-run prompts you can give Argon 4 to generate production-quality visual designs.

---

### Screen 1: The Modern 50/50 Split Auth & Onboarding (`LoginScreen`)

#### Layout Architecture
* **Desktop (1440px):** 50/50 split screen on two flat, high-contrast surfaces.
  * **Left Panel:** Solid Electric Cobalt (`#2743ff`) with a faint `#1832cc` dot-grid. Top-left has the dual lockup (`A⁺` 3D tile + `A-Plus` + `asu.codes`). Center has an oversized 2-line headline: *"Master your medical studies, smarter."* with *"smarter"* underlined in warm apricot `#ffc95c`. Features list (Chapter Practice, Syllabus Progress, Question Search) and an anonymous student testimonial with 5 apricot stars.
  * **Right Panel:** Dark Obsidian (`#080c16`) centering a sleek auth card. Top-right link: *"Support asu.codes 🤍 →"*. "Welcome back" heading + SSO Google button + email sign-in form. Footer credit: *"Built by Omar Hossam for Ain Shams Medical Students"*.
* **Mobile (390px):** Columns stack vertically. The brand panel becomes a compact top header, and the auth form sits directly below without horizontal overflow.

#### Copy-Paste Prompt for Argon 4:
```text
A modern SaaS login and onboarding screen for a medical student study platform called "A-Plus" (asu.codes). Full 50/50 split-screen layout.

LEFT HALF: Flat saturated electric cobalt blue (#2743ff) brand panel with a very faint darker dot grid. 
- Top-left: A bespoke 3D cobalt squircle icon with an architectural white "A⁺" monogram, beside a crisp white wordmark "A-Plus" with a subtle monospace "asu.codes" sub-badge, and an "Independent Project" pill.
- Middle: Massive high-contrast white display headline in Bricolage Grotesque: "Master your medical studies, smarter." with the word "smarter" underlined with an elegant warm apricot (#ffc95c) brushstroke. Below it, a translucent white supporting line: "The student-built question bank for Ain Shams Medicine. Chapter MCQs, spaced repetition, and exam simulations."
- Three feature rows with clean line icons: Chapter Practice, Syllabus Tracking, and Question Search.
- Inline testimonial card: Five glowing apricot stars, quote: "The fastest way to test yourself before exam week. High-yield, clean, and zero distractions.", avatar "MS", subtitle "Year 2 Medical Student · Independent User".

RIGHT HALF: Deep obsidian dark background (#080c16).
- Top right: Subtle link "Support asu.codes 🤍 →".
- Center: Clean auth container. Headline "Welcome back", subhead "Sign in to your account to continue your study workspace".
- Large "Continue with Google" button with dark slate background (#0f1524), 1px border (#1f2a40), and full-color Google 'G' icon.
- Hairline divider "OR CONTINUE WITH EMAIL".
- Form fields with mail and lock icons, dark input fills (#0f1524), and an electric cobalt "Sign In" button (#2743ff) with white text.
- Footer: "© 2026 A-Plus (asu.codes) · Built by Omar Hossam for Ain Shams Medical Students · Independent & Free".

Aesthetic: Apple Human Interface Guidelines meets Linear app. Ultra-clean typography, zero blur blobs, zero glassmorphism slop, 8k render, razor-sharp value contrast.
```

---

### Screen 2: The Command Center / Year Modules Dashboard (`Dashboard` & `YearModules`)

#### Layout Architecture
* **Top Navbar:** Dual lockup (`A⁺` squircle + `A-Plus` + `asu.codes`), breadcrumb pills, search trigger (`⌘K`), and user avatar with online status dot.
* **Hero Banner:** Academic year selector (Year 1 to Year 5 tabs) with active cobalt indicator. Headline: *"Your academic year, organized."*
* **Module Grid:** Responsive 3-column card grid representing active modules (e.g., `CVS-2 Cardiovascular`, `MRS-2 Respiratory`, `MGL-3 Gastrointestinal`, `IBM-1 Biochemistry`).
  * Card anatomy: Bold module code badge, module full title, progress ring/bar (e.g., `64% Completed · 420/650 MCQs`), "Continue Practice" primary button, and "Review Missed" secondary button.
* **Quick Tools Strip:** Quick-launch buttons for *Anki Decks Sync*, *Marks Calculator*, *Question Search*, and *Continuous Mock Simulator*.

#### Copy-Paste Prompt for Argon 4:
```text
Modern desktop dashboard for a medical student study platform called "A-Plus" (asu.codes). Dark obsidian theme (#080c16).

TOP NAVBAR:
- Sticky frosted header. Left: Dual brand lockup with a 3D cobalt squircle icon showing a white "A⁺", bold text "A-Plus", and small "asu.codes" badge. Center: Segmented breadcrumbs "Portal > Year 2 > Semester 1". Right: Global search input (⌘K Search questions) and circular student avatar.

HERO SECTION:
- Horizontal segmented pill selector for Academic Years: [Year 1] [Year 2 - ACTIVE with solid #2743ff cobalt fill] [Year 3] [Year 4] [Year 5].
- Clean greeting: "Welcome back, Omar. Ready for Cardiovascular continuous assessment?" with a compact retention streak badge (🔥 12-day streak).

MODULE CARDS GRID (3 Columns):
- High-end dark slate cards (#0f1524) with subtle 1px border (#1f2a40) and rounded-2xl corners:
  1. "CVS-2: Cardiovascular System" — Progress bar at 78%, "520 / 668 Questions Solved", status pill "Exam in 4 days". Solid cobalt "Resume Chapter Practice" button.
  2. "MRS-2: Respiratory System" — Progress ring at 45%, "210 / 480 Questions Solved". Secondary button "Practice Missed (18)".
  3. "MCNS-2: Central Nervous System" — Progress bar at 15%, "New Questions Added".
- Quick action floating bar at bottom: "Launch Continuous Mock Exam", "Anki Sync", "Marks Calculator".

Aesthetic: Linear meets Apple HIG. Deep obsidian dark mode, crisp typography (Inter + Bricolage Grotesque), electric cobalt (#2743ff) accents, zero cluttered fluff.
```

---

### Screen 3: The Distraction-Free Quiz & Exam Interface (`QuizInterface`)

#### Layout Architecture
* **Top Header:** Close button (`✕`), Chapter & Subject title (`Cardiovascular Anatomy · Coronary Circulation`), live question progress bar (`Question 14 of 40`), and exam timer (`18:42`).
* **Question Viewport:**
  * Clean, high-legibility clinical stem in white text (font size 18px, leading 1.6).
  * 4 Option cards (A, B, C, D) stacked vertically with generous padding and 44px min-height.
  * **Option States:**
    * *Default:* Dark slate fill (`#0f1524`), 1px border (`#1f2a40`), white text.
    * *Selected / Correct:* Emerald green border and soft glow (`#10b981`), checkmark icon.
    * *Incorrect:* Rose red border (`#f43f5e`), cross icon, showing the correct answer highlighted in green.
* **Post-Answer Explanatory Drawer:**
  * Collapsible high-yield breakdown: *Key Clinical Concept* (amber bookmark), *Department Lecture Rationale* (why option A is correct and why B, C, D are distractors), and *Flag Question* / *Report Error* button.
* **Bottom Action Bar:** Previous question button, Bookmark button, and prominent "Next Question →" cobalt button.

#### Copy-Paste Prompt for Argon 4:
```text
Distraction-free clinical medical quiz interface for "A-Plus" (asu.codes). Full-screen dark mode (#080c16).

TOP BAR:
- Left: Subtle exit button (← Exit session) and module tag "CVS-2 · Cardiology".
- Center: Minimalist progress indicator "Question 18 of 40" with a slim electric cobalt progress bar.
- Right: Monospace exam timer "14:28 remaining" and "Sound: Off" icon.

MAIN QUESTION CARD:
- Centered, comfortable max-width reading column (720px).
- Clinical Vignette Stem in crisp white typography: "A 54-year-old male presents to the ER with crushing substernal chest pain radiating to his left jaw. ECG demonstrates ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?"
- Four stacked option cards with rounded-xl corners:
  A) Left Anterior Descending Artery (LAD) — (Default state, dark slate #0f1524)
  B) Right Coronary Artery (RCA) — (Active CORRECT state: vibrant emerald green border #10b981, emerald checkmark icon, glowing soft outline)
  C) Left Circumflex Artery (LCx) — (Default state)
  D) Left Main Coronary Artery — (Default state)

DETAILED EXPLANATION PANEL (Revealed below options):
- Amber-tinted callout card: "💡 Key Clinical Concept: Inferior wall myocardial infarction is reflected in leads II, III, and aVF, almost universally supplied by the Right Coronary Artery (RCA) via the Posterior Descending Artery."
- Detailed distractor rationales explaining LAD (anterior wall) and LCx (lateral wall).
- Bottom right: Small subtle link "Report Question / Clinical Dispute".

BOTTOM NAVIGATION:
- Left: "Flag Question" (star icon). Right: Large solid electric cobalt "Next Question →" button (#2743ff).

Aesthetic: Amboss clinical rigor meets Apple design craft. High readability, zero visual noise, professional medical training feel.
```

---

### Screen 4: The High-Yield Results & Mastery Scorecard (`ResultsDashboard`)

#### Layout Architecture
* **Top Header:** Back to Chapters button, Chapter title, and breadcrumb path.
* **4-Card Analytics Grid:**
  1. *Score Ring:* Circular SVG animated score ring displaying percentage (e.g., `85%`).
  2. *Accuracy:* Tabular count (`34 / 40`), accuracy label, and motivational clinical feedback.
  3. *Time:* Total time (`12m 40s`) and average speed per question (`~19s per question`).
  4. *Course Grade:* Big bold grade letter (`A⁺` or `A`) in emerald/cobalt with percentile status.
* **Subtle Creator Signature (Crucial for Screenshots):**
  * Clean font-mono line: `A⁺ · asu.codes       Crafted by Omar Hossam · Independent & Free`.
* **Action Row:** "Practice Missed Questions (6)", "Retry Entire Mock", and "Back to Dashboard".
* **Question-by-Question Audit List:** Expandable list with filter tabs: [All (40)] [Missed (6)] [Flagged (3)].

#### Copy-Paste Prompt for Argon 4:
```text
Premium post-exam results scorecard and analytics dashboard for "A-Plus" (asu.codes). Dark obsidian theme (#080c16).

TOP HERO SCORECARD GRID (4 Cards in a row):
1. Circular Score Ring: Sleek glowing emerald-cobalt ring displaying "88%" in bold tabular white numerals, subtitle "Exam Ready".
2. Accuracy Card: "35 / 40 Correct", emerald icon, subtitle "Superior retention across Cardiology MCQs".
3. Elapsed Time Card: "14m 20s", subtitle "~21s per question (Optimal pacing)".
4. Grade Badge Card: Oversized emerald-cyan badge "Grade A⁺", subtitle "Top 5% of Ain Shams Batch".

SUBTLE NONCHALANT CREATOR WATERMARK (Directly under the 4 cards):
- High-contrast, clean 11px font-mono text line:
  "● A⁺ · asu.codes                       Crafted by Omar Hossam · Independent & Free"
  (Styled to look like a precision engineering stamp, perfectly framed for social media / WhatsApp screenshots).

PRIMARY ACTION BUTTONS:
- Solid electric cobalt button: "Review Missed Questions (5)".
- Secondary bordered button: "Export to Anki Deck".
- Tertiary button: "Back to Chapter List".

BOTTOM BREAKDOWN:
- Tab filters: [All Questions (40)] [Missed Only (5) - Active red badge] [Flagged (2)].
- List of reviewed questions with accordion toggle for full explanations.

Aesthetic: Apple Fitness / Health summary meets Linear analytics. High-contrast typography, emerald #10b981 and cobalt #2743ff glow, dark slate cards (#0f1524).
```

---

### Screen 5: The Clinical Support & Transparency Page (`SupportPage`)

#### Layout Architecture
* **Header:** Hero title: *"Support A-Plus (asu.codes)"* with subtitle: *"Built by a medical student, for medical students. 100% free, always."*
* **Monthly Cost Ledger Table:** Real, honest, verified costs ($50.83 / ~2,784 EGP monthly) showing Supabase database, Vercel hosting, Resend email, and annual domain renewal.
* **InstaPay & Vodafone Cash Payment Panel:**
  * Recipient: `Omar HossamEldin Maged`
  * InstaPay IPA Address: `omarhossa_@instapay` (with copy button)
  * **InstaPay Mobile Phone Number:** `01040479155` (with copy button)
  * Vodafone Cash Wallet: `01040479155` (with copy button)
  * Direct "Open InstaPay App" deep link button.
* **A Note from Omar:** Personal card with avatar and quote explaining the IGCSE inspiration and peer commitment.

#### Copy-Paste Prompt for Argon 4:
```text
Honest, minimalist community support and donation page for an independent student project called "A-Plus" (asu.codes). Dark obsidian theme (#080c16).

HERO SECTION:
- Dual brand lockup top-left (A⁺ 3D icon + A-Plus + asu.codes).
- Headline: "Support the project." Subhead: "A-Plus is built by a medical student, for medical students. Every question and feature stays 100% free for everyone, always."

TRANSPARENCY COST LEDGER (Clean financial table):
- Card showing actual monthly server costs ($50.83 / ~2,784 EGP):
  - Supabase Pro Database: $25.00
  - Vercel Edge Hosting: $20.00
  - Domain (asu.codes): $5.83
  - Verification note: "Zero salaries, zero profit. 100% of contributions go directly to server hosting."

PAYMENT METHODS PANEL:
- Tabs for [InstaPay - ACTIVE] [Vodafone Cash] [Credit Card].
- Inside InstaPay Panel:
  - Recipient Name: "Omar HossamEldin Maged"
  - Field 1: "InstaPay Address (IPA)" -> "omarhossa_@instapay" [Copy Button]
  - Field 2: "InstaPay Mobile Number" -> "01040479155" [Copy Button]
  - Large primary cobalt button: "Open InstaPay App →"
- Security note: "Check the recipient name before confirming. A-Plus will never ask for a PIN or OTP."

CREATOR NOTE CARD:
- Dark slate card with avatar "O":
  "During IGCSE, we had plenty of practice questions organized by topic, and that made revision much easier. I wished I had something like that in university, so I built this platform to help us spend more time learning and less time searching for questions. — Omar Hossam (Year 3 Medical Student, Creator of A-Plus)"

Aesthetic: Apple Transparency Report meets indie developer manifesto. Warm, honest, clean, zero corporate fluff.
```

---

## Part 4: Code Mapping Reference

| Screen / Feature | Primary React Component | Key CSS / Styling |
| :--- | :--- | :--- |
| **Auth & Split Login** | `src/app/components/LoginScreen.tsx` | `src/app/components/split-login.css` |
| **Command Navbar** | `src/app/components/PortalShell.tsx` | Tailwind CSS |
| **Year & Module Hub** | `src/pages/Dashboard.tsx`, `YearModules.tsx` | `src/pages/learning-hub.css` |
| **Chapter & Topics** | `src/app/components/ChapterSelect.tsx` | Tailwind CSS |
| **Quiz Interface** | `src/app/components/QuizInterface.tsx` | Tailwind CSS |
| **Results Scorecard** | `src/app/components/ResultsDashboard.tsx` | Tailwind CSS |
| **Support & Ledger** | `src/pages/support/SupportPage.tsx` | `src/pages/support/support.css` |
| **Master Brand Guide** | `docs/BRANDING.md` | Markdown Specification |
