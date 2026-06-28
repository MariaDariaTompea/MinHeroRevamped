// DOM Elements
const screenIntro = document.getElementById('screen-intro');
const screenMain = document.getElementById('screen-main');
const screenCollection = document.getElementById('screen-collection');
const screenCombat = document.getElementById('screen-combat');
const screenEgg = document.getElementById('screen-egg');
const screenExplore = document.getElementById('screen-explore');
const exploreTitle = document.getElementById('explore-title');
const exploreKeysCount = document.getElementById('explore-keys-count');
const exploreMapGrid = document.getElementById('explore-map-grid');
const exploreDialogueOverlay = document.getElementById('explore-dialogue-overlay');
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const dialogueText = document.getElementById('dialogue-text');
const exploreVignette = document.getElementById('explore-vignette');
const btnExploreLeave = document.getElementById('btn-explore-leave');

const topMenu = document.getElementById('top-menu');
const btnMenu = document.getElementById('btn-menu');
const menuOverlay = document.getElementById('menu-overlay');
const btnMenuCollection = document.getElementById('btn-menu-collection');
const btnMenuTeam = document.getElementById('btn-menu-team');
const btnMenuHero = document.getElementById('btn-menu-hero');
const btnMenuResume = document.getElementById('btn-menu-resume');

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
const characterCreationOverlay = document.getElementById('character-creation-overlay');
const characterCreation = document.getElementById('character-creation');
const btnCloseChar = document.getElementById('btn-close-char');
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

// --- Navigation & Helper UI Functions ---
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

function setTurnIndicator(playerMinion, enemyMinion) {
    const pSlot = document.getElementById(`p-slot-${combatState.players.indexOf(playerMinion)}`);
    if(pSlot) pSlot.classList.add('active-turn');
    
    const eSlot = document.getElementById(`e-slot-${combatState.enemies.indexOf(enemyMinion)}`);
    if(eSlot) eSlot.classList.add('active-turn');
}

// Render Tower Map
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

// Exploration Helper: Get multi-tile info at cell coordinates
function getMultiTileInfo(x, y) {
    if (!state.exploreActive || !state.exploreMap) return null;
    
    // Check doors
    if (state.exploreMap.doors) {
        for (let door of state.exploreMap.doors) {
            if (x >= door.x && x < door.x + door.width && y >= door.y && y < door.y + door.height) {
                return { type: 'door_master', data: door };
            }
        }
    }
    
    // Check eggs
    if (state.exploreMap.eggs) {
        for (let egg of state.exploreMap.eggs) {
            if (x >= egg.x && x < egg.x + egg.width && y >= egg.y && y < egg.y + egg.height) {
                return { type: 'egg', data: egg };
            }
        }
    }
    
    // Check custom blocks
    if (state.exploreMap.custom_blocks) {
        for (let b of state.exploreMap.custom_blocks) {
            if (x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height) {
                return { type: 'custom_block', data: b };
            }
        }
    }
    
    // Check teleports
    if (state.exploreMap.teleports) {
        for (let tp of state.exploreMap.teleports) {
            if (tp.head.x === x && tp.head.y === y) {
                return { type: 'teleport_head', data: tp };
            }
            if (tp.tail.x === x && tp.tail.y === y) {
                return { type: 'teleport_tail', data: tp };
            }
        }
    }

    // Check NPCs
    if (state.exploreMap.npcs) {
        for (let npc of state.exploreMap.npcs) {
            if (npc.x === x && npc.y === y) {
                return { type: 'npc', data: npc };
            }
        }
    }
    
    return null;
}

// Render the visual tilemap grid
function renderExploreMap() {
    if (!state.exploreActive || !state.exploreMap) return;
    
    // Dynamically calculate optimal cell size to fit the viewport
    const viewport = document.getElementById('explore-viewport');
    let cellSize = 40; // Default
    if (viewport) {
        const viewportWidth = viewport.clientWidth - 40; // Subtract padding
        const viewportHeight = viewport.clientHeight - 40;
        
        // Calculate size needed to fit
        const cellW = Math.floor(viewportWidth / state.exploreMap.width);
        const cellH = Math.floor(viewportHeight / state.exploreMap.height);
        cellSize = Math.min(cellW, cellH);
        
        // Limit bounds between 12px (min readable) and 45px (max standard)
        cellSize = Math.max(12, Math.min(45, cellSize));
    }
    
    exploreMapGrid.innerHTML = '';
    exploreMapGrid.style.gridTemplateColumns = `repeat(${state.exploreMap.width}, ${cellSize}px)`;
    exploreMapGrid.style.gridTemplateRows = `repeat(${state.exploreMap.height}, ${cellSize}px)`;
    
    // Update key counter display
    exploreKeysCount.textContent = `🔑 ${state.exploreKeysCollected}/${state.exploreKeysRequired}`;
    
    for (let y = 0; y < state.exploreMap.height; y++) {
        for (let x = 0; x < state.exploreMap.width; x++) {
            const cell = document.createElement('div');
            cell.className = 'explore-cell';
            
            // Set dynamic size and font scaling for emojis
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.fontSize = `${Math.floor(cellSize * 0.55)}px`;
            cell.style.zIndex = '';
            
            // Default background tile class from grid definition
            const baseType = state.exploreMap.grid[y][x] || 'floor_gray';
            if (baseType === 'wall') {
                cell.classList.add('tile-wall');
                cell.textContent = '🧱';
            } else if (baseType === 'invisible_wall') {
                cell.classList.add('tile-floor-gray');
            } else if (baseType === 'floor_carpet') {
                cell.classList.add('tile-floor-carpet');
            } else {
                cell.classList.add('tile-floor-gray');
            }
            
            // Check for custom blocks background
            if (state.exploreMap.custom_blocks) {
                const block = state.exploreMap.custom_blocks.find(b => b.x === x && b.y === y);
                if (block) {
                    const imgDiv = document.createElement('div');
                    imgDiv.style.position = 'absolute';
                    imgDiv.style.left = '0';
                    imgDiv.style.top = '0';
                    imgDiv.style.width = `${cellSize * 6}px`;
                    imgDiv.style.height = `${cellSize * 6}px`;
                    imgDiv.style.backgroundImage = `url('${block.image}')`;
                    imgDiv.style.backgroundSize = '100% 100%';
                    imgDiv.style.zIndex = '5';
                    imgDiv.style.pointerEvents = 'none';
                    cell.appendChild(imgDiv);
                    cell.style.zIndex = '10';
                }
            }

            // Check if there is an active multi-tile block or entity (excluding custom block background)
            const info = getMultiTileInfo(x, y);
            if (info && info.type !== 'custom_block') {
                cell.style.zIndex = '20';
                if (info.type === 'door_master') {
                    if (info.data.open) {
                        cell.classList.remove('tile-wall');
                        cell.className = 'explore-cell tile-door-master-open';
                        cell.textContent = '';
                    } else {
                        cell.className = 'explore-cell tile-door-master-closed';
                        // Put padlock on the first cell of the 2x1 door
                        if (x === info.data.x && y === info.data.y) {
                            cell.textContent = '🔒';
                        } else {
                            cell.textContent = '🚧';
                        }
                    }
                } else if (info.type === 'egg') {
                    cell.className = 'explore-cell tile-egg-chamber';
                    const coordKey = `${x}_${y}`;
                    if (state.exploreHatchedEggs.includes(coordKey)) {
                        cell.textContent = '💥';
                    } else {
                        cell.textContent = '🥚';
                    }
                } else if (info.type === 'teleport_head') {
                    cell.classList.add('tile-teleport-head');
                    cell.style.backgroundColor = '#2980b9';
                    cell.textContent = '🌀';
                } else if (info.type === 'teleport_tail') {
                    cell.classList.add('tile-teleport-tail');
                    cell.style.backgroundColor = '#8e44ad';
                    cell.textContent = '🌀';
                } else if (info.type === 'npc') {
                    const coordKey = `${x}_${y}`;
                    if (!state.exploreDefeatedNPCs.includes(coordKey)) {
                        if (info.data.id === 'boss') {
                            cell.textContent = '👹';
                        } else {
                            cell.textContent = info.data.id === 'npc1' ? '🧙' : '🧑';
                        }
                    }
                }
                
                // Re-apply inline styling overrides to maintain scale consistency
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.style.fontSize = `${Math.floor(cellSize * 0.55)}px`;
            }
            
            // Render Player on top
            if (state.explorePlayerPos.x === x && state.explorePlayerPos.y === y) {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-avatar-explore';
                playerDiv.style.fontSize = `${Math.floor(cellSize * 0.65)}px`;
                playerDiv.textContent = state.heroGender === 'boy' ? '👱‍♂️' : '👱‍♀️';
                cell.appendChild(playerDiv);
                cell.style.zIndex = '20';
            }
            
            exploreMapGrid.appendChild(cell);
        }
    }
}
window.renderExploreMap = renderExploreMap;
window.getMultiTileInfo = getMultiTileInfo;

// Update Team Overlay
function updateTeamOverlayUI() {
    teamListContainer.innerHTML = '';
    state.army.forEach(minion => {
        const hpPercent = 100; // Simplified for now
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

// Update Collection Screen
function updateCollectionUI() {
    // Current Team Row
    colCurrentTeam.innerHTML = '';
    state.army.forEach(minion => {
        colCurrentTeam.innerHTML += `<div class="small-sprite" style="border: 2px solid gold; border-radius: 4px; padding: 2px; margin: 2px; background: rgba(255, 215, 0, 0.1);">${minion.name.substring(0, 2)}</div>`;
    });
    
    // Grid
    colGrid.innerHTML = '';
    state.collection.forEach((minion, i) => {
        const activeClass = minion.inTeam ? 'active-team-cell' : '';
        const activeIndicator = minion.inTeam ? '<div style="position:absolute; top:-5px; right:-5px; background:gold; color:black; font-size:9px; font-weight:bold; border-radius:50%; width:15px; height:15px; display:flex; align-items:center; justify-content:center; border:1px solid black; z-index:10;">✔</div>' : '';
        
        colGrid.innerHTML += `
            <div class="grid-cell ${activeClass}" onclick="selectCollectionMinion(${i})" style="position: relative; border: ${minion.inTeam ? '2px solid gold' : '1px solid #444'}; box-shadow: ${minion.inTeam ? '0 0 8px rgba(255, 215, 0, 0.4)' : 'none'};">
                <div class="small-sprite">${minion.name.substring(0, 2)}</div>
                ${activeIndicator}
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

window.selectedCollectionIndex = 0;

window.selectCollectionMinion = function(index) {
    const minion = state.collection[index];
    if(!minion) return;
    
    window.selectedCollectionIndex = index;
    
    detailSprite.textContent = minion.name.substring(0, 2);
    detailName.textContent = minion.name;
    detailLevel.textContent = `LV ${minion.level}`;
    
    // If stats are not loaded, fill placeholders
    valHealth.textContent = minion.health || '--';
    valEnergy.textContent = minion.energy || '--';
    valAttack.textContent = minion.attack || '--';
    valHealing.textContent = minion.healing || '--';
    valSpeed.textContent = minion.speed || '--';
    
    // Update Toggle Team button
    const toggleBtn = document.getElementById('btn-col-toggle-team');
    if (toggleBtn) {
        if (minion.inTeam) {
            toggleBtn.textContent = 'REMOVE FROM TEAM';
            toggleBtn.style.background = '#c0392b';
            toggleBtn.style.color = 'white';
        } else {
            toggleBtn.textContent = 'ADD TO TEAM';
            toggleBtn.style.background = 'gold';
            toggleBtn.style.color = 'black';
        }
    }
};

// Update Hero/Stats Page
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

// Update Save Slots
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

// Minion Detail Context / Modal
function openMinionDetailContext() {
    const minionDetailModal = document.getElementById('minion-detail-modal');
    const mdLeftPanel = document.getElementById('md-left-panel');
    const mdRightPanel = document.getElementById('md-right-panel');
    
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
    
    document.getElementById('md-val-hp').textContent = currentActiveMinion.health || '--';
    document.getElementById('md-val-en').textContent = currentActiveMinion.energy || 50;
    document.getElementById('md-val-atk').textContent = currentActiveMinion.attack || '--';
    document.getElementById('md-val-heal').textContent = currentActiveMinion.healing || '--';
    document.getElementById('md-val-spd').textContent = currentActiveMinion.speed || '--';
}

// Render Combat interface
function renderCombatUI() {
    const turnOverlay = document.getElementById('combat-turn-overlay');
    if (turnOverlay) {
        if (combatState.state === 'WAITING' || combatState.state === 'TARGETING') {
            turnOverlay.classList.add('active');
        } else {
            turnOverlay.classList.remove('active');
        }
    }

    // Clean up ability nodes
    document.querySelectorAll('.ability-container').forEach(n => n.remove());

    // If starting a new battle, clear slot inner HTMLs completely
    if (combatState.state === 'INIT') {
        for(let i=0; i<5; i++) {
            const pSlot = document.getElementById(`p-slot-${i}`);
            if (pSlot) pSlot.innerHTML = '';
            const eSlot = document.getElementById(`e-slot-${i}`);
            if (eSlot) eSlot.innerHTML = '';
        }
    }

    // Clear unused slots (if teams are smaller than 5)
    for(let i=0; i<5; i++) {
        if (i >= combatState.players.length) {
            const pSlot = document.getElementById(`p-slot-${i}`);
            if (pSlot) pSlot.innerHTML = '';
        }
        if (i >= combatState.enemies.length) {
            const eSlot = document.getElementById(`e-slot-${i}`);
            if (eSlot) eSlot.innerHTML = '';
        }
    }

    // Reset slot classes and interactivity
    for(let i=0; i<5; i++) {
        const pSlot = document.getElementById(`p-slot-${i}`);
        if(pSlot) {
            pSlot.className = 'combat-slot player-slot';
            pSlot.onclick = null;
            pSlot.style.cursor = '';
            if(combatState.turnQueue[combatState.currentTurnIndex] && combatState.turnQueue[combatState.currentTurnIndex].side === 'player' && combatState.turnQueue[combatState.currentTurnIndex].index === i) {
                pSlot.classList.add('active-turn');
            }
        }
        
        const eSlot = document.getElementById(`e-slot-${i}`);
        if(eSlot) {
            eSlot.className = 'combat-slot enemy-slot';
            eSlot.onclick = null;
            eSlot.style.cursor = '';
            if(combatState.turnQueue[combatState.currentTurnIndex] && combatState.turnQueue[combatState.currentTurnIndex].side === 'enemy' && combatState.turnQueue[combatState.currentTurnIndex].index === i) {
                eSlot.classList.add('active-turn');
            }
        }
    }
    
    // Fill/update player slots
    combatState.players.forEach((player, index) => {
        if (index < 5) {
            const slot = document.getElementById(`p-slot-${index}`);
            if (!slot) return;

            const hpPercent = (player.currentHealth / player.maxHealth) * 100;
            if (player.xp === undefined) player.xp = 0;
            player.maxXP = 1000;
            const xpPercent = (player.xp / player.maxXP) * 100;

            const hasSprite = slot.querySelector('.floating-ui');
            if (!hasSprite) {
                slot.innerHTML = '';
                slot.insertAdjacentHTML('afterbegin', createMinionSpriteHTML(player, index, 'player'));
            } else {
                // Update properties directly to trigger CSS transitions
                const fill = slot.querySelector('.floating-hp-fill');
                if (fill) fill.style.width = `${Math.max(0, hpPercent)}%`;
                
                const lag = slot.querySelector('.floating-hp-lag');
                if (lag) lag.style.width = `${Math.max(0, hpPercent)}%`;

                const xpFill = slot.querySelector('.floating-xp-fill');
                if (xpFill) xpFill.style.width = `${Math.min(100, Math.max(0, xpPercent))}%`;

                const lvl = slot.querySelector('.floating-lvl');
                if (lvl) lvl.textContent = `Lv.${player.level}`;
            }

            if (player.isDead) slot.classList.add('dead');
            
            if (combatState.state === 'TARGETING' && combatState.activePlayer && combatState.activePlayer.index === index) {
                slot.style.cursor = 'pointer';
                slot.onclick = () => {
                    // Cancel targeting - go back to ability selection
                    combatState.state = 'WAITING';
                    combatState.selectedAbility = null;
                    document.querySelectorAll('.enemy-slot').forEach(s => {
                        s.classList.remove('valid-target');
                        s.onclick = null;
                    });
                    if (turnOverlay) turnOverlay.classList.remove('active');
                    slot.onclick = null;
                    slot.style.cursor = '';
                    renderCombatUI();
                    spawnAbilityNodes(combatState.activePlayer, slot);
                };
            }
        }
    });
    
    // Fill/update enemy slots
    combatState.enemies.forEach((enemy, index) => {
        if (index < 5) {
            const slot = document.getElementById(`e-slot-${index}`);
            if (!slot) return;

            const hpPercent = (enemy.currentHealth / enemy.maxHealth) * 100;

            const hasSprite = slot.querySelector('.floating-ui');
            if (!hasSprite) {
                slot.innerHTML = '';
                slot.insertAdjacentHTML('afterbegin', createMinionSpriteHTML(enemy, index, 'enemy'));
            } else {
                // Update properties directly to trigger CSS transitions
                const fill = slot.querySelector('.floating-hp-fill');
                if (fill) fill.style.width = `${Math.max(0, hpPercent)}%`;

                const lag = slot.querySelector('.floating-hp-lag');
                if (lag) lag.style.width = `${Math.max(0, hpPercent)}%`;

                const lvl = slot.querySelector('.floating-lvl');
                if (lvl) lvl.textContent = `Lv.${enemy.level}`;
            }

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
    const hpPercent = (minion.currentHealth / minion.maxHealth) * 100;
    
    if (minion.xp === undefined) minion.xp = 0;
    minion.maxXP = 1000;
    
    let xpBarHTML = '';
    if (side === 'player') {
        const xpPercent = (minion.xp / minion.maxXP) * 100;
        xpBarHTML = `
            <div style="width: 100%; height: 4px; background: #222; margin-top: 2px;">
                <div class="floating-xp-fill" style="width: ${Math.min(100, Math.max(0, xpPercent))}%; height: 100%; background: #2ecc71; transition: width 0.3s;"></div>
            </div>
        `;
    }
    
    const imagePath = `assets/minions/${minion.name}/forms/baby.png`;
    const defaultColor = side === 'player' ? '#3498db' : '#e74c3c';
    const mirrorStyle = side === 'enemy' ? 'transform: scaleX(-1);' : '';
    
    return `
        <div class="floating-ui">
            <div class="floating-lvl">Lv.${minion.level}</div>
            <div class="floating-hp-bar-wrapper">
                <div class="floating-hp-lag" style="width: ${Math.max(0, hpPercent)}%"></div>
                <div class="floating-hp-fill" style="width: ${Math.max(0, hpPercent)}%"></div>
            </div>
            ${xpBarHTML}
        </div>
        <img src="${imagePath}" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
             style="width: 350px; height: 350px; object-fit: contain; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); ${mirrorStyle}" />
        <div class="sprite-placeholder" style="display: none; background-color: ${defaultColor};">
            ${minion.name.substring(0, 2)}
        </div>
    `;
}

function spawnStatusPopup(combatant, text, isBuff, customColor = null) {
    const side = combatant.side === 'player' ? 'p' : 'e';
    const list = combatant.side === 'player' ? combatState.players : combatState.enemies;
    const index = list.indexOf(combatant);
    const slot = document.getElementById(`${side}-slot-${index}`);
    if(!slot) return;
    
    const popup = document.createElement('div');
    popup.className = `status-popup ${isBuff ? 'buff' : 'debuff'}`;
    if(customColor) {
        popup.style.color = customColor;
        popup.style.borderColor = customColor;
    }
    popup.textContent = text;
    slot.appendChild(popup);
    
    setTimeout(() => { popup.remove(); }, 1200);
}

function updateSkillDashboardUI() {
    if (!activeSkillMinion) return;
    
    // Ensure specializations exist
    if (!activeSkillMinion.specializations) {
        activeSkillMinion.specializations = {};
    }
    
    const title = document.querySelector('#skill-dashboard h2');
    if (title) title.textContent = `${activeSkillMinion.name}'s Skill Tree`;
    
    const pointsDisplay = document.getElementById('sd-points-display');
    if (pointsDisplay) pointsDisplay.textContent = `Points: ${activeSkillMinion.skillPoints || 0}`;
    
    const skillTrees = getMinionSkillTrees(activeSkillMinion.name);
    
    // Render tabs dynamically
    const tabsContainer = document.querySelector('.skill-tabs');
    if (tabsContainer) {
        tabsContainer.innerHTML = '';
        skillTrees.specializations.forEach(spec => {
            const btn = document.createElement('button');
            btn.className = `skill-tab ${spec === activeSkillTab ? 'active' : ''}`;
            if (activeSkillMinion.specialization && activeSkillMinion.specialization !== spec) {
                btn.style.opacity = '0.5';
                btn.title = `Locked (Chosen specialization: ${activeSkillMinion.specialization})`;
            }
            btn.textContent = spec;
            btn.addEventListener('click', () => {
                activeSkillTab = spec;
                updateSkillDashboardUI();
            });
            tabsContainer.appendChild(btn);
        });
    }
    
    // Render 3 columns of vertical nodes connected by lines
    const content = document.querySelector('.skill-content');
    if (content) {
        content.innerHTML = '';
        content.style.display = 'flex';
        content.style.flexDirection = 'row';
        content.style.justifyContent = 'space-around';
        content.style.gap = '30px';
        content.style.background = '#222';
        content.style.padding = '30px';
        content.style.borderRadius = '5px';
        
        const tree = skillTrees.trees[activeSkillTab] || [[], [], []];
        tree.forEach((col, colIndex) => {
            const colElem = document.createElement('div');
            colElem.className = 'skill-tree-column';
            
            col.forEach((skill, rowIndex) => {
                const currentRank = activeSkillMinion.specializations[skill.id] || 0;
                
                // Unlocked logic:
                // 1. Minion has chosen THIS active spec tab as their specialization (or hasn't chosen a spec yet - although if they haven't chosen yet, they should be in the Choose Specialization modal first)
                // 2. Row is 0 (top node in column) OR the parent node directly above (rowIndex - 1) has points spent (> 0)
                const anotherSpecChosen = activeSkillMinion.specialization && activeSkillMinion.specialization !== activeSkillTab;
                const parentLocked = rowIndex > 0 && (activeSkillMinion.specializations[col[rowIndex - 1].id] || 0) === 0;
                const isLocked = anotherSpecChosen || parentLocked;
                
                const node = document.createElement('div');
                node.className = `skill-tree-node ${isLocked ? 'locked' : ''} ${currentRank >= skill.max ? 'maxed' : ''}`;
                
                const currentProps = getSkillProperties(skill.name, currentRank || 1);
                const nextRank = Math.min(skill.max, currentRank + 1);
                const nextProps = getSkillProperties(skill.name, nextRank);
                
                const iconToUse = currentProps.icon || '🔮';
                
                node.innerHTML = `
                    <img src="${getSkillIconPath(iconToUse)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px; z-index: 2;" />
                    <div style="display: none; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 2; font-size: 24px; color: white;">
                        ${isEmoji(iconToUse) ? iconToUse : (skill.name[0] || '🔮')}
                    </div>
                    <span class="skill-badge" style="z-index: 3;">${currentRank}/${skill.max}</span>
                `;
                
                // Dynamic Rank-Specific Tooltip
                let tooltip = `${skill.name} (Rank ${currentRank}/${skill.max})\n`;
                if (currentRank > 0) {
                    tooltip += `Current: ${currentProps.desc}\n`;
                }
                if (currentRank < skill.max) {
                    tooltip += `Next: ${nextProps.desc}`;
                }
                node.title = tooltip.trim();
                
                // Point allocation clicks
                if (!isLocked && activeSkillMinion.skillPoints > 0 && currentRank < skill.max && activeSkillMinion.specialization === activeSkillTab) {
                    node.addEventListener('click', () => {
                        buySpecializationPoint(skill.id);
                    });
                }
                
                colElem.appendChild(node);
            });
            
            content.appendChild(colElem);
        });
    }
}

function updateSpecializationModalUI() {
    if (!currentActiveMinion) return;
    
    // Ensure specializations exist
    if (!currentActiveMinion.specializations) {
        currentActiveMinion.specializations = {};
    }
    
    // Update header
    const title = document.querySelector('#specialization-modal h2');
    if (title) title.textContent = `Specialization for: ${currentActiveMinion.name}`;
    
    // Update points display
    const pointsDisplay = document.getElementById('spec-points');
    if (pointsDisplay) pointsDisplay.textContent = currentActiveMinion.skillPoints || 0;
    
    const trees = getMinionSkillTrees(currentActiveMinion.name);
    const specNames = trees.specializations; // e.g. ['Speed', 'Guard', 'Normal']
    
    // Set headers text dynamically
    const specTabs = document.querySelectorAll('#specialization-modal div[style*="display:flex; width:100%;"] div');
    if (specTabs.length >= 3) {
        specTabs[0].textContent = specNames[0];
        specTabs[1].textContent = specNames[1];
        specTabs[2].textContent = specNames[2];
    }
    
    // Set icons and allocation badges dynamically
    const specBtns = [
        document.getElementById('spec-btn-speed'),
        document.getElementById('spec-btn-guard'),
        document.getElementById('spec-btn-normal')
    ];
    
    specNames.forEach((spec, i) => {
        const btn = specBtns[i];
        if (btn) {
            const specTree = trees.trees[spec];
            const starterSkill = (specTree && specTree[0] && specTree[0][0]) || { name: '', id: 'unknown' };
            
            // Calculate total spent in this path branch
            let allocated = 0;
            if (specTree) {
                specTree.forEach(col => {
                    col.forEach(s => {
                        allocated += currentActiveMinion.specializations[s.id] || 0;
                    });
                });
            }
            
            const starterProps = starterSkill.name ? getSkillProperties(starterSkill.name, 1) : { icon: '🔮' };
            const iconToUse = starterProps.icon || '🔮';
            
            btn.innerHTML = `
                <img src="${getSkillIconPath(iconToUse)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px; z-index: 2;" />
                <div style="display: none; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 2; font-size: 32px; color: white;">
                    ${isEmoji(iconToUse) ? iconToUse : (starterSkill.name[0] || '🔮')}
                </div>
                <div class="spec-badge" style="position:absolute; bottom:-10px; right:-10px; background:black; color:white; font-size:12px; padding:2px 5px; border-radius:10px; font-weight:bold; border:2px solid #333;">${allocated} spent</div>
            `;
            
            // Lock styling if another spec is active
            if (currentActiveMinion.specialization && currentActiveMinion.specialization !== spec) {
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        }
    });
}

function isEmoji(str) {
    if (!str) return false;
    const charCode = str.charCodeAt(0);
    return str.length <= 4 && (charCode > 127 || charCode === 0);
}

function getSkillIconPath(icon) {
    if (!icon) return 'assets/skills/default.png';
    if (icon.includes('/') || icon.includes('\\')) return icon;
    if (icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.gif')) {
        return `assets/skills/${icon}`;
    }
    return `assets/skills/${icon}.png`;
}

// Wire up Toggle Team and Release buttons in the Collection Screen details panel
document.getElementById('btn-col-toggle-team').addEventListener('click', () => {
    const minion = state.collection[window.selectedCollectionIndex];
    if (!minion) return;
    
    if (minion.inTeam) {
        // Remove from team
        const activeTeam = state.collection.filter(m => m.inTeam);
        if (activeTeam.length <= 1) {
            alert("You must keep at least 1 minion in your active team!");
            return;
        }
        minion.inTeam = false;
        window.syncArmyAndCollection();
        saveGame();
        updateCollectionUI();
        selectCollectionMinion(window.selectedCollectionIndex);
    } else {
        // Add to team
        const activeTeam = state.collection.filter(m => m.inTeam);
        if (activeTeam.length < 5) {
            minion.inTeam = true;
            window.syncArmyAndCollection();
            saveGame();
            updateCollectionUI();
            selectCollectionMinion(window.selectedCollectionIndex);
        } else {
            // Team is full! Trigger Swap Modal!
            window.showSwapModal(minion, () => {
                updateCollectionUI();
                selectCollectionMinion(window.selectedCollectionIndex);
            });
        }
    }
});

document.getElementById('btn-release').addEventListener('click', () => {
    const minion = state.collection[window.selectedCollectionIndex];
    if (!minion) return;
    
    if (minion.inTeam) {
        const activeTeam = state.collection.filter(m => m.inTeam);
        if (activeTeam.length <= 1) {
            alert("You cannot release your only active team member!");
            return;
        }
    }
    
    const confirmRelease = confirm(`Are you sure you want to release ${minion.name}? This action cannot be undone.`);
    if (confirmRelease) {
        state.collection.splice(window.selectedCollectionIndex, 1);
        window.syncArmyAndCollection();
        saveGame();
        
        // Select another minion
        window.selectedCollectionIndex = 0;
        updateCollectionUI();
    }
});
