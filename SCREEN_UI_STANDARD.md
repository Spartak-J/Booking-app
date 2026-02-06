# Screen UI Standard

This document defines how to structure every screen in the mobile app, based on the existing code (AppLayout, ScreenContainer, UI primitives, navigation setup). Follow these rules for any new or touched screens.

## Roles

### Screen component (wrapper)

- Owns routing and data fetching: read route params, trigger queries/services, select stores.
- Chooses layout wrapper: `AppLayout` with `variant="tab" | "stack"` and optional `footer` React node.
- Passes data and callbacks into a pure `ScreenView` component.
- Handles navigation side effects only (`navigation.navigate`, `goBack`, etc.).
- No visual styling, no theme branching, no SafeArea math, no StatusBar control beyond selecting the `AppLayout` variant.

### ScreenView (presentation)

- UI-only composition; receives all data/handlers via props.
- Uses UI primitives from `src/ui` (`Typography`, `Button`, `Input`, `Card`, `Modal`, `Loader`, `IconButton`, `ScreenContainer`, etc.).
- Uses `ScreenContainer` for scrolling and keyboard avoidance when needed.
  `ScreenContainer` must NOT apply system safe-area insets; all system spacing is owned by AppLayout.
- May read theme tokens via `useTheme` only for styling within the view; avoid navigation or data calls.
- No StatusBar configuration, no navigation calls, no API/service calls.

## Screen layout types

Every ScreenView MUST explicitly follow one of the layout types below.

### Content / flow screens (default)

Examples: lists, forms, details, profile, search results.

Rules:

- Use `ScreenContainer` for scrolling and keyboard avoidance.
- Layout flows top → bottom.
- No absolute positioning for main content.
- Bottom spacing is handled by AppLayout (tab/stack/footer).

### Fixed / landing screens

Examples: Welcome, Splash, intro, empty states with CTA.

Rules:

- MUST NOT use `ScreenContainer`.
- Root element is a plain `View` with `flex: 1`.
- Content is arranged using flex layout (`marginTop: 'auto'` for bottom blocks).
- Absolute positioning is allowed ONLY for decorative layers (backgrounds, gradients, bubbles).
- No scrolling, no keyboard avoidance.
- SafeArea and StatusBar are still owned by AppLayout.

Using the wrong layout type (e.g. ScreenContainer on a fixed screen) is a violation of the standard and will cause layout breakage.

## Layout & system UI ownership

- **SafeArea**: `AppLayout` wraps the screen in `SafeAreaView` (edges top/left/right). Bottom padding is computed from tab bar height (tab variant), device insets, and optional `footer` height. ScreenViews must not add extra system paddings or call `useSafeAreaInsets`.
- **StatusBar**: `AppLayout` is the single owner of `StatusBar` configuration.
  Any `StatusBar` usage in App.tsx is transitional and must not be duplicated in screens or views.
- **Background**: `AppLayout` applies `tokens.bgScreen`. ScreenViews should not override background with literals; if needed, set container background using `tokens` from `useTheme`.
- **Tab vs stack**: use `variant="tab"` for bottom-tab routes (padding includes tab bar) and `variant="stack"` for stack-only routes. Do not manually position content for the tab bar.
- **Footers**: pass footer React nodes through `AppLayout footer` prop. `AppLayout` measures footer height and extends bottom padding so content scrolls above it.

## Screen layout types (scroll vs fixed)

Every ScreenView must explicitly follow one of the layout types below.
Mixing patterns inside a single ScreenView is forbidden.

### 1) Scroll screens (content-driven)

Use this type when:

- The screen contains forms, lists, long text, or variable-height content
- Content may overflow vertically on smaller devices
- Keyboard interaction is expected

Rules:

- ScreenView MUST wrap content in `ScreenContainer`
- `ScreenContainer` is responsible only for scrolling and keyboard avoidance
- Layout inside ScreenContainer must be flow-based (`flex`, `gap`, `padding`)
- No absolute positioning for main content blocks
- No vertical centering hacks using `top`, `translateY`, or magic numbers

Examples:

- LoginScreenView
- RegisterScreenView
- LandmarksScreenView
- Profile edit screens

### 2) Fixed-layout screens (visual / landing)

Use this type when:

- The screen is a landing / welcome / empty-state screen
- Content is visually composed (hero, decorations, CTA)
- The screen must visually match a Figma composition

Rules:

- ScreenView MAY use `ScreenContainer` OR a plain `View`, but must still be wrapped by `AppLayout`
- Decorative elements (backgrounds, shapes, gradients) may use absolute positioning
- All absolute positioning must be isolated to decorative layers only
- Content blocks (text, buttons, inputs) must still use flow layout (`flex`, `gap`, `padding`)
- CTA blocks must be pinned using layout (e.g. `marginTop: 'auto'`), not absolute `bottom`

Examples:

- WelcomeScreenView
- Empty state screens (Messages empty, Saved empty)
- SplashScreenView

### General constraints (for both types)

- ScreenViews must never compensate for SafeArea, tab bar, or footer height
- Vertical spacing must come from:
  - `spacing` tokens
  - `gap`
  - `padding`
  - `margin`
- Absolute positioning is NEVER allowed to fix layout issues caused by missing SafeArea or footer padding
- If content visually overlaps or collapses, the issue must be fixed by choosing the correct screen layout type, not by offsets

If a ScreenView does not clearly fit either type, the layout must be redesigned before implementation.

## Forbidden patterns

- `useSafeAreaInsets` or hardcoded system paddings inside ScreenViews.
- Inline hardcoded colors, font sizes, or radii (use theme tokens: `tokens`, `spacing`, `radius`, `typography`).
- Creating buttons with `Pressable/TouchableOpacity` in screens; use `ui/Button` or `ui/IconButton` instead.
- Navigation logic inside ScreenViews.
- StatusBar changes outside `AppLayout`.
- Absolute positioning for headers/footers inside `ScreenViews` that replicate navigator UI.
- Any “magic” vertical offsets to compensate tab bar or status bar.
- Duplicated headers/footers per screen instead of shared primitives (`ui/HeaderBar`, `HomeFooter`, etc.).

### Theme access rules

- Screens must not branch on theme mode (light/dark).
- ScreenViews may use useTheme/useTokens only to style UI primitives.
- Theme decisions never affect layout structure or navigation.

## Authoring checklist

1. Create `ScreenNameScreen.tsx` that:
   - imports `AppLayout` and the matching `ScreenView`.
   - reads route/navigation props and runs queries/services.
   - renders `<AppLayout variant="tab|stack" footer={...}> <ScreenView .../> </AppLayout>`.
2. Build `ScreenView` in `src/components/<Feature>/` that:
   - receives data/handlers as props, no navigation.
   - wraps content in `ScreenContainer` when scrolling/keyboard handling is needed.
   - uses only `src/ui` primitives and theme tokens for visual styling.
3. Keep dark/light support by sourcing colors from `useTheme`/`tokens`; never hardcode hex/rgba.
4. If a footer is required, pass it from the Screen via `AppLayout footer`; don’t absolutely position footers in the view.
5. Add tests or stories as appropriate and ensure linting passes.

## Decisions

- Should screens know about theme? **No** beyond selecting `AppLayout`; all visual theming lives in `ScreenView`/UI primitives.
- Should screens know about StatusBar style? **No**; `AppLayout` owns StatusBar configuration.
- How is SafeArea calculated when a footer exists? **AppLayout** pads bottom by `tabBarHeight | device inset` plus measured `footer` height so content stays above both.
