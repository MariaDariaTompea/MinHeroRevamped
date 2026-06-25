// Game State
const state = {
    collection: [
        { name: 'Tigrier', level: 1 },
        { name: 'Ticub', level: 1 }
    ],
    army: [
        { name: 'Tigrier', level: 1 },
        { name: 'Ticub', level: 1 }
    ],
    currentLevel: null,
    unlockedFloor: 1,
    unlockedRoom: 1,
    dotsCompleted: 0,
    stars: 0,
    money: 0,
    skills: {
        health: { rank: 0, cost: 10, name: 'Health Boost', icon: '❤️' },
        attack: { rank: 0, cost: 10, name: 'Damage Up', icon: '☀️' },
        speed: { rank: 0, cost: 10, name: 'Haste', icon: '⚡' },
        healing: { rank: 0, cost: 10, name: 'Heal Up', icon: '🩹' },
        xpBoost: { rank: 0, cost: 15, name: 'XP Boost', icon: '📈' },
        coinBoost: { rank: 0, cost: 15, name: 'Coin Magnet', icon: '💰' },
        critChance: { rank: 0, cost: 20, name: 'Critical Hit', icon: '🦷' },
        dodgeChance: { rank: 0, cost: 20, name: 'Evade', icon: '🥾' }
    }
};

// Available template minions to hatch
const availableMinions = ['Tigrier', 'Ticub', 'Zapig', 'Minion3', 'Minion4', 'Minion5'];

// DOM Elements
const screenIntro = document.getElementById('screen-intro');
const screenMain = document.getElementById('screen-main');
const screenCollection = document.getElementById('screen-collection');
const screenCombat = document.getElementById('screen-combat');
const screenEgg = document.getElementById('screen-egg');

const topMenu = document.getElementById('top-menu');
const btnMenu = document.getElementById('btn-menu');
const menuOverlay = document.getElementById('menu-overlay');
const btnMenuCollection = document.getElementById('btn-menu-collection');
const btnMenuTeam = document.getElementById('btn-menu-team');
const btnMenuHero = document.getElementById('btn-menu-hero');
const btnMenuResume = document.getElementById('btn-menu-resume');
let preMenuScreen = screenMain;

// Hero Profile DOM
const screenHero = document.getElementById('screen-hero');
const heroNameDisplay = document.getElementById('hero-name-display');
const heroMoneyDisplay = document.getElementById('hero-money-display');
const heroPediaDisplay = document.getElementById('hero-pedia-display');
const heroStarCount = document.getElementById('hero-star-count');
const skillsGrid = document.querySelector('.skills-grid');
const btnHeroReset = document.getElementById('btn-hero-reset');
const btnHeroReturn = document.getElementById('btn-hero-return');

// Team Overlay DOM
const teamOverlay = document.getElementById('team-overlay');
const btnCloseTeam = document.getElementById('btn-close-team');
const teamListContainer = document.getElementById('team-list-container');

// Collection DOM
const colCurrentTeam = document.getElementById('col-current-team');
const colGrid = document.getElementById('col-grid');
const btnColReturn = document.getElementById('btn-col-return');

// Detail Panel DOM
const detailSprite = document.getElementById('detail-sprite');
const detailName = document.getElementById('detail-name');
const detailHpFillSmall = document.getElementById('detail-hp-fill');
const detailEnFillSmall = document.getElementById('detail-en-fill');
const detailLevel = document.getElementById('detail-level');
const valHealth = document.getElementById('val-health');
const valEnergy = document.getElementById('val-energy');
const valAttack = document.getElementById('val-attack');
const valHealing = document.getElementById('val-healing');
const valSpeed = document.getElementById('val-speed');

const towerStructure = document.getElementById('tower-structure');
const minionList = document.getElementById('minion-list');

const genderBtns = document.querySelectorAll('.gender-btn');
const btnStartAdventure = document.getElementById('btn-start-adventure');
const stoneDoorsLeft = document.getElementById('stone-doors-left');
const stoneDoorsRight = document.getElementById('stone-doors-right');
const fadeOverlay = document.getElementById('fade-overlay');

const btnPlay = document.getElementById('btn-play');
const saveSlotsContainer = document.getElementById('save-slots');
const slots = document.querySelectorAll('.slot');
const characterCreation = document.getElementById('character-creation');
const charNameInput = document.getElementById('char-name');
const levelBtns = document.querySelectorAll('.level-btn');
const levelMapPopup = document.getElementById('level-map-popup');
const dotsContainer = document.getElementById('dots-container');
const eggs = document.querySelectorAll('.egg');

// Combat DOM
const combatLog = document.getElementById('combat-log');
const enemySide = document.getElementById('enemy-side');
const playerSide = document.getElementById('player-side');
const btnRunCorner = document.getElementById('btn-run-corner');
const combatVignette = document.getElementById('combat-vignette');

function setTurnIndicator(playerMinion, enemyMinion) {
    const pSlot = document.getElementById(`p-slot-${combatState.players.indexOf(playerMinion)}`);
    if(pSlot) pSlot.classList.add('active-turn');
    
    const eSlot = document.getElementById(`e-slot-${combatState.enemies.indexOf(enemyMinion)}`);
    if(eSlot) eSlot.classList.add('active-turn');
}

// --- Navigation ---
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

btnMenu.addEventListener('click', () => {
    menuOverlay.classList.remove('hidden');
    // Track what screen we were on before opening the menu
    const activeScreen = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));
    if(activeScreen && activeScreen.id !== 'screen-collection') {
        preMenuScreen = activeScreen;
    }
});

btnMenuCollection.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
    updateCollectionUI();
    showScreen(screenCollection);
});

btnMenuTeam.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
    updateTeamOverlayUI();
    teamOverlay.classList.remove('hidden');
});

btnCloseTeam.addEventListener('click', () => {
    teamOverlay.classList.add('hidden');
});

btnMenuHero.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
    updateHeroUI();
    showScreen(screenHero);
});

btnHeroReturn.addEventListener('click', () => {
    showScreen(preMenuScreen || screenMain);
});

btnColReturn.addEventListener('click', () => {
    showScreen(preMenuScreen || screenMain);
});

btnMenuResume.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
    const activeScreen = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));
    if(activeScreen && (activeScreen.id === 'screen-collection' || activeScreen.id === 'screen-hero')) {
        showScreen(preMenuScreen || screenMain);
    }
});

// --- Tower Logic ---
function buildTower() {
    const towerStructure = document.getElementById('tower-structure');
    if(!towerStructure) return;
    
    towerStructure.innerHTML = '';
    
    // We have 7 worlds, 3 stages per world
    for (let floor = 1; floor <= 7; floor++) {
        for (let room = 1; room <= 3; room++) {
            const floorDiv = document.createElement('div');
            floorDiv.classList.add('tower-floor');
            
            // Check status
            let status = 'locked';
            if (floor < state.unlockedFloor || (floor === state.unlockedFloor && room < state.unlockedRoom)) {
                status = 'cleared';
            } else if (floor === state.unlockedFloor && room === state.unlockedRoom) {
                status = 'active';
            }
            
            // ALWAYS add the golden number
            const labelHtml = `<div class="floor-text-cleared" style="position: absolute; top: 15px; font-size: 40px; width: 100%; text-align: center; z-index: 10;">${room}/${floor}</div>`;
            
            if (status === 'cleared') {
                floorDiv.innerHTML = labelHtml;
                floorDiv.addEventListener('click', () => {
                    startLevelCombat(floor, room, room === 3);
                });
            } else if (status === 'active') {
                const isBoss = (room === 3);
                floorDiv.innerHTML = labelHtml + `
                    <div style="z-index: 5; font-size: 60px; text-shadow: 2px 2px 4px #000; margin-top: 30px;">${isBoss ? '👹' : '⚔️'}</div>
                `;
                floorDiv.addEventListener('click', () => {
                    startLevelCombat(floor, room, isBoss);
                });
            } else {
                floorDiv.innerHTML = labelHtml + `
                    <div class="floor-locked-overlay"></div>
                    <img src="assets/towerpage/lock.png" alt="Locked" style="z-index: 7; height: 60px; object-fit: contain; margin-top: 30px; opacity: 0.9; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.8));">
                `;
            }
            
            towerStructure.appendChild(floorDiv);
        }
    }
    
    // Scroll to the bottom where the active level is usually located (after DOM updates)
    setTimeout(() => {
        const container = document.getElementById('tower-scroll-container');
        if(container) {
            container.scrollTop = container.scrollHeight;
        }
    }, 50);
}

function startLevelCombat(floor, room, isBoss) {
    // FORCING 5 TIGRIERS FOR TESTING LAYOUT
    state.army = [
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 }
    ];

    if(state.army.length === 0) {
        alert("You have no minions in your army! Check your collection.");
        return;
    }
    
    combatState.currentFloor = floor;
    combatState.currentRoom = room;
    startCombat(null, isBoss);
}

// --- Egg Hatching Logic ---
eggs.forEach(egg => {
    egg.addEventListener('click', () => {
        // 1. Egg break animation (simple shake/fade for now)
        egg.textContent = '💥';
        
        setTimeout(() => {
            // 2. Reveal minion
            const randomMinion = availableMinions[Math.floor(Math.random() * availableMinions.length)];
            alert(`You hatched a ${randomMinion}! It has been sent to your collection.`);
            
            // 3. Add to state
            state.collection.push({
                name: randomMinion,
                level: 1,
                health: 100,
                energy: 50,
                attack: 10,
                healing: 5,
                speed: 10
            });
            saveGame();
            
            // 4. Reset eggs and go back to map
            eggs.forEach(e => e.textContent = '🥚');
            buildTower(); // Refresh tower UI
            showScreen(screenMain);
        }, 500);
    });
});

// --- Collection UI ---
function updateCollectionUI() {
    minionList.innerHTML = '';
    
    if(state.collection.length === 0) {
        minionList.innerHTML = '<p>Your collection is empty.</p>';
        return;
    }
    
    state.collection.forEach((minion, index) => {
        const card = document.createElement('div');
        card.classList.add('minion-card');
        card.innerHTML = `
            <h3>${minion.name}</h3>
            <p>Lv. ${minion.level}</p>
        `;
        
        // Left click to add to army
        card.addEventListener('click', () => {
            if(confirm(`Do you want to add ${minion.name} to your army?`)) {
                if(state.army.length >= 5) {
                    alert('Army is full! Swap feature coming soon.');
                } else {
                    if(!state.army.includes(minion)) {
                        state.army.push(minion);
                        alert(`${minion.name} added to army!`);
                    }
                }
            }
        });
        
        // Right click for options
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // Simple prompt for now
            const choice = prompt(`Options for ${minion.name}:\n1. Gems\n2. General Stats\n3. Abilities\nEnter number:`);
            if(choice === '2') {
                alert(`Stats for ${minion.name}:\nHP: ${minion.health}\nEnergy: ${minion.energy}\nAttack: ${minion.attack}\nHealing: ${minion.healing}\nSpeed: ${minion.speed}`);
            }
        });
        
        minionList.appendChild(card);
    });
}

// --- Combat Logic ---
let combatState = {
    enemies: [],
    players: [],
    turnQueue: [],
    currentTurnIndex: 0,
    isBoss: false,
    currentFloor: 1,
    currentRoom: 1,
    state: 'INIT' // INIT, WAITING, ANIMATING, END
};

async function fetchMinionStats(name, level = 1) {
    const defaultStats = {
        HEALTH: { value: 80, primary: false },
        ENERGY: { value: 50, primary: false },
        ATTACK: { value: 10, primary: false },
        HEALING: { value: 5, primary: false },
        SPEED: { value: 10, primary: false }
    };
    
    let stats = { ...defaultStats };
    try {
        const response = await fetch(`assets/minions/${name}/abilities/stats.txt`);
        if(response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            const fileStats = {};
            lines.forEach(line => {
                const parts = line.trim().split(' ');
                if (parts.length >= 2) {
                    let statName = parts[0].toUpperCase();
                    let isPrimary = false;
                    if (statName.startsWith('!')) {
                        isPrimary = true;
                        statName = statName.substring(1);
                    } else if (statName.endsWith('!')) {
                        isPrimary = true;
                        statName = statName.substring(0, statName.length - 1);
                    }
                    if (statName === 'ATACK') statName = 'ATTACK';
                    fileStats[statName] = {
                        value: parseInt(parts[1], 10) || 0,
                        primary: isPrimary
                    };
                }
            });
            stats = { ...defaultStats, ...fileStats };
        }
    } catch(e) {
        console.warn(`Could not load stats for ${name}`, e);
    }
    
    // Apply level scaling: +2 for normal, +5 for primary
    const levelScale = (level - 1);
    
    return {
        health: stats.HEALTH.value + (stats.HEALTH.primary ? levelScale * 5 : levelScale * 2),
        energy: stats.ENERGY.value + (stats.ENERGY.primary ? levelScale * 5 : levelScale * 2),
        attack: stats.ATTACK.value + (stats.ATTACK.primary ? levelScale * 5 : levelScale * 2),
        healing: stats.HEALING.value + (stats.HEALING.primary ? levelScale * 5 : levelScale * 2),
        speed: stats.SPEED.value + (stats.SPEED.primary ? levelScale * 5 : levelScale * 2),
    };
}

async function startCombat(dot, isBoss) {
    combatState.isBoss = isBoss;
    combatState.state = 'INIT';
    combatLog.innerHTML = '';
    logCombat('Loading combatants...');
    
    // Generate enemies based on level and boss status
    const numEnemies = isBoss ? 3 : Math.floor(Math.random() * 2) + 1;
    combatState.enemies = [];
    
    for(let i=0; i<numEnemies; i++) {
        const randomName = availableMinions[Math.floor(Math.random() * availableMinions.length)];
        const level = 1;
        const stats = await fetchMinionStats(randomName, level);
        combatState.enemies.push({
            name: (isBoss ? "Boss " : "") + randomName,
            level: level,
            health: isBoss ? stats.health * 2 : stats.health,
            maxHealth: isBoss ? stats.health * 2 : stats.health,
            currentHealth: isBoss ? stats.health * 2 : stats.health,
            energy: stats.energy,
            attack: isBoss ? stats.attack * 1.5 : stats.attack,
            healing: stats.healing,
            speed: stats.speed,
            isDead: false,
            side: 'enemy',
            index: i
        });
    }
    
    // Copy player army for combat
    combatState.players = [];
    for(let i=0; i<state.army.length; i++) {
        const m = state.army[i];
        m.level = 1; // Make all characters level 1 for now!
        const stats = await fetchMinionStats(m.name, m.level);
        combatState.players.push({
            ...m,
            health: stats.health,
            maxHealth: stats.health,
            currentHealth: stats.health,
            energy: stats.energy,
            attack: stats.attack,
            healing: stats.healing,
            speed: stats.speed,
            isDead: false,
            side: 'player',
            index: i
        });
    }
    
    logCombat(`Encountered ${numEnemies} enemies!`);
    renderCombatUI();
    showScreen(screenCombat);
    
    // Add pop-in animation classes
    document.querySelectorAll('.combat-slot').forEach(slot => {
        slot.classList.add('pop-in');
        // remove pop-in class after animation finishes so it doesn't interfere
        setTimeout(() => slot.classList.remove('pop-in'), 500);
    });
    
    setTimeout(() => {
        buildTurnQueue();
        processNextTurn();
    }, 1000);
}

function buildTurnQueue() {
    // Combine all alive combatants
    const allCombatants = [...combatState.players, ...combatState.enemies].filter(c => !c.isDead);
    // Sort descending by speed
    combatState.turnQueue = allCombatants.sort((a, b) => b.speed - a.speed);
    combatState.currentTurnIndex = 0;
}

function processNextTurn() {
    if (checkWinCondition()) return;
    
    combatState.state = 'WAITING';
    
    // Cleanup previous turn UI
    document.querySelectorAll('.combat-slot').forEach(s => s.classList.remove('active-turn'));
    document.querySelectorAll('.ability-node').forEach(n => n.remove());
    combatVignette.classList.add('hidden');
    
    // Get next combatant
    let activeCombatant = combatState.turnQueue[combatState.currentTurnIndex];
    
    // If they died before their turn, skip
    if(activeCombatant.isDead) {
        advanceTurn();
        return;
    }
    
    logCombat(`Turn: ${activeCombatant.name}`);
    
    // Highlight
    const prefix = activeCombatant.side === 'player' ? 'p' : 'e';
    const slot = document.getElementById(`${prefix}-slot-${activeCombatant.index}`);
    if(slot) {
        slot.classList.add('active-turn');
        combatVignette.classList.remove('hidden');
    }
    
    if (activeCombatant.side === 'player') {
        spawnAbilityNodes(activeCombatant, slot);
    } else {
        // Enemy AI
        setTimeout(() => {
            enemyAIAction(activeCombatant);
        }, 1500);
    }
}

function spawnAbilityNodes(player, slotElem) {
    if(!slotElem) return;
    
    // Using the real ability names from the screenshot
    const abilities = [
        { name: 'Claw', cost: 0, desc: 'Basic physical attack.', color: '#e0cca8', targetType: 'single_enemy' },
        { name: 'Roar', cost: 3, desc: 'Scares opponent making them deal less damage the entire game by 10%.', color: '#f1c40f', targetType: 'single_enemy' },
        { name: 'Dash', cost: 15, desc: 'Reckless dash.', color: '#fff2cc', targetType: 'single_enemy' }
    ];
    
    // Spawn them in a larger circular arc so they don't overlap
    const positions = [
        { top: '-130px', left: '170px' },   // Top right (pushed higher)
        { top: '0px', left: '230px' },      // Middle right (pushed further right)
        { top: '130px', left: '170px' }     // Bottom right (pushed lower)
    ];
    
    abilities.forEach((ab, i) => {
        const nodeContainer = document.createElement('div');
        nodeContainer.className = 'ability-container';
        nodeContainer.style.position = 'absolute';
        nodeContainer.style.top = positions[i].top;
        nodeContainer.style.left = positions[i].left;
        nodeContainer.style.zIndex = '25';
        nodeContainer.style.display = 'flex';
        nodeContainer.style.flexDirection = 'column';
        nodeContainer.style.alignItems = 'center';
        nodeContainer.style.gap = '5px';
        
        const label = document.createElement('div');
        label.textContent = ab.name;
        label.style.backgroundColor = 'black';
        label.style.color = 'white';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '10px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        
        const node = document.createElement('div');
        node.className = 'ability-node';
        node.style.position = 'relative'; // override absolute from css
        node.style.backgroundColor = ab.color;
        node.dataset.tooltip = `${ab.name}\nMana: ${ab.cost}\n${ab.desc}`;
        
        const imgPath = `assets/abilities/${ab.name}/image.png`;
        node.innerHTML = `
            <img src="${imgPath}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;" />
            <span style="display: none;">${ab.name[0]}</span>
        `;
        
        nodeContainer.appendChild(label);
        nodeContainer.appendChild(node);
        
        // Timeout to allow CSS transition popout
        setTimeout(() => {
            node.style.transform = 'scale(1)';
        }, 50 * i);
        
        node.addEventListener('click', () => {
            if(combatState.state !== 'WAITING') return;
            
            if (ab.targetType === 'single_enemy') {
                combatState.state = 'TARGETING';
                combatState.selectedAbility = ab;
                combatState.activePlayer = player;
                
                // Remove nodes
                document.querySelectorAll('.ability-container').forEach(n => n.remove());
                
                renderCombatUI();
                logCombat(`Select a target for ${ab.name}!`);
            } else {
                combatState.state = 'ANIMATING';
                // Remove nodes
                document.querySelectorAll('.ability-container').forEach(n => n.remove());
                // Execute ability
                executePlayerAbility(player, ab);
            }
        });
        
        slotElem.appendChild(nodeContainer);
    });
}

function executePlayerAbility(player, ability, manualTarget = null) {
    let target = manualTarget;
    
    if (!target) {
        // Auto-target a random alive enemy
        const aliveEnemies = combatState.enemies.filter(e => !e.isDead);
        if(aliveEnemies.length === 0) return;
        target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    }
    
    logCombat(`${player.name} used ${ability.name}!`);
    
    if (ability.name === 'Heal') {
        const healAmt = 30;
        player.currentHealth = Math.min(player.maxHealth, player.currentHealth + healAmt);
        logCombat(`${player.name} recovered ${healAmt} HP!`);
        
        renderCombatUI(); // Update UI first
        spawnStatusPopup(player, 'HP ⬆️', true);
    } else if (ability.name === 'Roar') {
        const dmg = Math.floor(player.attack * 1.2 * (Math.random() * 0.4 + 0.8));
        target.currentHealth -= dmg;
        if(target.currentHealth <= 0) {
            target.currentHealth = 0;
            target.isDead = true;
            logCombat(`${target.name} fainted!`);
        }
        logCombat(`${player.name} hits ${target.name} for ${dmg} damage!`);
        logCombat(`${target.name}'s Attack fell!`);
        
        renderCombatUI(); // Update UI first
        
        // Spawn animation over target
        const targetSlot = document.getElementById(`e-slot-${combatState.enemies.indexOf(target)}`);
        if(targetSlot) {
            targetSlot.classList.add('targeted'); // Pull them out of the vignette shadows
            
            const anim = document.createElement('img');
            anim.style.position = 'absolute';
            anim.style.top = '50%';
            anim.style.left = '50%';
            anim.style.transform = 'translate(-50%, -50%)';
            anim.style.width = '350px'; // Made it bigger to match minion size
            anim.style.height = '350px';
            anim.style.objectFit = 'contain';
            anim.style.zIndex = '100';
            anim.style.pointerEvents = 'none';
            anim.style.filter = 'drop-shadow(0 0 20px rgba(241, 196, 15, 0.5))';
            targetSlot.appendChild(anim);
            
            let frame = 1;
            anim.src = `assets/abilities/Roar/effect/frame${frame}.png`;
            
            const interval = setInterval(() => {
                frame++;
                if(frame > 4) {
                    clearInterval(interval);
                    anim.remove();
                    targetSlot.classList.remove('targeted');
                } else {
                    anim.src = `assets/abilities/Roar/effect/frame${frame}.png`;
                }
            }, 200); // 200ms per frame to make it easier to see (800ms total)
        }
        
        // Play sound
        const audio = new Audio('assets/sound/roar.mp3');
        audio.play().catch(e => console.log('Waiting for roar.mp3 to be added'));
        
        // Apply debuff with the ability description!
        const firstLineDesc = ability.desc ? ability.desc.split('\n')[0] : '';
        spawnStatusPopup(target, `Attack ⬇️<br><span style="font-size: 12px; font-weight: normal;">${firstLineDesc}</span>`, false);
    } else {
        const dmg = Math.floor(player.attack * (ability.name === 'Special' ? 1.5 : 1) * (Math.random() * 0.4 + 0.8));
        target.currentHealth -= dmg;
        if(target.currentHealth <= 0) {
            target.currentHealth = 0;
            target.isDead = true;
            logCombat(`${target.name} fainted!`);
        }
        logCombat(`${player.name} hits ${target.name} for ${dmg} damage!`);
        
        renderCombatUI(); // Update UI first
    }
    
    setTimeout(advanceTurn, 1000);
}

function enemyAIAction(enemy) {
    if(combatState.state !== 'WAITING') return;
    combatState.state = 'ANIMATING';
    
    const alivePlayers = combatState.players.filter(p => !p.isDead);
    if(alivePlayers.length > 0) {
        const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        const dmg = Math.floor(enemy.attack * (Math.random() * 0.4 + 0.8));
        
        target.currentHealth -= dmg;
        logCombat(`${enemy.name} attacks ${target.name} for ${dmg} damage!`);
        
        if(target.currentHealth <= 0) {
            target.currentHealth = 0;
            target.isDead = true;
            logCombat(`${target.name} fainted!`);
        }
    }
    
    renderCombatUI();
    setTimeout(advanceTurn, 1000);
}

function advanceTurn() {
    combatState.currentTurnIndex++;
    if(combatState.currentTurnIndex >= combatState.turnQueue.length) {
        // End of round, rebuild queue in case speeds changed or people died
        buildTurnQueue();
    }
    processNextTurn();
}

function renderCombatUI() {
    const turnOverlay = document.getElementById('combat-turn-overlay');
    if (turnOverlay) {
        if (combatState.state === 'WAITING' || combatState.state === 'TARGETING') {
            turnOverlay.classList.add('active');
        } else {
            turnOverlay.classList.remove('active');
        }
    }

    // Clear all slots
    for(let i=0; i<5; i++) {
        const pSlot = document.getElementById(`p-slot-${i}`);
        if(pSlot) {
            // keep the nodes if it's the active turn, just update the sprite placeholder
            const nodes = Array.from(pSlot.querySelectorAll('.ability-node'));
            pSlot.innerHTML = '';
            pSlot.className = 'combat-slot player-slot';
            if(combatState.turnQueue[combatState.currentTurnIndex] && combatState.turnQueue[combatState.currentTurnIndex].side === 'player' && combatState.turnQueue[combatState.currentTurnIndex].index === i) {
                pSlot.classList.add('active-turn');
            }
        }
        
        const eSlot = document.getElementById(`e-slot-${i}`);
        if(eSlot) {
            eSlot.innerHTML = '';
            eSlot.className = 'combat-slot enemy-slot';
            eSlot.onclick = null;
            if(combatState.turnQueue[combatState.currentTurnIndex] && combatState.turnQueue[combatState.currentTurnIndex].side === 'enemy' && combatState.turnQueue[combatState.currentTurnIndex].index === i) {
                eSlot.classList.add('active-turn');
            }
        }
    }
    
    // Fill player slots
    combatState.players.forEach((player, index) => {
        if (index < 5) {
            const slot = document.getElementById(`p-slot-${index}`);
            slot.insertAdjacentHTML('afterbegin', createMinionSpriteHTML(player, index, 'player'));
            if (player.isDead) slot.classList.add('dead');
        }
    });
    
    // Fill enemy slots
    combatState.enemies.forEach((enemy, index) => {
        if (index < 5) {
            const slot = document.getElementById(`e-slot-${index}`);
            slot.insertAdjacentHTML('afterbegin', createMinionSpriteHTML(enemy, index, 'enemy'));
            if (enemy.isDead) {
                slot.classList.add('dead');
            } else if (combatState.state === 'TARGETING') {
                slot.classList.add('valid-target');
                slot.onclick = () => {
                    if (combatState.state !== 'TARGETING') return;
                    combatState.state = 'ANIMATING';
                    if (turnOverlay) turnOverlay.classList.remove('active');
                    
                    // Clear highlights
                    document.querySelectorAll('.enemy-slot').forEach(s => {
                        s.classList.remove('valid-target');
                        s.onclick = null;
                    });
                    
                    executePlayerAbility(combatState.activePlayer, combatState.selectedAbility, enemy);
                };
            }
        }
    });
}

function createMinionSpriteHTML(minion, index, side) {
    const hpPercent = (minion.currentHealth / minion.health) * 100;
    
    // Fallback logic to load the real image if it exists, otherwise colored square
    const imagePath = `assets/minions/${minion.name}/forms/baby.png`;
    const defaultColor = side === 'player' ? '#3498db' : '#e74c3c';
    
    return `
        <div class="floating-ui">
            <div class="floating-lvl">Lv.${minion.level}</div>
            <div class="floating-hp-fill" style="width: ${Math.max(0, hpPercent)}%"></div>
        </div>
        <img src="${imagePath}" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
             style="width: 350px; height: 350px; object-fit: contain; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));" />
        <div class="sprite-placeholder" style="display: none; background-color: ${defaultColor};">
            ${minion.name.substring(0, 2)}
        </div>
    `;
}

function spawnStatusPopup(combatant, text, isBuff) {
    const side = combatant.side === 'player' ? 'p' : 'e';
    const list = combatant.side === 'player' ? combatState.players : combatState.enemies;
    const index = list.indexOf(combatant);
    const slot = document.getElementById(`${side}-slot-${index}`);
    if(!slot) return;
    
    const popup = document.createElement('div');
    popup.className = `status-popup ${isBuff ? 'buff' : 'debuff'}`;
    popup.innerHTML = text;
    slot.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1500);
}

function logCombat(message) {
    combatLog.innerHTML += `<p>${message}</p>`;
    combatLog.scrollTop = combatLog.scrollHeight;
}

function checkWinCondition() {
    const playerAlive = combatState.players.some(m => !m.isDead);
    const enemyAlive = combatState.enemies.some(m => !m.isDead);
    
    if(!playerAlive) {
        combatState.state = 'END';
        logCombat("Your entire team fainted. You lost!");
        setTimeout(() => {
            showScreen(screenMain);
            combatLog.innerHTML = '';
        }, 2000);
        return true;
    } else if(!enemyAlive) {
        combatState.state = 'END';
        logCombat("You won the battle!");
        combatVignette.classList.add('hidden');
        
        setTimeout(() => {
            combatLog.innerHTML = '';
            handleCombatWin();
        }, 2000);
        return true;
    }
    return false;
}

function handleCombatWin() {
    let deadEnemies = combatState.enemies.filter(e => e.isDead).length;
    let earnedStars = deadEnemies;
    let earnedMoney = 50 + (state.skills.coinBoost.rank * 10); // passive coin boost
    
    state.stars += earnedStars;
    state.money += earnedMoney;
    
    // Check if we beat the highest unlocked room to progress
    if (combatState.currentFloor === state.unlockedFloor && combatState.currentRoom === state.unlockedRoom) {
        if (combatState.currentRoom === 3) {
            // Beat boss, go to next floor
            state.unlockedFloor++;
            state.unlockedRoom = 1;
        } else {
            // Beat normal room, go to next room
            state.unlockedRoom++;
        }
    }
    
    saveGame();
    buildTower(); // Re-render to show unlocked room
    
    alert(`Victory! You earned ${earnedStars} ⭐ and $${earnedMoney}!`);
    
    if(combatState.isBoss) {
        showScreen(screenEgg);
    } else {
        showScreen(screenMain);
    }
}

if(btnRunCorner) {
    btnRunCorner.addEventListener('click', () => {
        if(combatState.state === 'END') return;
        combatState.state = 'END';
        logCombat("You ran away safely!");
        combatVignette.classList.add('hidden');
        document.querySelectorAll('.ability-node').forEach(n => n.remove());
        
        setTimeout(() => {
            showScreen(screenMain);
            combatLog.innerHTML = '';
        }, 1000);
    });
}

// --- Save & Load System ---
let saves = JSON.parse(localStorage.getItem('minhero_saves')) || {
    1: null,
    2: null,
    3: null
};

let currentSlot = null;
let currentGender = null;

function updateSaveSlotsUI() {
    slots.forEach(slot => {
        const slotNum = slot.dataset.slot;
        const saveData = saves[slotNum];
        if (saveData) {
            slot.textContent = `Slot ${slotNum} - ${saveData.heroName} (${saveData.army.length} Minions)`;
        } else {
            slot.textContent = `Slot ${slotNum} - Empty`;
        }
    });
}

function saveGame() {
    if(!currentSlot) return;
    saves[currentSlot] = state;
    localStorage.setItem('minhero_saves', JSON.stringify(saves));
}

// --- Intro Logic ---
btnPlay.addEventListener('click', () => {
    btnPlay.classList.add('hidden');
    saveSlotsContainer.classList.remove('hidden');
    updateSaveSlotsUI();
});

const characterCreationOverlay = document.getElementById('character-creation-overlay');
const btnCloseChar = document.getElementById('btn-close-char');

if (btnCloseChar) {
    btnCloseChar.addEventListener('click', () => {
        characterCreationOverlay.classList.add('hidden');
        saveSlotsContainer.classList.remove('hidden');
    });
}

slots.forEach(slot => {
    slot.addEventListener('click', () => {
        currentSlot = slot.dataset.slot;
        if (saves[currentSlot]) {
            // Load Game
            Object.assign(state, saves[currentSlot]);
            if (!state.unlockedFloor) {
                state.unlockedFloor = 1;
                state.unlockedRoom = 1;
            }
            if(state.stars === undefined) state.stars = 0;
            if(state.money === undefined) state.money = 0;
            if(state.skills === undefined) {
                state.skills = {
                    health: { rank: 0, cost: 10, name: 'Health Boost', icon: '❤️' },
                    attack: { rank: 0, cost: 10, name: 'Damage Up', icon: '☀️' },
                    speed: { rank: 0, cost: 10, name: 'Haste', icon: '⚡' },
                    healing: { rank: 0, cost: 10, name: 'Heal Up', icon: '🩹' },
                    xpBoost: { rank: 0, cost: 15, name: 'XP Boost', icon: '📈' },
                    coinBoost: { rank: 0, cost: 15, name: 'Coin Magnet', icon: '💰' },
                    critChance: { rank: 0, cost: 20, name: 'Critical Hit', icon: '🦷' },
                    dodgeChance: { rank: 0, cost: 20, name: 'Evade', icon: '🥾' }
                };
            }
            startTransitionToGame();
        } else {
            // New Game
            // Keep save slots hidden, but maybe they were already visible. It's fine.
            characterCreationOverlay.classList.remove('hidden');
        }
    });
});

genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        genderBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentGender = btn.dataset.gender;
        checkStartReady();
    });
});

charNameInput.addEventListener('input', checkStartReady);

function checkStartReady() {
    if (charNameInput.value.trim() !== '' && currentGender !== null) {
        btnStartAdventure.classList.remove('hidden');
    } else {
        btnStartAdventure.classList.add('hidden');
    }
}

btnStartAdventure.addEventListener('click', () => {
    // Initialize New Game State
    state.heroName = charNameInput.value.trim();
    state.heroGender = currentGender;
    
    // Starting Minions
    state.collection = [
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 },
        { name: 'Tigrier', level: 5, health: 120, energy: 60, attack: 15, healing: 5, speed: 12 }
    ];
    state.army = [...state.collection];
    state.unlockedFloor = 1;
    state.unlockedRoom = 1;
    state.stars = 0;
    state.money = 0;
    state.skills = {
        health: { rank: 0, cost: 10, name: 'Health Boost', icon: '❤️' },
        attack: { rank: 0, cost: 10, name: 'Damage Up', icon: '☀️' },
        speed: { rank: 0, cost: 10, name: 'Haste', icon: '⚡' },
        healing: { rank: 0, cost: 10, name: 'Heal Up', icon: '🩹' },
        xpBoost: { rank: 0, cost: 15, name: 'XP Boost', icon: '📈' },
        coinBoost: { rank: 0, cost: 15, name: 'Coin Magnet', icon: '💰' },
        critChance: { rank: 0, cost: 20, name: 'Critical Hit', icon: '🦷' },
        dodgeChance: { rank: 0, cost: 20, name: 'Evade', icon: '🥾' }
    };
    
    saveGame();
    characterCreationOverlay.classList.add('hidden');
    startTransitionToGame();
});

function startTransitionToGame() {
    // 1. Doors open animation
    screenIntro.classList.add('doors-opening');
    
    // 2. Fade to black
    setTimeout(() => {
        fadeOverlay.classList.remove('hidden');
        // trigger reflow
        void fadeOverlay.offsetWidth;
        fadeOverlay.classList.add('blackout');
        
        // 3. Switch screen under the black fade
        setTimeout(() => {
            buildTower(); // Generate the UI right before showing it
            showScreen(screenMain);
            topMenu.classList.remove('hidden');
            
            // 4. Fade back in
            fadeOverlay.classList.remove('blackout');
            setTimeout(() => {
                fadeOverlay.classList.add('hidden');
            }, 1000);
        }, 1000);
    }, 1500); // Wait for doors to open slightly before fading
}

// --- UI Updates ---
function updateTeamOverlayUI() {
    teamListContainer.innerHTML = '';
    state.army.forEach(minion => {
        const hpPercent = Math.max(0, (minion.currentHealth !== undefined ? minion.currentHealth : minion.health) / minion.health) * 100;
        const enPercent = 100; // Simplified for now
        
        teamListContainer.innerHTML += `
            <div class="team-list-row">
                <div class="team-list-sprite">${minion.name.substring(0, 2)}</div>
                <div class="team-list-info">
                    <div class="team-list-name">${minion.name}</div>
                    <div class="team-list-bars">
                        <div class="tl-bar-bg"><div class="tl-bar-fill bg-red" style="width: ${hpPercent}%"></div></div>
                        <div class="tl-bar-bg"><div class="tl-bar-fill bg-blue" style="width: ${enPercent}%"></div></div>
                    </div>
                </div>
                <div class="team-list-lvl">Lv.${minion.level}</div>
            </div>
        `;
    });
}

function updateCollectionUI() {
    // Current Team Row
    colCurrentTeam.innerHTML = '';
    state.army.forEach(minion => {
        colCurrentTeam.innerHTML += `<div class="small-sprite">${minion.name.substring(0, 2)}</div>`;
    });
    
    // Grid
    colGrid.innerHTML = '';
    state.collection.forEach((minion, i) => {
        colGrid.innerHTML += `
            <div class="grid-cell" onclick="selectCollectionMinion(${i})">
                <div class="small-sprite">${minion.name.substring(0, 2)}</div>
            </div>
        `;
    });
    // Fill empty spots
    for(let i=state.collection.length; i<15; i++) {
        colGrid.innerHTML += `<div class="grid-cell"></div>`;
    }
    
    // Select first by default
    if(state.collection.length > 0) {
        selectCollectionMinion(0);
    }
}

window.selectCollectionMinion = function(index) {
    const minion = state.collection[index];
    if(!minion) return;
    
    detailSprite.textContent = minion.name.substring(0, 2);
    detailName.textContent = minion.name;
    detailLevel.textContent = `LV ${minion.level}`;
    
    valHealth.textContent = minion.health;
    valEnergy.textContent = minion.energy;
    valAttack.textContent = minion.attack;
    valHealing.textContent = minion.healing;
    valSpeed.textContent = minion.speed;
};

function updateHeroUI() {
    heroNameDisplay.textContent = state.heroName || 'Hero';
    heroMoneyDisplay.textContent = '$' + (state.money || 0);
    heroPediaDisplay.textContent = state.collection.length;
    heroStarCount.textContent = state.stars || 0;
    
    skillsGrid.innerHTML = '';
    Object.keys(state.skills).forEach(key => {
        const skill = state.skills[key];
        skillsGrid.innerHTML += `
            <button class="skill-btn" onclick="upgradeSkill('${key}')">
                <div class="skill-rank">Rank ${skill.rank}</div>
                <div class="skill-icon-box">${skill.icon}</div>
                <div class="skill-cost">${skill.cost} ⭐</div>
            </button>
        `;
    });
}

window.upgradeSkill = function(key) {
    const skill = state.skills[key];
    if (state.stars >= skill.cost) {
        state.stars -= skill.cost;
        skill.rank++;
        skill.cost = Math.floor(skill.cost * 1.5);
        saveGame();
        updateHeroUI();
    } else {
        alert("Not enough stars!");
    }
};

btnHeroReset.addEventListener('click', () => {
    let refund = 0;
    Object.keys(state.skills).forEach(key => {
        const skill = state.skills[key];
        if(skill.rank > 0) {
            refund += skill.rank * 10;
            skill.rank = 0;
            skill.cost = key === 'xpBoost' || key === 'coinBoost' ? 15 : (key === 'critChance' || key === 'dodgeChance' ? 20 : 10);
        }
    });
    if (refund > 0) {
        state.stars += refund;
        saveGame();
        updateHeroUI();
        alert(`Refunded ${refund} stars!`);
    }
});

// --- Modal System JS ---
const minionDetailModal = document.getElementById('minion-detail-modal');
const mdLeftPanel = document.getElementById('md-left-panel');
const mdRightPanel = document.getElementById('md-right-panel');
const mdBtnCloseX = document.getElementById('md-btn-close-x');
const mdBtnDetails = document.getElementById('md-btn-details');
const mdBtnSkilltree = document.getElementById('md-btn-skilltree');
const mdBtnCancel = document.getElementById('md-btn-cancel');
const mdBtnReturn = document.getElementById('md-btn-return');

const mdTabStats = document.getElementById('md-tab-stats');
const mdTabMoves = document.getElementById('md-tab-moves');
const mdTabGems = document.getElementById('md-tab-gems');
const mdContentStats = document.getElementById('md-content-stats');
const mdContentMoves = document.getElementById('md-content-moves');

const specializationModal = document.getElementById('specialization-modal');
const specBtnCloseX = document.getElementById('spec-btn-close-x');
const specBtnReturn = document.getElementById('spec-btn-return');
const specPoints = document.getElementById('spec-points');

let currentActiveMinion = null;

// Open Context Menu from Team List
teamListContainer.addEventListener('click', (e) => {
    const row = e.target.closest('.team-list-row');
    if (row) {
        // Find index of clicked row in teamListContainer
        const index = Array.from(teamListContainer.children).indexOf(row);
        currentActiveMinion = state.army[index];
        openMinionDetailContext();
    }
});

function openMinionDetailContext() {
    minionDetailModal.classList.remove('hidden');
    mdRightPanel.style.display = 'flex';
    mdLeftPanel.style.display = 'none';
    populateMinionDetails();
}

function populateMinionDetails() {
    if (!currentActiveMinion) return;
    document.getElementById('md-name').textContent = currentActiveMinion.name;
    document.getElementById('md-level').textContent = currentActiveMinion.level;
    document.getElementById('md-sprite').textContent = currentActiveMinion.name.substring(0, 2);
    
    document.getElementById('md-val-hp').textContent = currentActiveMinion.health;
    document.getElementById('md-val-en').textContent = currentActiveMinion.energy || 50;
    document.getElementById('md-val-atk').textContent = currentActiveMinion.attack;
    document.getElementById('md-val-heal').textContent = currentActiveMinion.healing;
    document.getElementById('md-val-spd').textContent = currentActiveMinion.speed;
}

// Right Panel Actions
mdBtnCancel.addEventListener('click', () => {
    minionDetailModal.classList.add('hidden');
});
mdBtnCloseX.addEventListener('click', () => {
    minionDetailModal.classList.add('hidden');
});

mdBtnDetails.addEventListener('click', () => {
    mdRightPanel.style.display = 'none';
    mdLeftPanel.style.display = 'block';
});

mdBtnReturn.addEventListener('click', () => {
    mdLeftPanel.style.display = 'none';
    mdRightPanel.style.display = 'flex';
});

// Left Panel Tabs
mdTabStats.addEventListener('click', () => {
    mdTabStats.classList.add('active');
    mdTabMoves.classList.remove('active');
    mdTabGems.classList.remove('active');
    mdContentStats.classList.remove('hidden');
    mdContentMoves.classList.add('hidden');
});

mdTabMoves.addEventListener('click', () => {
    mdTabMoves.classList.add('active');
    mdTabStats.classList.remove('active');
    mdTabGems.classList.remove('active');
    mdContentMoves.classList.remove('hidden');
    mdContentStats.classList.add('hidden');
});

// Skill Tree Actions
mdBtnSkilltree.addEventListener('click', () => {
    minionDetailModal.classList.add('hidden');
    specializationModal.classList.remove('hidden');
    specPoints.textContent = currentActiveMinion.unspentPoints || 0;
});

specBtnCloseX.addEventListener('click', () => {
    specializationModal.classList.add('hidden');
});

specBtnReturn.addEventListener('click', () => {
    specializationModal.classList.add('hidden');
    minionDetailModal.classList.remove('hidden');
    mdRightPanel.style.display = 'flex';
    mdLeftPanel.style.display = 'none';
});
