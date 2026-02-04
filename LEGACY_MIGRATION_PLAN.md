Purpose
This document classifies all screens and components into zones
and defines an incremental, non-breaking modernization strategy.

⸻

1. Why legacy exists (important for diploma)

This project is developed incrementally.
UI and architecture evolved during active feature development.

Because of that:
•	early screens contain hardcoded styles and raw RN primitives
•	newer screens follow UI-kit and token-based design
•	both must coexist safely

Legacy code is not a bug — it is controlled technical debt.

⸻

2. Zones definition

🟢 MODERN (fully compliant)

Criteria
•	No useTheme() in screen
•	No Text, Pressable, TouchableOpacity
•	Uses ScreenContainer
•	All text via i18n
•	Uses ui/ and components/ only

Rules
•	Can be extended
•	Can be refactored
•	Used as reference examples

Examples (current state, approximate)
•	screens/Home/HomeScreen.tsx (partially modern)
•	screens/Bookings/BookingsScreen.tsx (mostly modern)
•	New screens created from Screen Template

⸻

🟡 STABILIZED LEGACY (allowed, but frozen)

Criteria
•	Uses useTheme() in screen
•	Uses raw Text / Pressable
•	Has hardcoded typography / spacing
•	Layout works and is visually approved

Rules
•	❌ No new features inside
•	❌ No new styles added
•	✅ Bugfixes allowed
•	✅ Marked with // LEGACY

Examples
•	screens/Auth/LoginScreen.tsx
•	screens/Auth/RegisterScreen.tsx
•	screens/Auth/WelcomeScreen.tsx
•	screens/Offer/OfferDetailsScreen.tsx
•	screens/Landmarks/LandmarksScreen.tsx

⸻

🔴 LEGACY (migration required)

Criteria
•	Heavy absolute positioning
•	Hardcoded values everywhere
•	Raw RN primitives
•	Visual bugs on font scale / theme switch

Rules
•	No new work allowed
•	Must be migrated before extension
•	Targeted refactor only (no redesign)

Examples
•	screens/Auth/*
•	screens/Bookings/BookingSuccessScreen.tsx
•	screens/Home/LandmarksSearchResultsScreen.tsx

⸻

3. Components zones

ui/

🟢 Always modern
•	Allowed to use RN primitives internally
•	Owns theme, tokens, variants
•	No business logic

components/

🟡 Legacy-tolerant
•	May use Pressable / Text for now
•	Migration happens by extraction into ui/

⸻

4. Migration priorities (VERY IMPORTANT)

Phase 1 — High value / low risk

Stabilizes perception of quality

	•	Profile screens
	•	Bookings screens
	•	Messages screens

Actions:
•	Replace Pressable → ui/Button / IconButton
•	Move text → Typography
•	Extract repeated layouts into components

⸻

Phase 2 — Entry flow

Most visible but risky

	•	Auth screens
	•	Welcome screen

Actions:
•	Create AuthLayout component
•	Remove absolute positioning
•	Replace social buttons with UI components

⸻

Phase 3 — Complex visual screens

Last, hardest

	•	Landmarks
	•	OfferDetails
	•	BookingSuccess

Actions:
•	Split into sections
•	Extract cards / headers
•	Gradual replacement

⸻

5. Codex rules (MANDATORY)

Codex MUST:
•	❌ NOT refactor entire screens unless instructed
•	❌ NOT change visuals without approval
•	✅ Add TODO / LEGACY markers
•	✅ Create new UI components instead of modifying screens
•	✅ Follow Screen Template for any new screen

⸻

6. Required file annotations

On legacy screens
// LEGACY SCREEN
// TODO: migrate to ui/components

On legacy styles
// LEGACY STYLES
// contains hardcoded typography / spacing

. What “done” means

Migration is considered complete when:
•	Screen no longer imports useTheme
•	No raw Text, Pressable, TouchableOpacity
•	All text via i18n
•	Layout still matches design

⸻

8. How this helps your diploma (important)

You can explicitly state:
•	project uses incremental modernization
•	technical debt is identified, documented and controlled
•	UI system is evolving toward design-system-driven architecture
•	refactoring is planned, not chaotic

This is a very strong engineering narrative.