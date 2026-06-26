// Core Game Coordinator and Combat Controller
localStorage.removeItem('minhero_saves'); // Wipe old save to apply fresh Tigriers!

let preMenuScreen = screenMain;

// --- Save & Load System ---
function saveGame() {
    if(!currentSlot) return;
    saves[currentSlot] = state;
    localStorage.setItem('minhero_saves', JSON.stringify(saves));
}

// Initial load from storage
let savesData = localStorage.getItem('minhero_saves');
if (savesData) {
    saves = JSON.parse(savesData);
}

btnPlay.addEventListener('click', () => {
    btnPlay.classList.add('hidden');
    saveSlotsContainer.classList.remove('hidden');
    updateSaveSlotsUI();
});

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
            characterCreationOverlay.classList.remove('hidden');
        }
    });
});

if (btnCloseChar) {
    btnCloseChar.addEventListener('click', () => {
        characterCreationOverlay.classList.add('hidden');
        saveSlotsContainer.classList.remove('hidden');
    });
}

// --- Menu Navigation ---
btnMenu.addEventListener('click', () => {
    menuOverlay.classList.remove('hidden');
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

// --- Character Creation ---
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
    
    // Starting Minions: 3 Level 1 Tigriers (as requested!)
    state.collection = [
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 }
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
    screenIntro.classList.add('doors-opening');
    
    setTimeout(() => {
        fadeOverlay.classList.remove('hidden');
        void fadeOverlay.offsetWidth;
        fadeOverlay.classList.add('blackout');
        
        setTimeout(() => {
            showScreen(screenMain);
            buildTower();
            fadeOverlay.classList.remove('blackout');
            setTimeout(() => { fadeOverlay.classList.add('hidden'); }, 500);
        }, 1000);
    }, 1000);
}

// --- Egg Hatching Logic ---
eggs.forEach(egg => {
    egg.addEventListener('click', () => {
        egg.textContent = '💥';
        
        setTimeout(() => {
            const randomMinion = availableMinions[Math.floor(Math.random() * availableMinions.length)];
            alert(`You hatched a ${randomMinion}! It has been sent to your collection.`);
            
            state.collection.push({
                name: randomMinion,
                level: 1,
                xp: 0,
                skillPoints: 0
            });
            saveGame();
            
            eggs.forEach(e => e.textContent = '🥚');
            buildTower();
            showScreen(screenMain);
        }, 500);
    });
});

// --- Stat and Ability Data Loading ---
async function fetchMinionStats(name, level = 1, specializations = null) {
    let stats;
    let element = 'NORMAL';
    
    if (MINION_DB[name]) {
        stats = JSON.parse(JSON.stringify(MINION_DB[name].stats));
        element = MINION_DB[name].element;
    } else {
        const defaultStats = {
            HEALTH: { value: 80, primary: false },
            ENERGY: { value: 50, primary: false },
            ATTACK: { value: 10, primary: false },
            HEALING: { value: 5, primary: false },
            SPEED: { value: 10, primary: false }
        };
        stats = { ...defaultStats };
        try {
            const response = await fetch(`assets/minions/${name}/stats.txt?t=${Date.now()}`);
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
        
        try {
            const eleRes = await fetch(`assets/minions/${name}/element.txt?t=${Date.now()}`);
            if(eleRes.ok) {
                element = (await eleRes.text()).trim().toUpperCase() || 'NORMAL';
            }
        } catch(e) {}
    }
    
    let healthBonus = 0;
    let attackBonus = 0;
    let speedBonus = 0;
    let healingBonus = 0;
    
    if (specializations) {
        const trees = getMinionSkillTrees(name);
        Object.keys(specializations).forEach(skillId => {
            const rank = specializations[skillId] || 0;
            if (rank > 0) {
                let skillFound = null;
                for (let path in trees.trees) {
                    for (let col of trees.trees[path]) {
                        const found = col.find(s => s.id === skillId);
                        if (found) {
                            skillFound = found;
                            break;
                        }
                    }
                    if (skillFound) break;
                }
                
                if (skillFound && skillFound.statsBonus) {
                    if (skillFound.statsBonus.health) healthBonus += skillFound.statsBonus.health * rank;
                    if (skillFound.statsBonus.attack) attackBonus += skillFound.statsBonus.attack * rank;
                    if (skillFound.statsBonus.speed) speedBonus += skillFound.statsBonus.speed * rank;
                    if (skillFound.statsBonus.healing) healingBonus += skillFound.statsBonus.healing * rank;
                } else {
                    // Fall back to original hardcoded mappings if statsBonus property is missing
                    if (skillId === 'iron_defense') healthBonus += 5 * rank;
                    if (skillId === 'power_up') attackBonus += 1 * rank;
                    if (skillId === 'haste') speedBonus += 3 * rank;
                    if (skillId === 'heal_boost') healingBonus += 1 * rank;
                }
            }
        });
    }
    
    const levelScale = (level - 1);
    
    return {
        health: stats.HEALTH.value + (stats.HEALTH.primary ? levelScale * 5 : levelScale * 2) + healthBonus,
        energy: stats.ENERGY.value + (stats.ENERGY.primary ? levelScale * 5 : levelScale * 2),
        attack: stats.ATTACK.value + (stats.ATTACK.primary ? levelScale * 5 : levelScale * 2) + attackBonus,
        healing: stats.HEALING.value + (stats.HEALING.primary ? levelScale * 5 : levelScale * 2) + healingBonus,
        speed: stats.SPEED.value + (stats.SPEED.primary ? levelScale * 5 : levelScale * 2) + speedBonus,
        element: element
    };
}

async function fetchAbilityDetails(abilityName) {
    if (ABILITY_DB[abilityName]) {
        return {
            damage: ABILITY_DB[abilityName].damage,
            element: ABILITY_DB[abilityName].element,
            cooldown: ABILITY_DB[abilityName].cooldown || 0
        };
    }
    
    let details = { damage: 0, element: 'NORMAL', cooldown: 0 };
    try {
        const response = await fetch(`assets/abilities/${abilityName}/description.txt?t=${Date.now()}`);
        if(response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            lines.forEach(line => {
                if(line.toUpperCase().startsWith('DAMAGE:')) {
                    details.damage = parseInt(line.split(':')[1].trim(), 10) || 0;
                }
                if(line.toUpperCase().startsWith('ELEMENT:')) {
                    details.element = line.split(':')[1].trim().toUpperCase() || 'NORMAL';
                }
                if(line.toUpperCase().startsWith('TURN OFF:')) {
                    const cdText = line.split(':')[1].trim();
                    if(cdText.toLowerCase().includes('turns')) {
                        details.cooldown = parseInt(cdText, 10) || 0;
                    }
                }
            });
        }
    } catch(e) {}
    return details;
}

// --- Combat Flow Logic ---
async function startLevelCombat(floor, room, isBoss) {
    combatState.currentFloor = floor;
    combatState.currentRoom = room;
    combatState.isBoss = isBoss;
    combatState.state = 'INIT';
    combatLog.innerHTML = '';
    logCombat('Loading combatants...');
    
    const numEnemies = isBoss ? 3 : 2;
    combatState.enemies = [];
    
    for(let i=0; i<numEnemies; i++) {
        const randomName = 'Tigrier';
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
            element: stats.element,
            isDead: false,
            side: 'enemy',
            index: i
        });
    }
    
    combatState.players = [];
    for(let i=0; i<state.army.length; i++) {
        const m = state.army[i];
        // DO NOT reset m.level to 1. Keep persistent minion level!
        const stats = await fetchMinionStats(m.name, m.level, m.specializations);
        combatState.players.push({
            ...m,
            health: stats.health,
            maxHealth: stats.health,
            currentHealth: stats.health,
            energy: stats.energy,
            attack: stats.attack,
            healing: stats.healing,
            speed: stats.speed,
            element: stats.element,
            isDead: false,
            side: 'player',
            index: i,
            cooldowns: {}
        });
    }
    
    logCombat(`Encountered ${numEnemies} enemies!`);
    renderCombatUI();
    showScreen(screenCombat);
    
    document.querySelectorAll('.combat-slot').forEach(slot => {
        slot.classList.add('pop-in');
        setTimeout(() => slot.classList.remove('pop-in'), 500);
    });
    
    setTimeout(() => {
        buildTurnQueue();
        processNextTurn();
    }, 1000);
}

function buildTurnQueue() {
    const allCombatants = [...combatState.players, ...combatState.enemies].filter(c => !c.isDead);
    combatState.turnQueue = allCombatants.sort((a, b) => b.speed - a.speed);
    combatState.currentTurnIndex = 0;
}

function processNextTurn() {
    if (checkWinCondition()) return;
    
    combatState.state = 'WAITING';
    
    document.querySelectorAll('.combat-slot').forEach(s => s.classList.remove('active-turn'));
    document.querySelectorAll('.ability-container').forEach(n => n.remove());
    combatVignette.classList.add('hidden');
    
    let activeCombatant = combatState.turnQueue[combatState.currentTurnIndex];
    
    if(activeCombatant.isDead) {
        advanceTurn();
        return;
    }
    
    // Decrement cooldowns at turn start
    if (activeCombatant.cooldowns) {
        for (let abName in activeCombatant.cooldowns) {
            if (activeCombatant.cooldowns[abName] > 0) {
                activeCombatant.cooldowns[abName]--;
            }
        }
    }
    
    logCombat(`Turn: ${activeCombatant.name}`);
    
    const prefix = activeCombatant.side === 'player' ? 'p' : 'e';
    const slot = document.getElementById(`${prefix}-slot-${activeCombatant.index}`);
    if(slot) {
        slot.classList.add('active-turn');
        combatVignette.classList.remove('hidden');
    }
    
    if (activeCombatant.side === 'player') {
        spawnAbilityNodes(activeCombatant, slot);
    } else {
        setTimeout(() => {
            enemyAIAction(activeCombatant);
        }, 1500);
    }
}

function spawnAbilityNodes(player, slotElem) {
    if(!slotElem) return;
    
    const abilities = [
        { name: 'Claw', cost: 2, desc: 'Deals damage to one opponent for a very small mana price.', color: '#e0cca8', targetType: 'single_enemy' },
        { name: 'Roar', cost: 3, desc: 'Scares opponent making them deal less damage the entire game by 10%.', color: '#f1c40f', targetType: 'single_enemy' },
        { name: 'TigerBite', cost: 9, desc: 'Deals damage and regenerates 30% of damage dealt.', color: '#d35400', targetType: 'single_enemy' }
    ];
    
    const positions = [
        { top: '-130px', left: '170px' },
        { top: '0px', left: '230px' },
        { top: '130px', left: '170px' }
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
        label.style.backgroundColor = 'black';
        label.style.color = 'white';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '10px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        
        const node = document.createElement('div');
        node.className = 'ability-node';
        node.style.position = 'relative';
        node.style.backgroundColor = ab.color;
        node.dataset.tooltip = `${ab.name}\nMana: ${ab.cost}\n${ab.desc}`;
        
        const cdRemaining = (player.cooldowns && player.cooldowns[ab.name]) || 0;
        if (cdRemaining > 0) {
            node.style.opacity = '0.4';
            node.style.filter = 'grayscale(1)';
            label.textContent = `${ab.name} (CD: ${cdRemaining})`;
        } else {
            label.textContent = ab.name;
        }
        
        const imgPath = `assets/abilities/${ab.name}/image.png`;
        node.innerHTML = `
            <img src="${imgPath}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;" />
            <span style="display: none;">${ab.name[0]}</span>
        `;
        
        nodeContainer.appendChild(label);
        nodeContainer.appendChild(node);
        
        setTimeout(() => {
            node.style.transform = 'scale(1)';
        }, 50 * i);
        
        if (cdRemaining === 0) {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                if(combatState.state !== 'WAITING') return;
                
                if (ab.targetType === 'single_enemy') {
                    combatState.state = 'TARGETING';
                    combatState.selectedAbility = ab;
                    combatState.activePlayer = player;
                    
                    document.querySelectorAll('.ability-container').forEach(n => n.remove());
                    
                    renderCombatUI();
                    logCombat(`Select a target for ${ab.name}!`);
                } else {
                    combatState.state = 'ANIMATING';
                    document.querySelectorAll('.ability-container').forEach(n => n.remove());
                    executePlayerAbility(player, ab);
                }
            });
        }
        
        slotElem.appendChild(nodeContainer);
    });
}

async function executePlayerAbility(player, ability, target = null) {
    if (!target) {
        const aliveEnemies = combatState.enemies.filter(e => !e.isDead);
        if(aliveEnemies.length === 0) return;
        target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    }
    
    const abInstance = AbilityRegistry[ability.name];
    if (!abInstance) {
        logCombat(`Error: Unknown ability ${ability.name}`);
        combatState.state = 'WAITING';
        renderCombatUI();
        return;
    }
    
    const success = abInstance.execute(player, target);
    if (!success) {
        combatState.state = 'WAITING';
        renderCombatUI();
        const slot = document.getElementById(`p-slot-${player.index}`);
        if (slot) spawnAbilityNodes(player, slot);
        return;
    }
    
    renderCombatUI();
    setTimeout(advanceTurn, 1000);
}

async function enemyAIAction(enemy) {
    if(combatState.state !== 'WAITING') return;
    combatState.state = 'ANIMATING';
    
    const alivePlayers = combatState.players.filter(p => !p.isDead);
    if(alivePlayers.length > 0) {
        const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        
        const biteAbility = AbilityRegistry['Bite'];
        biteAbility.execute(enemy, target);
    }
    
    renderCombatUI();
    setTimeout(advanceTurn, 1000);
}

function advanceTurn() {
    combatState.currentTurnIndex++;
    if(combatState.currentTurnIndex >= combatState.turnQueue.length) {
        buildTurnQueue();
    }
    processNextTurn();
}

function logCombat(message) {
    combatLog.innerHTML += `<p>${message}</p>`;
    combatLog.scrollTop = combatLog.scrollHeight;
}

function checkWinCondition() {
    const allPlayersDead = combatState.players.every(p => p.isDead);
    const allEnemiesDead = combatState.enemies.every(e => e.isDead);
    
    if (allEnemiesDead) {
        combatState.state = 'END';
        logCombat("Victory!");
        setTimeout(() => {
            handleCombatWin();
        }, 1500);
        return true;
    }
    
    if (allPlayersDead) {
        combatState.state = 'END';
        logCombat("Defeat...");
        setTimeout(() => {
            fadeOverlay.classList.remove('hidden');
            void fadeOverlay.offsetWidth;
            fadeOverlay.classList.add('blackout');
            setTimeout(() => {
                showScreen(screenMain);
                buildTower();
                fadeOverlay.classList.remove('blackout');
                setTimeout(() => { fadeOverlay.classList.add('hidden'); }, 500);
            }, 500);
        }, 1500);
        return true;
    }
    return false;
}

// --- Level Up & Persistence Logic ---
let levelUpQueue = [];
let gainedSkillPointGlobal = false;

async function handleCombatWin(earnedStars) {
    if (earnedStars === undefined) {
        earnedStars = combatState.enemies.filter(e => e.isDead).length;
    }
    let earnedMoney = 50 + (state.skills.coinBoost.rank * 10);
    
    let xpGained = 0;
    combatState.enemies.forEach(e => {
        if (e.isDead) {
            xpGained += (e.level || 1) * 50; 
        }
    });
    
    if (state.skills.xpBoost && state.skills.xpBoost.rank > 0) {
        xpGained += state.skills.xpBoost.rank * 10;
    }
    
    levelUpQueue = [];
    gainedSkillPointGlobal = false;
    
    for (let p of combatState.players) {
        const origMinion = state.army[p.index];
        if (!origMinion) continue;
        
        if (p.xp === undefined) p.xp = 0;
        if (p.maxXP === undefined) p.maxXP = p.level * 100;
        if (p.skillPoints === undefined) p.skillPoints = 0;
        
        p.xp += xpGained;
        let levelsGained = 0;
        let oldLevel = p.level;
        let gainedSkillPoint = false;
        
        while (p.xp >= p.maxXP) {
            p.xp -= p.maxXP;
            p.level++;
            p.maxXP = p.level * 100;
            levelsGained++;
            
            if (p.level % 3 === 0) {
                p.skillPoints++;
                gainedSkillPoint = true;
                gainedSkillPointGlobal = true;
            }
        }
        
        if (levelsGained > 0) {
            const newLevel = p.level;
            const oldStats = await fetchMinionStats(p.name, oldLevel, p.specializations);
            const newStats = await fetchMinionStats(p.name, newLevel, p.specializations);
            
            p.health = newStats.health;
            p.energy = newStats.energy;
            p.attack = newStats.attack;
            p.healing = newStats.healing;
            p.speed = newStats.speed;
            p.currentHealth = p.health;
            p.currentEnergy = p.energy;
            
            levelUpQueue.push({
                name: p.name,
                level: newLevel,
                oldStats,
                newStats,
                gainedSkillPoint
            });
        }
        
        // Sync changes back to original army object
        origMinion.level = p.level;
        origMinion.xp = p.xp;
        origMinion.maxXP = p.maxXP;
        origMinion.skillPoints = p.skillPoints;
        if (p.health) origMinion.health = p.health;
        if (p.energy) origMinion.energy = p.energy;
        if (p.attack) origMinion.attack = p.attack;
        if (p.healing) origMinion.healing = p.healing;
        if (p.speed) origMinion.speed = p.speed;
    }
    
    // Sync state.collection and state.army
    state.collection = [...state.army];
    
    state.stars += earnedStars;
    state.money += earnedMoney;
    
    let progressed = false;
    let nextFloor = state.unlockedFloor;
    let nextRoom = state.unlockedRoom;
    
    if (combatState.currentFloor === state.unlockedFloor && combatState.currentRoom === state.unlockedRoom) {
        progressed = true;
        if (combatState.currentRoom === 3) {
            nextFloor++;
            nextRoom = 1;
        } else {
            nextRoom++;
        }
    }
    
    processLevelUpQueue(() => {
        finishCombatWin(progressed, nextFloor, nextRoom);
    });
}

function processLevelUpQueue(onComplete) {
    if (levelUpQueue.length === 0) {
        if (gainedSkillPointGlobal) {
            const candidate = state.army.find(m => m.skillPoints > 0);
            if (candidate) {
                activeSkillMinion = candidate;
                activeSkillTab = 'Speed';
                updateSkillDashboardUI();
            }
            
            const dashboard = document.getElementById('skill-dashboard');
            dashboard.classList.remove('hidden');
            setTimeout(() => { dashboard.classList.add('slide-down'); }, 50);
            
            const closeBtn = document.getElementById('btn-close-skill-dashboard');
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            newCloseBtn.addEventListener('click', () => {
                dashboard.classList.remove('slide-down');
                setTimeout(() => { 
                    dashboard.classList.add('hidden'); 
                    onComplete();
                }, 500);
            });
        } else {
            onComplete();
        }
        return;
    }
    
    const lu = levelUpQueue.shift();
    const popup = document.getElementById('level-up-popup');
    
    document.getElementById('lu-name').textContent = lu.name;
    document.getElementById('lu-level').textContent = `lv.${lu.level}`;
    
    document.getElementById('lu-old-health').textContent = lu.oldStats.health;
    document.getElementById('lu-new-health').textContent = `+${lu.newStats.health - lu.oldStats.health}`;
    
    document.getElementById('lu-old-energy').textContent = lu.oldStats.energy;
    document.getElementById('lu-new-energy').textContent = `+${lu.newStats.energy - lu.oldStats.energy}`;
    
    document.getElementById('lu-old-attack').textContent = lu.oldStats.attack;
    document.getElementById('lu-new-attack').textContent = `+${lu.newStats.attack - lu.oldStats.attack}`;
    
    document.getElementById('lu-old-healing').textContent = lu.oldStats.healing;
    document.getElementById('lu-new-healing').textContent = `+${lu.newStats.healing - lu.oldStats.healing}`;
    
    document.getElementById('lu-old-speed').textContent = lu.oldStats.speed;
    document.getElementById('lu-new-speed').textContent = `+${lu.newStats.speed - lu.oldStats.speed}`;
    
    const starGraphic = document.getElementById('new-skill-point-graphic');
    if (lu.gainedSkillPoint) {
        starGraphic.classList.remove('hidden');
    } else {
        starGraphic.classList.add('hidden');
    }
    
    popup.classList.remove('hidden');
    
    const nextBtn = document.getElementById('btn-next-level-up');
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newNextBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
        processLevelUpQueue(onComplete);
    });
}

function finishCombatWin(progressed, nextFloor, nextRoom) {
    fadeOverlay.classList.remove('hidden');
    void fadeOverlay.offsetWidth;
    fadeOverlay.classList.add('blackout');
    
    setTimeout(() => {
        if(combatState.isBoss) {
            showScreen(screenEgg);
        } else {
            showScreen(screenMain);
        }
        
        if (progressed && !combatState.isBoss) {
            buildTower(); 
            fadeOverlay.classList.remove('blackout');
            setTimeout(() => { fadeOverlay.classList.add('hidden'); }, 500);
            
            setTimeout(() => {
                const targetIndex = (nextFloor - 1) * 3 + (nextRoom - 1);
                const towerStructure = document.getElementById('tower-structure');
                if (towerStructure && towerStructure.children[targetIndex]) {
                    const lockDiv = towerStructure.children[targetIndex];
                    const lockImg = lockDiv.querySelector('img');
                    if (lockImg) {
                        lockImg.classList.add('shiver-and-break');
                    }
                }
                
                setTimeout(() => {
                    state.unlockedFloor = nextFloor;
                    state.unlockedRoom = nextRoom;
                    saveGame();
                    buildTower();
                }, 2000);
            }, 500);
            
        } else {
            if (progressed) {
                state.unlockedFloor = nextFloor;
                state.unlockedRoom = nextRoom;
            }
            saveGame();
            buildTower();
            
            fadeOverlay.classList.remove('blackout');
            setTimeout(() => { fadeOverlay.classList.add('hidden'); }, 500);
        }
    }, 500);
}

// --- Upgrade Skill Window Function ---
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

// --- Modal System UI Listeners ---
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

teamListContainer.addEventListener('click', (e) => {
    const row = e.target.closest('.team-list-row');
    if (row) {
        const index = Array.from(teamListContainer.children).indexOf(row);
        currentActiveMinion = state.army[index];
        openMinionDetailContext();
    }
});

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

// Skill Tree Button on details modal
mdBtnSkilltree.addEventListener('click', () => {
    if (!currentActiveMinion) return;
    minionDetailModal.classList.add('hidden');
    
    if (currentActiveMinion.specialization) {
        // Open skill tree directly
        activeSkillMinion = currentActiveMinion;
        activeSkillTab = currentActiveMinion.specialization;
        updateSkillDashboardUI();
        
        const dashboard = document.getElementById('skill-dashboard');
        dashboard.classList.remove('hidden');
        setTimeout(() => { dashboard.classList.add('slide-down'); }, 50);
        
        bindDashboardClose(() => {
            dashboard.classList.remove('slide-down');
            setTimeout(() => {
                dashboard.classList.add('hidden');
                minionDetailModal.classList.remove('hidden');
                populateMinionDetails();
            }, 500);
        });
    } else {
        // Open specialization choice modal
        specializationModal.classList.remove('hidden');
        updateSpecializationModalUI();
    }
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

function bindDashboardClose(onClose) {
    const closeBtn = document.getElementById('btn-close-skill-dashboard');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', onClose);
    }
}

// Category clicks in specialization modal -> open skill tree dashboard for that category!
function openDashboardFromSpec(tabName) {
    if (!currentActiveMinion) return;
    
    const trees = getMinionSkillTrees(currentActiveMinion.name);
    
    // Path lock selection check
    if (!currentActiveMinion.specialization) {
        if ((currentActiveMinion.skillPoints || 0) > 0) {
            currentActiveMinion.specialization = tabName;
            currentActiveMinion.skillPoints--;
            
            // Allocate the first point to the starter skill (Column 1, Row 1)
            const specTree = trees.trees[tabName];
            if (specTree && specTree[0] && specTree[0][0]) {
                const starter = specTree[0][0];
                if (!currentActiveMinion.specializations) currentActiveMinion.specializations = {};
                currentActiveMinion.specializations[starter.id] = 1;
            }
            
            recalculateMinionStats(currentActiveMinion).then(() => {
                saveGame();
                alert(`Unlocked ${tabName} specialization! Spent 1 point on starter skill.`);
                proceedToDashboard();
            });
            return;
        } else {
            alert("You need at least 1 Skill Point to choose a specialization path!");
            return;
        }
    } else if (currentActiveMinion.specialization !== tabName) {
        // Clicking another locked tab
        alert(`This path is locked. ${currentActiveMinion.name} is specialized in ${currentActiveMinion.specialization}!`);
        return;
    }
    
    proceedToDashboard();

    function proceedToDashboard() {
        activeSkillMinion = currentActiveMinion;
        activeSkillTab = tabName;
        updateSkillDashboardUI();
        specializationModal.classList.add('hidden');
        
        const dashboard = document.getElementById('skill-dashboard');
        dashboard.classList.remove('hidden');
        setTimeout(() => { dashboard.classList.add('slide-down'); }, 50);
        
        bindDashboardClose(() => {
            dashboard.classList.remove('slide-down');
            setTimeout(() => { 
                dashboard.classList.add('hidden'); 
                specializationModal.classList.remove('hidden');
                updateSpecializationModalUI();
            }, 500);
        });
    }
}

const specBtnSpeed = document.getElementById('spec-btn-speed');
if (specBtnSpeed) {
    specBtnSpeed.addEventListener('click', () => {
        const trees = getMinionSkillTrees(currentActiveMinion.name);
        openDashboardFromSpec(trees.specializations[0]);
    });
}
const specBtnGuard = document.getElementById('spec-btn-guard');
if (specBtnGuard) {
    specBtnGuard.addEventListener('click', () => {
        const trees = getMinionSkillTrees(currentActiveMinion.name);
        openDashboardFromSpec(trees.specializations[1]);
    });
}
const specBtnNormal = document.getElementById('spec-btn-normal');
if (specBtnNormal) {
    specBtnNormal.addEventListener('click', () => {
        const trees = getMinionSkillTrees(currentActiveMinion.name);
        openDashboardFromSpec(trees.specializations[2]);
    });
}

// Specialization resetting logic (spec-btn-reset)
const specBtnReset = document.getElementById('spec-btn-reset');
if (specBtnReset) {
    specBtnReset.addEventListener('click', () => {
        if (!currentActiveMinion) return;
        resetMinionSpecialization(currentActiveMinion).then(() => {
            updateSpecializationModalUI();
        });
    });
}

// Full Dashboard Reset Button
const btnResetSkills = document.getElementById('btn-reset-skills');
if (btnResetSkills) {
    btnResetSkills.addEventListener('click', () => {
        if (!activeSkillMinion) return;
        resetMinionSpecialization(activeSkillMinion).then(() => {
            const dashboard = document.getElementById('skill-dashboard');
            dashboard.classList.remove('slide-down');
            setTimeout(() => {
                dashboard.classList.add('hidden');
                specializationModal.classList.remove('hidden');
                updateSpecializationModalUI();
            }, 500);
        });
    });
}

async function resetMinionSpecialization(minion) {
    let refundedPoints = 0;
    const trees = getMinionSkillTrees(minion.name);
    
    // Loop through all skills in their trees and count ranks
    if (minion.specializations) {
        for (let path in trees.trees) {
            trees.trees[path].forEach(col => {
                col.forEach(skill => {
                    const rank = minion.specializations[skill.id] || 0;
                    refundedPoints += rank;
                    minion.specializations[skill.id] = 0;
                });
            });
        }
    }
    
    // Also check if they had points in path lock
    if (minion.specialization) {
        minion.specialization = null;
    }
    
    if (refundedPoints > 0) {
        minion.skillPoints = (minion.skillPoints || 0) + refundedPoints;
        await recalculateMinionStats(minion);
        saveGame();
        alert(`Refunded ${refundedPoints} skill points and reset specialization choice!`);
    } else {
        alert("No skill points spent to refund.");
    }
}

window.buySpecializationPoint = function(skillId) {
    if (!activeSkillMinion || (activeSkillMinion.skillPoints || 0) <= 0) return;
    
    if (!activeSkillMinion.specializations) {
        activeSkillMinion.specializations = {};
    }
    
    const trees = getMinionSkillTrees(activeSkillMinion.name);
    let skillFound = null;
    
    // Look up the skill in the minion's skill trees
    for (let path in trees.trees) {
        for (let col of trees.trees[path]) {
            const found = col.find(s => s.id === skillId);
            if (found) {
                skillFound = found;
                break;
            }
        }
        if (skillFound) break;
    }
    
    if (!skillFound) return;
    
    const currentRank = activeSkillMinion.specializations[skillId] || 0;
    if (currentRank >= skillFound.max) {
        alert("Skill is already at max rank!");
        return;
    }
    
    activeSkillMinion.skillPoints--;
    activeSkillMinion.specializations[skillId] = currentRank + 1;
    
    recalculateMinionStats(activeSkillMinion).then(() => {
        saveGame();
        updateSkillDashboardUI();
    });
};

async function recalculateMinionStats(minion) {
    const stats = await fetchMinionStats(minion.name, minion.level, minion.specializations);
    minion.health = stats.health;
    minion.energy = stats.energy;
    minion.attack = stats.attack;
    minion.healing = stats.healing;
    minion.speed = stats.speed;
}
