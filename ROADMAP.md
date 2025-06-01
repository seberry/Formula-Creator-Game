# Formula Factory: Interactive Well-Formed Formula (WFF) Builder

## Project Purpose

Visually teach the recursive definition of well-formed formulas (WFFs) in sentential logic through interactive, hands-on construction using a digital "Formula Factory."

---

## Core Concepts

- **Rule Forges**: Static, always-visible area displaying each WFF formation rule as an interactive "Forge" (machine).
- **Workspace**: Dynamic area where users construct formulas by dragging, dropping, and combining formula tiles according to the rules.

---

## Data Structures

### Formula Tile

Represents a WFF (well-formed formula).

```js
{
  id: string,                    // Unique identifier for each tile
  display: string,               // Human-readable display, e.g. "(A∧¬B)"
  structure: object              // Recursive representation (see below)
}
```

#### Example `structure` formats:

- **Atomic:**  
  `{ type: 'atomic', value: 'A' }`

- **Negation:**  
  `{ type: 'negation', operand: <FormulaTile.structure> }`

- **Binary:**  
  ```
  {
    type: 'conjunction' | 'disjunction' | 'conditional' | 'biconditional',
    left: <FormulaTile.structure>,
    right: <FormulaTile.structure>
  }
  ```

---

## UI Components & Functionality

### 1. Rule Forges Area (Static Top Section)

Displays six interactive rules for WFF formation:

- **a. Atomic Sentence Rule & Source:**
  - Text: "Every atomic sentence (A, B, C, etc.) is a sentence."
  - UI: Draggable Atomic Tiles ([A], [B], [C], ...)
  - Action: Drag atomic tiles into Workspace or as inputs for other Forges.

- **b. Negation Forge:**
  - Text: "If P is a sentence, then ¬P is a sentence."
  - UI: `¬ [DROP_SLOT_P]` with "Forge ¬P" button.
  - Action: Drag a sentence tile into slot, button enables, click to mint new ¬P tile.

- **c. Conjunction Forge:**
  - Text: "If P and Q are sentences, then (P ∧ Q) is a sentence."
  - UI: `( [DROP_SLOT_P] ∧ [DROP_SLOT_Q] )` with "Forge (P∧Q)" button.

- **d. Disjunction Forge:**
  - Text: "If P and Q are sentences, then (P ∨ Q) is a sentence."
  - UI: `( [DROP_SLOT_P] ∨ [DROP_SLOT_Q] )` with "Forge (P∨Q)" button.

- **e. Conditional Forge:**
  - Text: "If P and Q are sentences, then (P → Q) is a sentence."
  - UI: `( [DROP_SLOT_P] → [DROP_SLOT_Q] )` with "Forge (P→Q)" button.

- **f. Biconditional Forge:**
  - Text: "If P and Q are sentences, then (P ↔ Q) is a sentence."
  - UI: `( [DROP_SLOT_P] ↔ [DROP_SLOT_Q] )` with "Forge (P↔Q)" button.

> **Note:** All binary formulas display with full parentheses, e.g., "(A∧¬B)".

---

### 2. Workspace Area (Dynamic Bottom Section)

- Where all user-created formula tiles appear.
- All tiles are draggable—can be used as inputs for any Forge.
- Workspace is dynamic and grows as the user creates more formulas.

---

## Core Interaction Logic

- **Drag and Drop:** Users drag atomic or existing tiles into Forge slots.
- **Validation:** Forge "Create" buttons only enable if all required slots are filled with valid tiles.
- **Tile Creation:** Clicking an enabled Forge button mints a new formula tile, adds it to the Workspace.
- **Recursive Building:** Any formula in the Workspace can be used to build more complex formulas.
- **Enforced Well-Formedness:** Only Forges can create new tiles—guaranteeing all formulas are valid.

---

## Tech Stack

- JavaScript, HTML, CSS.
- (Recommended) React or Svelte for UI.
- Drag-and-drop library (e.g., react-beautiful-dnd, Dnd Kit).

---

## MVP Feature Checklist

- [ ] Display all six Rule Forges with interactive input slots and create buttons.
- [ ] Show draggable atomic tiles ([A], [B], [C], etc.).
- [ ] Implement drag-and-drop from both Atomic Source and Workspace to Forge slots.
- [ ] Enable creation of new tiles only with valid inputs.
- [ ] All created tiles are draggable in the Workspace and can be reused in forges.
- [ ] Full parentheses on all binary formulas.

---

## Future Extensions (Post-MVP)

- [ ] Generate random WFFs (of limited depth) as goals or challenges.
- [ ] Scoring system and/or timed challenge mode.
- [ ] Optional: Smarter parentheses display (omit outermost when unambiguous).
- [ ] Accessibility improvements (keyboard navigation, ARIA).
- [ ] Export/share formulas or workspace state.
- [ ] User onboarding/tutorial.

---

## References and Inspirations

- Project repo: [seberry/Formula-Creator-Game](https://github.com/seberry/Formula-Creator-Game)
- Sentential logic textbook: *forall x*

---

## How to Use This Roadmap

- Use this file to align on requirements, split up development tasks, and onboard collaborators.
- Update as new features are implemented or plans change.
