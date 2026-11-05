# A-Plus (`A⁺`) Brand Identity Specification & Design System

> **Canonical Brand Guide for Developers, Designers, and AI Agents**  
> *Last Updated: November 2026* · *Origin: Ain Shams University Faculty of Medicine*

---

## 1. Executive Summary & Brand Overview

* **Product Name:** **A-Plus** (styled symbolically as **`A⁺`**)
* **Ecosystem Domain:** **`asu.codes`** (Canonical: `https://asu.codes`)
* **Mission:** A free, fast, peer-maintained clinical study engine for medical students at Ain Shams University (ASU). It provides chapter-by-chapter MCQs, clinical spotters, detailed explanations, and spaced repetition.
* **Creator & Maintainer:** **Omar Hossam** (Omar HossamEldin Maged), 3rd Year Medical Student at Ain Shams Faculty of Medicine.
* **Core Philosophy:** **100% Free, Non-Commercial, Altruistic.** There are zero paywalls, zero locked features, zero advertising banners, and no corporate tracking.

---

## 2. Brand Architecture & Naming System

| Context | Exact Label / Treatment | Usage & Notes |
| :--- | :--- | :--- |
| **Spoken Campus Name** | **A-Plus** (*إيه بلس*) | How students refer to the platform in the amphitheater and batch chats (*"حلّيت على A-Plus؟"*). |
| **Web Domain** | **`asu.codes`** | The URL students type into their browser address bar. |
| **Desktop / App Header** | **Dual Lockup:** 3D `A⁺` Squircle + `A-Plus` (Bold) + `asu.codes` (Subtle domain) | Clarifies the product name while keeping the established web address prominent. |
| **Mobile PWA Home Screen** | **`A⁺`** (Single glyph) | Apple HIG minimal footprint for iOS & Android home screens. |
| **Browser Document Title** | `A-Plus (A⁺) — Independent Medical Study Companion & Question Bank · asu.codes` | Full descriptive title shown in search engine snippets and tab hover tooltips. |
| **Legal & Footprint** | `A-Plus (asu.codes)` | Used across terms, privacy policy, medical disclaimer, and student support. |

---

## 3. Creator Attribution (Nonchalant & Tasteful)

Omar Hossam created and maintains this platform independently alongside his medical studies. To respect the project's peer-to-peer nature without appearing overly self-promotional, creator credits follow a **strict nonchalant guideline**:

1. **Results / Scorecard Watermark (`ResultsDashboard.tsx`):**
   * Placed beneath the 4-card score grid:
     `A⁺ · asu.codes — Crafted by Omar Hossam · Independent & Free`
   * *Rationale:* When students screenshot high scores to share on WhatsApp, Telegram, or Instagram, the credit travels organically.
2. **Login Screen Footnote (`LoginScreen.tsx`):**
   * `© 2026 A-Plus (asu.codes) · Built by Omar Hossam for Ain Shams Medical Students · Independent & Free`
3. **Website Footer (`PortalFooter.tsx`):**
   * *English:* `"A-Plus (asu.codes) is an independent student project built by Omar Hossam. Free to use, always."`
   * *Arabic:* `"A-Plus (asu.codes) مشروع طلابي مستقل طوّره عمر حسام. مجاني للاستخدام دائماً."`
4. **Support Note (`SupportPage.tsx`):**
   * Personal reflection note from Omar explaining why he built the platform (solving the disorganized PDF crisis).

> [!IMPORTANT]
> **Rule for Future Agents:** Never remove Omar Hossam's subtle creator attribution, and never turn the site into a flashy portfolio or aggressive promotional billboard. The tone must remain understated, humble, and engineering-focused.

---

## 4. Visual Identity & Apple HIG Design System

The visual design is grounded in **`.agents/skills/apple-design/SKILL.md`**, blending Apple Human Interface Guidelines with *Linear x Amboss* high-contrast clinical precision.

### The `A⁺` Monogram Emblem

The master icon was generated in partnership with Gemini Argon 4:
* **The Squircle:** An Apple continuous-curvature superellipse (rx ~ 22.4%) in **Electric Cobalt Blue (`#2743ff`)**.
* **The Letter `A`:** Athletic architectural uppercase `A` with flat-capped apex, crisp 72° diagonal stems, and an optical center crossbar. Represents **A**in Shams, **A**cademic mastery, and **A**natomy/clinical foundation.
* **The Superscript `+`:** A clinical medical cross with equal arms positioned in the superscript slot. Represents **`A⁺`** (top-tier grade) and **Medicine** (healthcare/clinical advantage).
* **Material & Lighting:** Matte tactile finish with subtle top-rim micro-chamfer and soft ambient occlusion depth.
* **True Alpha Transparency:** Outside the squircle, all pixels have **`alpha = 0`**. There are ZERO white or dark corner halos.

### Core Color Tokens

| Token Name | Hex Code | Role & Application |
| :--- | :--- | :--- |
| **Electric Cobalt** | `#2743ff` | Primary brand color, primary CTA button, focus rings, squircle base. |
| **Cobalt Light / Dark** | `#3b5bfd` / `#1832cc` | Subtle vertical gradient on brand surfaces and active states. |
| **Obsidian Dark** | `#080c16` | Main body background for dark mode (replaces dark-violet/indigo clichés). |
| **Slate Surface** | `#0f1524` | Form inputs, quiz cards, floating breadcrumbs. |
| **Hairline Borders** | `#1f2a40` / `rgba(255,255,255,0.08)` | Subtle 1px containment borders. |
| **Warm Apricot** | `#ffc95c` | **Strictly rationed.** Used *only* for the 5-star testimonial rating and key editorial underlines. |
| **Pure White** | `#ffffff` | Primary text on dark backgrounds and the `A⁺` emblem mark. |

### Typography Hierarchy

* **Headlines & Display:** `Bricolage Grotesque` (wght 700 to 800, tight tracking). Anti-slop, distinctive editorial personality.
* **UI Controls & Questions:** `Inter` (wght 400, 500, 600) + `Plus Jakarta Sans`. Utmost legibility for rapid MCQ scanning.
* **Code, Metadata & Badges:** `JetBrains Mono` / monospace. Used for `asu.codes` domain tags, question IDs, and score stats.
* **Arabic Typography:** `Amiri` / system Arabic fallback.

---

## 5. Directory of Brand Assets

All production assets live in `/public`:

| File | Resolution | Transparency | Destination / Purpose |
| :--- | :--- | :--- | :--- |
| `public/favicon.svg` | Vector (512×512 viewBox) | 100% Alpha outside squircle | Modern browser vector favicon |
| `public/favicon.ico` | Multi-res (16, 32, 48, 64) | 32-bit RGBA Alpha | Legacy browsers, bookmarks, Windows |
| `public/favicon.png` | 64×64 PNG | 100% Alpha | Standard web favicon & UI lockups |
| `public/favicon.webp` | 64×64 WebP | 100% Alpha | Modern web browsers |
| `public/favicon-128.png` | 128×128 PNG | 100% Alpha | Retina favicon & PWA icon |
| `public/favicon-192.png` | 192×192 PNG | 100% Alpha | Android PWA home screen icon |
| `public/favicon-512.png` | 512×512 PNG | 100% Alpha | Splash screen & high-res PWA |
| `public/apple-touch-icon.png` | 180×180 PNG | 100% Alpha | iOS Apple Touch Home Screen icon |
| `public/clerk-logo.png` | 512×512 PNG | 100% Alpha | Clerk Dashboard Brand Logo |
| `public/clerk-favicon.png` | 64×64 PNG | 100% Alpha | Clerk Dashboard Favicon |

---

## 6. Ten Commandments for Future AI Coding Agents

1. **Never Add Paywalls:** Every question, mock, search tool, and calculator must remain 100% free for students.
2. **Never Add Coder Brackets `{ }` to the Logo:** The audience is medical students, not computer scientists. The mark is **`A⁺`**, not `{ ∿+ }`.
3. **Never Compress to Pure White Corners:** Any script rendering SVGs to PNGs must use native alpha (`NSBitmapImageRep(hasAlpha: true)` or Pillow with RGBA). Never use Finder `qlmanage -t`.
4. **Preserve the Dual Lockup:** When displaying the brand in headers or footers, present **A-Plus** as the primary identity and **`asu.codes`** as the web domain.
5. **Preserve Omar Hossam's Subtle Signature:** Keep the modest `Crafted by Omar Hossam` watermark on results screens and footers.
6. **No Glassmorphism Slop:** No blurry aurora backgrounds, no colorful gradient meshes, no film grain overlays. Keep surfaces flat, solid, high-contrast, and Apple HIG compliant.
7. **Ration Warm Apricot (`#ffc95c`):** Do not use apricot for general buttons or large blocks. It is exclusively an accent for ratings, highlights, and status dots.
8. **Honor the Module Taxonomy:** Preserve the strict catalog structure (`Year → Semester → Module → Chapter → Subject → Topic`).
9. **Never Push Git Remotes Automatically:** Always follow the user rule: commits are local only unless `git push` is explicitly requested.
10. **Keep Documentation Synchronized:** Any branding, schema, or routing change must be immediately documented across `docs/` and knowledge graph (`graphify`).
