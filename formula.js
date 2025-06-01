// Formula Data Structure and Logic
// Handles the internal representation of logical formulas
// Provides validation and creation functions for WFF tiles

// Unique ID generator for tiles (simple counter for MVP)
let tileIdCounter = 0;
function generateUniqueId() {
    return `tile-${++tileIdCounter}`;
}

// Formula Tile Constructor - represents any well-formed formula
function createFormulaTile(structure, displayString) {
    return {
        id: generateUniqueId(),        // Unique identifier for DOM tracking
        display: displayString,        // Human-readable string like "[A]" or "[(A∧B)]"
        structure: structure,          // Internal logical structure (see below)
        isBeingDragged: false          // UI state tracking (optional)
    };
}

// Internal Structure Types:
// Atomic:     { type: 'atomic', value: 'A' }
// Negation:   { type: 'negation', operand: <structure> }
// Binary:     { type: 'conjunction'|'disjunction'|'conditional'|'biconditional', leftOperand: <structure>, rightOperand: <structure> }

// Utility function to convert structure to display string
function structureToDisplayString(structure) {
    switch (structure.type) {
        case 'atomic':
            return `${structure.value}`;
        case 'negation':
            // Remove outer brackets from operand for correct display
            return `¬${structureToDisplayString(structure.operand)}`;
        case 'conjunction':
        case 'disjunction':
        case 'conditional':
        case 'biconditional':
            const opSymbols = {
                conjunction: '∧',
                disjunction: '∨',
                conditional: '→',
                biconditional: '↔'
            };
            const left = structureToDisplayString(structure.leftOperand);
            const right = structureToDisplayString(structure.rightOperand);
            return `(${left} ${opSymbols[structure.type]} ${right})`;
        default:
            return '[?]';
    }
}

// Validation Functions (for extensibility, not strictly needed for MVP)
function isValidFormulaTile(tile) {
    // Check if tile has required properties and a valid structure
    return tile && tile.id && tile.display && tile.structure;
}

function canTileBeUsedInForge(formulaTile, forgeType, slotPosition) {
    // For MVP: any valid formula tile can be used in any slot
    return isValidFormulaTile(formulaTile);
}

// Configuration object for all forge types (for DRY code)
const FORGE_CONFIGS = {
    negation: {
        ruleText: "If P is a sentence, then ¬P is a sentence.",
        template: "¬ [DROP_SLOT]",
        buttonText: "Create ¬P",
        slotsNeeded: 1,
        operatorSymbol: "¬"
    },
    conjunction: {
        ruleText: "If P and Q are sentences, then (P ∧ Q) is a sentence.",
        template: "( [DROP_SLOT_LEFT] ∧ [DROP_SLOT_RIGHT] )",
        buttonText: "Create (P∧Q)",
        slotsNeeded: 2,
        operatorSymbol: "∧"
    },
    disjunction: {
        ruleText: "If P and Q are sentences, then (P ∨ Q) is a sentence.",
        template: "( [DROP_SLOT_LEFT] ∨ [DROP_SLOT_RIGHT] )",
        buttonText: "Create (P∨Q)",
        slotsNeeded: 2,
        operatorSymbol: "∨"
    },
    conditional: {
        ruleText: "If P and Q are sentences, then (P → Q) is a sentence.",
        template: "( [DROP_SLOT_LEFT] → [DROP_SLOT_RIGHT] )",
        buttonText: "Create (P→Q)",
        slotsNeeded: 2,
        operatorSymbol: "→"
    },
    biconditional: {
        ruleText: "If P and Q are sentences, then (P ↔ Q) is a sentence.",
        template: "( [DROP_SLOT_LEFT] ↔ [DROP_SLOT_RIGHT] )",
        buttonText: "Create (P↔Q)",
        slotsNeeded: 2,
        operatorSymbol: "↔"
    }
};

// Available atomic sentence letters
const AVAILABLE_ATOMICS = ['A', 'B', 'C', 'D', 'E', 'P', 'Q', 'R', 'S', 'T'];

// Function to create atomic tiles
function createAtomicTile(letter) {
    return createFormulaTile(
        { type: 'atomic', value: letter },
        `${letter}`
    );
}

function structuresAreEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    if (a.type !== b.type) return false;
    switch (a.type) {
        case 'atomic':
            return a.value === b.value;
        case 'negation':
            return structuresAreEqual(a.operand, b.operand);
        case 'conjunction':
        case 'disjunction':
        case 'conditional':
        case 'biconditional':
            return (
                structuresAreEqual(a.leftOperand, b.leftOperand) &&
                structuresAreEqual(a.rightOperand, b.rightOperand)
            );
        default:
            return false;
    }
}