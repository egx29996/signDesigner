# Test Coverage Analysis

## Current State

**Coverage: 0%** — The project has **92 source files** (~3,100 lines of code) and **zero tests**. No test framework, test runner, or CI pipeline is configured.

---

## Recommended Test Infrastructure

### Framework Setup

Since the project uses **Vite + React + TypeScript**, the recommended stack is:

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner (native Vite integration, fast) |
| **@testing-library/react** | Component testing |
| **@testing-library/jest-dom** | DOM assertion matchers |
| **jsdom** / **happy-dom** | Browser environment for unit tests |
| **msw** | Mock Service Worker for Supabase API mocking |

### Install Command

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom msw
```

### Configuration

Add `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

Add `"test": "vitest"` and `"test:coverage": "vitest run --coverage"` to `package.json` scripts.

---

## Priority Areas for Testing

### Tier 1 — Pure Business Logic (highest value, easiest to test)

These modules are pure functions with no DOM or API dependencies. They should be tested first.

#### 1. `src/lib/ada-engine.ts`
**Risk: HIGH** — ADA compliance validation directly affects legal compliance.

Tests needed:
- `hexToLuminance()` — known color values (black=0, white=1, mid-grays)
- `calculateContrastRatio()` — known pairs (black/white=21:1, same color=1:1)
- `validateSign()` — all 4 ADA checks:
  - Character height below 5/8" minimum → error
  - Character height above 2" maximum → warning
  - Pictogram field below 6" minimum → error
  - Contrast ratio below 3:1 → error, between 3:1 and 4.5:1 → warning
  - Hidden braille zone → error
  - Fully compliant sign → no issues

#### 2. `src/lib/braille.ts`
**Risk: HIGH** — Incorrect braille output is an accessibility failure.

Tests needed:
- `textToBrailleCells()`:
  - Single lowercase letter → correct dot pattern
  - Uppercase letters → treated as lowercase
  - Single digit → number indicator + digit pattern
  - Consecutive digits → single number indicator prefix
  - Mixed text and numbers → indicator resets after space
  - Space → empty cell
  - Unknown characters → skipped silently
  - Empty string → empty array

#### 3. `src/lib/layout-engine.ts`
**Risk: HIGH** — Layout miscalculations cause visual defects in sign rendering.

Tests needed:
- `calculateLayout()`:
  - Single visible zone fills available height
  - Multiple zones stack vertically with correct y-offsets
  - Fixed-height zones (braille=14px, divider=6px) are exact
  - Flexible zones respect min/max percent constraints
  - Backer zone renders at full sign dimensions behind others
  - Hidden zones are excluded from layout
  - Zones sorted by `order` property
  - Edge case: zero visible zones → empty layout
  - Edge case: all flexible zones → distribute evenly

#### 4. `src/lib/color-utils.ts`
**Risk: MEDIUM** — Color conversion errors cascade into contrast/display issues.

Tests needed:
- `hexToRgb()` — 3-char shorthand, 6-char, with/without `#` prefix
- `rgbToHex()` — round-trip consistency, clamping at 0 and 255
- `getContrastColor()` — returns `#000000` for light backgrounds, `#FFFFFF` for dark

#### 5. `src/lib/token-resolver.ts`
**Risk: MEDIUM** — Token resolution drives all styling throughout the app.

Tests needed:
- `resolveTokens()` — later layers override earlier ones, all keys merged
- `resolveStyleBinding()` — existing token key returns value, missing key returns binding string as-is

---

### Tier 2 — State Management (Zustand Stores)

These stores drive all application state. Zustand stores are plain functions outside React and are straightforward to test.

#### 6. `src/stores/configurator-store.ts`
**Risk: MEDIUM** — Broken step navigation blocks the entire configurator flow.

Tests needed:
- `nextStep()` / `prevStep()` — increment/decrement correctly, clamp at boundaries
- `goToStep()` — clamps to valid range, sets correct transition direction
- `canGoNext` / `canGoPrev` — updated correctly at first step, last step, and middle
- `reset()` — returns to initial state

#### 7. `src/stores/editor-store.ts`
Tests needed:
- Each setter updates only its target field
- Default values are correct

#### 8. `src/stores/package-store.ts`
Tests needed:
- Adding/removing sign types from a package
- Updating design tokens propagates correctly
- Serialization/deserialization round-trips

#### 9. `src/stores/color-store.ts`
Tests needed:
- Color selection and palette management actions

---

### Tier 3 — Integration / API Layer (requires mocking)

#### 10. `src/lib/persistence.ts`
**Risk: HIGH** — Data loss or corruption if save/load is broken.

Tests needed (with mocked Supabase client):
- `savePackage()` — insert vs. update path, unauthenticated → throws
- `loadPackage()` — returns deserialized package, not-found → null
- `loadSharedPackage()` — loads by share token
- `createShareLink()` — generates token and returns URL
- `listMyPackages()` — returns mapped results
- `submitForQuote()` — updates status to 'submitted'

#### 11. `src/lib/pdf-export.ts`
Tests needed:
- PDF generation produces valid output (snapshot or structure test)
- All sign types in a package are included

---

### Tier 4 — Component Tests (most effort, but important for UI correctness)

Priority components to test with React Testing Library:

#### 12. `src/components/configurator/StepNav.tsx` / `StepProgress.tsx`
- Navigation buttons render, disabled states match store
- Step indicator shows correct active step

#### 13. `src/components/summary/ADAStatus.tsx`
- Renders errors/warnings from ADA engine output
- Shows "compliant" when no issues

#### 14. `src/components/svg/zones/BrailleZone.tsx`
- Renders correct dot patterns for given text

#### 15. `src/components/color-system/ColorPicker.tsx` / `ColorSwatch.tsx`
- Color selection fires correct callbacks
- Swatch displays the right color

---

### Tier 5 — E2E Tests (future)

Once unit and integration coverage is solid, add Playwright or Cypress for:
- Full configurator flow: family → type → material → colors → content → review
- Save and reload a package
- Share link generation and viewing
- PDF export download

---

## Suggested Test File Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── ada-engine.test.ts
│   │   ├── braille.test.ts
│   │   ├── layout-engine.test.ts
│   │   ├── color-utils.test.ts
│   │   ├── token-resolver.test.ts
│   │   └── persistence.test.ts
│   └── ...
├── stores/
│   ├── __tests__/
│   │   ├── configurator-store.test.ts
│   │   ├── editor-store.test.ts
│   │   ├── package-store.test.ts
│   │   └── color-store.test.ts
│   └── ...
└── components/
    └── (co-located *.test.tsx files next to components)
```

---

## Summary

| Tier | Area | Files | Effort | Impact |
|------|------|-------|--------|--------|
| 1 | Pure business logic | 5 modules | Low | Very High |
| 2 | Zustand stores | 4 stores | Low | High |
| 3 | API/integration | 2 modules | Medium | High |
| 4 | React components | ~10 key components | Medium-High | Medium |
| 5 | E2E flows | 4-5 scenarios | High | Medium |

**Recommended starting point:** Tier 1 (ada-engine, braille, layout-engine, color-utils, token-resolver) — these 5 files contain the core business logic, are pure functions, and can be fully tested with zero mocking. This would cover the highest-risk code with the least effort.
