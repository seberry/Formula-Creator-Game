// Project: Interactive Well-Formed Formula (WFF) Builder - "Formula Factory"
// Now: Make atomic tiles draggable (no need to highlight targets; all slots are valid).

let currentTargetFormula = null;

document.addEventListener("DOMContentLoaded", () => {
    renderAtomicSourceForge();
    renderAllForges();
    renderWorkspaceTiles(); // (empty stub)
    renderTargetArea(); 
});

// --- Forge UI Rendering ---

function renderAtomicSourceForge() {
    const atomicLetters = ['A', 'B', 'C', 'D', 'E', 'P', 'Q', 'R', 'S', 'T'];
    const div = document.getElementById('atomic-source-forge');
    div.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'forge-header';
    header.innerText = "Atomic Sentences";
    div.appendChild(header);

    const rule = document.createElement('div');
    rule.className = 'forge-rule';
    rule.innerText = "Every atomic sentence (A, B, C, etc.) is a sentence.";
    div.appendChild(rule);

    const tileRow = document.createElement('div');
    for (const letter of atomicLetters) {
    const tile = document.createElement('div');
    tile.className = 'atomic-tile';
    tile.innerText = `${letter}`;
    tile.setAttribute('draggable', 'true');
    
    // 1. Attach the formula structure as a property for access elsewhere
    tile.formulaData = { type: 'atomic', value: letter };

    // 2. In dragstart, transfer the formula structure as JSON
    tile.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('application/json', JSON.stringify(tile.formulaData)); // <-- key change here!
        event.dataTransfer.effectAllowed = 'copy';
        tile.classList.add('dragging');
    });

    tile.addEventListener('dragend', (event) => {
        tile.classList.remove('dragging');
    });
    tileRow.appendChild(tile);
}
    div.appendChild(tileRow);
}


// --- Workspace stub (empty for now) ---
function renderWorkspaceTiles() {
    // Will render formula tiles in #workspace-tiles-area
}

function renderAllForges() {
    const container = document.getElementById('rule-forges-container');
    container.innerHTML = '';
    container.appendChild(renderNegationForge());
    container.appendChild(renderBinaryForge('conjunction', '∧', "If P and Q are sentences, then (P ∧ Q) is a sentence."));
    container.appendChild(renderBinaryForge('disjunction', '∨', "If P and Q are sentences, then (P ∨ Q) is a sentence."));
    container.appendChild(renderBinaryForge('conditional', '→', "If P and Q are sentences, then (P → Q) is a sentence."));
    container.appendChild(renderBinaryForge('biconditional', '↔', "If P and Q are sentences, then (P ↔ Q) is a sentence."));
}

function renderNegationForge() {
    const div = document.createElement('div');
    div.className = 'forge-item';
    div.id = 'negation-forge';

    const header = document.createElement('div');
    header.className = 'forge-header';
    header.innerText = "Negation Forge";
    div.appendChild(header);

    const rule = document.createElement('div');
    rule.className = 'forge-rule';
    rule.innerText = "If P is a sentence, then ¬P is a sentence.";
    div.appendChild(rule);

    // Drop slot
    const dropRow = document.createElement('div');
    const dropSlot = document.createElement('span');
    dropSlot.className = 'forge-drop-slot';
    dropSlot.id = "negation-slot";
    // Make slot a drop target:
    enableForgeSlotDropping(dropSlot);
    dropRow.innerHTML = '¬ ';
    dropRow.appendChild(dropSlot);
    div.appendChild(dropRow);

    // Disabled button
    const btn = document.createElement('button');
    btn.className = 'forge-button';
    btn.innerText = "Create ¬P";
    btn.disabled = true;
    div.appendChild(btn);
    btn.addEventListener('click', () => {
    const slot = div.querySelector('.forge-drop-slot');
    const innerTile = slot.querySelector('.formula-tile');
    if (!innerTile) return;

    // Get the operand structure from the dropped tile
    const operandStructure = innerTile.formulaData;

    // Build the negation structure
    const negStructure = { type: 'negation', operand: operandStructure };

    // Use your utility to create a new display string
    const negDisplay = structureToDisplayString(negStructure);

    // Create the new workspace tile
    const workspace = document.getElementById('workspace-tiles-area');
    const newTile = document.createElement('div');
    newTile.className = 'formula-tile';
    newTile.innerText = negDisplay;
    newTile.formulaData = negStructure;
    // Make the new tile draggable for further use!
    newTile.setAttribute('draggable', 'true');
    newTile.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('application/json', JSON.stringify(negStructure));
        event.dataTransfer.effectAllowed = 'copy';
        newTile.classList.add('dragging');
    });
    newTile.addEventListener('dragend', (event) => {
        newTile.classList.remove('dragging');
    });
    workspace.appendChild(newTile);

    // Reset the forge
    slot.innerHTML = '';
    btn.disabled = true;
});


    return div;
}

function renderBinaryForge(type, symbol, ruleText) {
    const div = document.createElement('div');
    div.className = 'forge-item';
    div.id = `${type}-forge`;

    const header = document.createElement('div');
    header.className = 'forge-header';
    header.innerText = type.charAt(0).toUpperCase() + type.slice(1) + " Forge";
    div.appendChild(header);

    const rule = document.createElement('div');
    rule.className = 'forge-rule';
    rule.innerText = ruleText;
    div.appendChild(rule);

    // Left slot
    const leftSlot = document.createElement('span');
    leftSlot.className = 'forge-drop-slot';
    leftSlot.id = `${type}-left-slot`;
    enableForgeSlotDropping(leftSlot);
    // Right slot
    const rightSlot = document.createElement('span');
    rightSlot.className = 'forge-drop-slot';
    rightSlot.id = `${type}-right-slot`;
    enableForgeSlotDropping(rightSlot);

    // Correct drop row construction
    const dropRow = document.createElement('div');
    dropRow.append(document.createTextNode('( '));
    dropRow.appendChild(leftSlot);
    dropRow.append(document.createTextNode(` ${symbol} `));
    dropRow.appendChild(rightSlot);
    dropRow.append(document.createTextNode(' )'));
    div.appendChild(dropRow);

    const btn = document.createElement('button');
    btn.className = 'forge-button';
    btn.innerText = `Create (${symbol}) Formula`;
    btn.disabled = true;
    div.appendChild(btn);
    btn.addEventListener('click', () => {
        const leftTile = leftSlot.querySelector('.formula-tile');
        const rightTile = rightSlot.querySelector('.formula-tile');
        if (!leftTile || !rightTile) return;

        // Get the operand structures from the dropped tiles
        const leftStructure = leftTile.formulaData;
        const rightStructure = rightTile.formulaData;

        // Build the binary structure
        const structure = {
            type,
            leftOperand: leftStructure,
            rightOperand: rightStructure
        };

        // Use your utility to create a new display string
        const display = structureToDisplayString(structure);

        // Create the new workspace tile
        const workspace = document.getElementById('workspace-tiles-area');
        const newTile = document.createElement('div');
        newTile.className = 'formula-tile';
        newTile.innerText = display;
        newTile.formulaData = structure;
        newTile.setAttribute('draggable', 'true');
        newTile.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('application/json', JSON.stringify(structure));
            event.dataTransfer.effectAllowed = 'copy';
            newTile.classList.add('dragging');
        });
        newTile.addEventListener('dragend', (event) => {
            newTile.classList.remove('dragging');
        });
        workspace.appendChild(newTile);

        // Reset the forge slots and disable the button
        leftSlot.innerHTML = '';
        rightSlot.innerHTML = '';
        btn.disabled = true;
    });

    return div;
}
// --- New helper: Enable dropping on a forge slot ---
function enableForgeSlotDropping(slotElem) {
    slotElem.addEventListener('dragover', (event) => {
        event.preventDefault(); // Allow drop!
    });
    slotElem.addEventListener('drop', (event) => {
        event.preventDefault();
        // Only allow one tile per slot; ignore further drops
        if (slotElem.querySelector('.formula-tile')) return;

        // Try to get the formula structure from the drop event
let structureJSON = event.dataTransfer.getData('application/json');
if (!structureJSON) return;
let formulaStructure;
try {
    formulaStructure = JSON.parse(structureJSON);
} catch (e) {
    return; // Invalid drop
}

// Place a visual tile in the slot
const tile = document.createElement('div');
tile.className = 'formula-tile';
tile.innerText = structureToDisplayString(formulaStructure);
tile.formulaData = formulaStructure; // Attach structure for later use
slotElem.appendChild(tile);

// Enable the Negation Forge button if this is the negation slot
if (slotElem.id === "negation-slot") {
    const forge = document.getElementById('negation-forge');
    const btn = forge.querySelector('.forge-button');
    btn.disabled = false;
}

// Check if this is a binary forge slot
if (slotElem.id.endsWith('-left-slot') || slotElem.id.endsWith('-right-slot')) {
    // Find the parent forge div (2 levels up from the slot)
    let forgeDiv = slotElem.closest('.forge-item');
    if (!forgeDiv) return;

    // Find both slots within this forge
    const leftSlot = forgeDiv.querySelector('.forge-drop-slot[id$="-left-slot"]');
    const rightSlot = forgeDiv.querySelector('.forge-drop-slot[id$="-right-slot"]');
    const btn = forgeDiv.querySelector('.forge-button');

    // Enable the button if both slots are filled with a tile
    if (leftSlot && rightSlot &&
        leftSlot.querySelector('.formula-tile') &&
        rightSlot.querySelector('.formula-tile')) {
        btn.disabled = false;
    }
}      
       
    });
}


function renderTargetArea() {
    const workspace = document.getElementById('workspace-tiles-area');
    // Remove old target area if exists
    let oldTarget = document.getElementById('target-area');
    if (oldTarget) oldTarget.remove();

    const targetDiv = document.createElement('div');
    targetDiv.id = 'target-area';
    targetDiv.style.marginTop = '36px';

    // Button
    const btn = document.createElement('button');
    btn.innerText = "Generate a sample sentence for me to build";
    btn.id = "new-target-btn";
    btn.style.marginBottom = '18px';
    targetDiv.appendChild(btn);
    btn.addEventListener('click', () => {
    // Generate a new random formula (depth 2 or 3 is reasonable)
    const formula = generateRandomFormula(2);
    currentTargetFormula = formula;

    // Display it nicely in the target formula area
    const targetText = document.getElementById('target-formula-display');
    targetText.style.margin = '0 0 14px 0';
    targetText.innerText = "Target: " + structureToDisplayString(formula);

    // Clear feedback and answer slot
    document.getElementById('target-feedback').innerText = "";
    const answerSlot = document.getElementById('target-drop-slot');
    answerSlot.innerHTML = "";
});

    const challengeBlurb = document.createElement('div');
    challengeBlurb.innerText = "Challenge: Build the formula below!";
    challengeBlurb.style.fontWeight = 'bold';
    challengeBlurb.style.marginBottom = '8px';
    challengeBlurb.style.color = '#cc8600';
    challengeBlurb.style.fontSize = '1.12em';
    targetDiv.appendChild(challengeBlurb);

    // Target formula display
    const targetText = document.createElement('div');
    targetText.id = 'target-formula-display';
    targetText.style.fontWeight = 'bold';
    targetText.style.margin = '12px 0';
    targetText.innerText = 'Target: (waiting...)';
    targetDiv.appendChild(targetText);

    // Drop slot for student answer
    const answerRow = document.createElement('div');
    answerRow.style.margin = '12px 0';
    const answerLabel = document.createElement('span');
    answerLabel.innerText = "Drop your answer here: ";
    answerRow.appendChild(answerLabel);

    const answerSlot = document.createElement('span');
    answerSlot.className = 'target-drop-slot';
    answerSlot.id = 'target-drop-slot';
    answerSlot.style.display = 'inline-block';
    answerSlot.style.minWidth = '160px';
    answerSlot.style.minHeight = '32px';
    answerSlot.style.border = '2px dashed #888';
    answerSlot.style.background = '#fafaff';
    answerSlot.style.verticalAlign = 'middle';
    answerRow.appendChild(answerSlot);
    answerSlot.addEventListener('drop', (event) => {
    event.preventDefault();
    // Remove any previous tile
    answerSlot.innerHTML = '';

    // Get the dropped formula structure
    let structureJSON = event.dataTransfer.getData('application/json');
    if (!structureJSON) return;
    let studentFormula;
    try {
        studentFormula = JSON.parse(structureJSON);
    } catch (e) { return; }

    // Show the dropped formula
    const tile = document.createElement('div');
    tile.className = 'formula-tile';
    tile.innerText = structureToDisplayString(studentFormula);
    answerSlot.appendChild(tile);

    // Compare
    const correct = structuresAreEqual(studentFormula, currentTargetFormula);
    const feedback = document.getElementById('target-feedback');
    if (correct) {
        feedback.innerText = "✅ Correct! Well done.";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "❌ Not quite. Try again!";
        feedback.style.color = "red";
    }
});

    targetDiv.appendChild(answerRow);

    // Feedback area
    const feedback = document.createElement('div');
    feedback.id = 'target-feedback';
    feedback.style.minHeight = '24px';
    targetDiv.appendChild(feedback);

    // Append to workspace area (or wherever you want)
    workspace.parentNode.appendChild(targetDiv);


     answerSlot.addEventListener('dragover', (event) => event.preventDefault());
    // answerSlot.addEventListener('drop', (event) => {
    //     event.preventDefault();
    //     answerSlot.innerHTML = '<em>Drop detected! (logic coming soon)</em>';
    //     // Feedback logic to come!
    // });
}


function generateRandomFormula(maxDepth = 2) {
    // List of possible connectives
    const binaryConnectives = ['conjunction', 'disjunction', 'conditional', 'biconditional'];
    const allConnectives = ['negation', ...binaryConnectives];
    const atomics = ['A', 'B', 'C', 'D', 'E', 'P', 'Q', 'R', 'S', 'T'];

    function build(depth) {
        // If at max depth, only allow atomic
        if (depth >= maxDepth) {
            return { type: 'atomic', value: atomics[Math.floor(Math.random() * atomics.length)] };
        }

        // Randomly decide: atomic or connective
        const makeAtomic = Math.random() < 0.35; // Tune this for desired frequency
        if (makeAtomic) {
            return { type: 'atomic', value: atomics[Math.floor(Math.random() * atomics.length)] };
        }

        // Pick a connective
        const connective = allConnectives[Math.floor(Math.random() * allConnectives.length)];
        if (connective === 'negation') {
            return { type: 'negation', operand: build(depth + 1) };
        } else {
            // Binary connective
            return {
                type: connective,
                leftOperand: build(depth + 1),
                rightOperand: build(depth + 1)
            };
        }
    }

    return build(0);
}
