// Abilities classes and registry
class Ability {
    constructor(name, cost, damage, element, desc, targetType, cooldown = 0) {
        this.name = name;
        this.cost = cost;
        this.damage = damage;
        this.element = element;
        this.desc = desc;
        this.targetType = targetType;
        this.cooldown = cooldown;
    }

    calculateDamage(user, target, baseDmg = null) {
        let finalBaseDmg = baseDmg !== null ? baseDmg : (user.attack + this.damage);
        let variance = Math.random() * 0.1 + 0.95; // 0.95 to 1.05
        let multiplier = 1;
        let isSuper = false;
        let isNotEffective = false;

        const matchup = elementalMatchups[this.element] || { strong: [], weak: [] };
        if (matchup.strong.includes(target.element)) {
            multiplier = Math.random() * 0.3 + 1.6;
            isSuper = true;
        } else if (matchup.weak.includes(target.element)) {
            multiplier = 0.5;
            isNotEffective = true;
        }

        let dmg = Math.floor(finalBaseDmg * variance * multiplier);
        
        // Critical hit check from Swift Strike (10% crit chance per rank, 1.5x damage)
        if (user.specializations && user.specializations.swift_strike > 0) {
            const critChance = 0.10 * user.specializations.swift_strike;
            if (Math.random() < critChance) {
                dmg = Math.floor(dmg * 1.5);
                logCombat(`Critical Hit!`);
            }
        }
        
        return { dmg, isSuper, isNotEffective };
    }

    execute(user, target) {
        if (user.energy < this.cost) {
            logCombat(`${user.name} doesn't have enough energy!`);
            return false;
        }
        
        // Cooldown check
        if (user.cooldowns && user.cooldowns[this.name] > 0) {
            logCombat(`${this.name} is on cooldown for ${user.cooldowns[this.name]} more turn(s)!`);
            return false;
        }

        user.energy -= this.cost;
        logCombat(`${user.name} used ${this.name}!`);

        if (target) {
            let { dmg, isSuper, isNotEffective } = this.calculateDamage(user, target);
            
            // Sturdy damage reduction
            if (target.specializations && target.specializations.sturdy > 0) {
                const reduction = 1 * target.specializations.sturdy;
                dmg = Math.max(0, dmg - reduction);
            }
            
            target.currentHealth -= dmg;
            if (target.currentHealth <= 0) {
                target.currentHealth = 0;
                target.isDead = true;
                logCombat(`${target.name} fainted!`);
                const sidePrefix = target.side === 'player' ? 'p' : 'e';
                const list = target.side === 'player' ? combatState.players : combatState.enemies;
                const index = list.indexOf(target);
                const targetSlot = document.getElementById(`${sidePrefix}-slot-${index}`);
                if (targetSlot) targetSlot.classList.add('dead');
            } else {
                logCombat(`${user.name} hits ${target.name} for ${dmg} damage!`);
                if (isSuper) {
                    spawnStatusPopup(target, 'Super Effective!', true, '#00ff00');
                } else if (isNotEffective) {
                    spawnStatusPopup(target, 'Not Effective...', false, '#cccccc');
                }
            }

            // Set cooldown on execution
            if (this.cooldown > 0) {
                if (!user.cooldowns) user.cooldowns = {};
                user.cooldowns[this.name] = this.cooldown + 1; // +1 because start of next turn will decrement it
            }
        }
        return true;
    }
}

class ClawAbility extends Ability {
    constructor() {
        super('Claw 1', 2, 4, 'FIRE', 'Deals damage to one opponent for a very small mana price.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        // Apply Quick Claw specialization: Claw deals +2 damage
        if (user.specializations && user.specializations.quick_claw > 0) {
            baseDmg += 2;
        }
        
        let variance = Math.random() * 0.1 + 0.95; // 0.95 to 1.05
        let multiplier = 1;
        let isSuper = false;
        let isNotEffective = false;

        const matchup = elementalMatchups[this.element] || { strong: [], weak: [] };
        if (matchup.strong.includes(target.element)) {
            multiplier = Math.random() * 0.3 + 1.6;
            isSuper = true;
        } else if (matchup.weak.includes(target.element)) {
            multiplier = 0.5;
            isNotEffective = true;
        }

        let dmg = Math.floor(baseDmg * variance * multiplier);
        
        // Critical hit check from Swift Strike (10% crit chance per rank, 1.5x damage)
        if (user.specializations && user.specializations.swift_strike > 0) {
            const critChance = 0.10 * user.specializations.swift_strike;
            if (Math.random() < critChance) {
                dmg = Math.floor(dmg * 1.5);
                logCombat(`Critical Hit!`);
            }
        }
        
        return { dmg, isSuper, isNotEffective };
    }
}

class RoarAbility extends Ability {
    constructor() {
        super('Roar 1', 3, 0, 'NORMAL', 'Scares opponent making them deal less damage the entire game by 10%.', 'single_enemy');
    }

    execute(user, target) {
        if (user.energy < this.cost) {
            logCombat(`${user.name} doesn't have enough energy!`);
            return false;
        }

        user.energy -= this.cost;
        logCombat(`${user.name} used ${this.name}!`);

        if (target) {
            // Apply Roar mechanic: lower target's attack by 10% (15% if Shield Roar is active)
            const oldAttack = target.attack;
            const reduction = (user.specializations && user.specializations.shield_roar > 0) ? 0.85 : 0.90;
            const reducedAttack = Math.floor(target.attack * reduction);
            const actualReduction = target.attack - reducedAttack;
            target.attack = Math.max(1, actualReduction < 1 ? target.attack - 1 : reducedAttack);
            logCombat(`${target.name}'s Attack fell from ${oldAttack} to ${target.attack}!`);
            
            // Spawn animation over target
            const sidePrefix = target.side === 'player' ? 'p' : 'e';
            const list = target.side === 'player' ? combatState.players : combatState.enemies;
            const index = list.indexOf(target);
            const targetSlot = document.getElementById(`${sidePrefix}-slot-${index}`);
            if (targetSlot) {
                targetSlot.classList.add('targeted'); // Highlight slot
                
                const anim = document.createElement('img');
                anim.style.position = 'absolute';
                anim.style.top = '50%';
                anim.style.left = '50%';
                anim.style.transform = 'translate(-50%, -50%)';
                anim.style.width = '350px';
                anim.style.height = '350px';
                anim.style.objectFit = 'contain';
                anim.style.zIndex = '100';
                anim.style.pointerEvents = 'none';
                anim.style.filter = 'drop-shadow(0 0 20px rgba(241, 196, 15, 0.5))';
                targetSlot.appendChild(anim);
                
                let frame = 1;
                anim.src = `assets/abilities/Roar 1/effect/frame${frame}.png`;
                
                const interval = setInterval(() => {
                    frame++;
                    if (frame > 4) {
                        clearInterval(interval);
                        anim.remove();
                        targetSlot.classList.remove('targeted');
                        spawnStatusPopup(target, 'Attack ⬇️', false);
                    } else {
                        anim.src = `assets/abilities/Roar 1/effect/frame${frame}.png`;
                    }
                }, 200);
            }

            // Play sound
            const audio = new Audio('assets/sound/roar.mp3');
            audio.play().catch(e => console.log('Waiting for roar.mp3 to be added'));
        }
        return true;
    }
}

class TigerBiteAbility extends Ability {
    constructor() {
        super('TigerBite 1', 9, 6, 'NORMAL', 'Deals damage and regenerates 30% of damage dealt.', 'single_enemy', 2);
    }

    execute(user, target) {
        if (user.energy < this.cost) {
            logCombat(`${user.name} doesn't have enough energy!`);
            return false;
        }

        // Cooldown check
        if (user.cooldowns && user.cooldowns[this.name] > 0) {
            logCombat(`${this.name} is on cooldown for ${user.cooldowns[this.name]} more turn(s)!`);
            return false;
        }

        user.energy -= this.cost;
        logCombat(`${user.name} used TigerBite!`);

        if (target) {
            const { dmg, isSuper, isNotEffective } = this.calculateDamage(user, target);
            target.currentHealth -= dmg;
            
            if (target.currentHealth <= 0) {
                target.currentHealth = 0;
                target.isDead = true;
                logCombat(`${target.name} fainted!`);
                const sidePrefix = target.side === 'player' ? 'p' : 'e';
                const list = target.side === 'player' ? combatState.players : combatState.enemies;
                const index = list.indexOf(target);
                const targetSlot = document.getElementById(`${sidePrefix}-slot-${index}`);
                if (targetSlot) targetSlot.classList.add('dead');
            } else {
                logCombat(`${user.name} hits ${target.name} for ${dmg} damage!`);
                if (isSuper) {
                    spawnStatusPopup(target, 'Super Effective!', true, '#00ff00');
                } else if (isNotEffective) {
                    spawnStatusPopup(target, 'Not Effective...', false, '#cccccc');
                }
            }

            // Heal user 30% of damage dealt (40% if Fierce Bite is active)
            const healPercent = (user.specializations && user.specializations.fierce_bite > 0) ? 0.4 : 0.3;
            const healAmt = Math.floor(dmg * healPercent);
            if (healAmt > 0) {
                user.currentHealth = Math.min(user.maxHealth, user.currentHealth + healAmt);
                logCombat(`${user.name} recovered ${healAmt} HP from TigerBite!`);
                spawnStatusPopup(user, `HP +${healAmt}`, true, '#00ff00');
            }

            // Set cooldown
            if (!user.cooldowns) user.cooldowns = {};
            user.cooldowns[this.name] = this.cooldown + 1; // +1 because start of next turn will decrement it
        }
        return true;
    }
}

class BiteAbility extends Ability {
    constructor() {
        super('Bite', 0, 0, 'NORMAL', 'Basic bite attack.', 'single_enemy');
    }
}

class Claw1Ability extends ClawAbility {
    constructor() {
        super();
        this.name = 'Claw1';
        this.cost = 2;
        this.damage = 4;
        this.desc = 'Deals fire damage to one opponent.';
    }
}

class Claw2Ability extends ClawAbility {
    constructor() {
        super();
        this.name = 'Claw2';
        this.cost = 3;
        this.damage = 7;
        this.desc = 'An upgraded version of Claw. Deals more fire damage.';
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.quick_claw > 0) {
            baseDmg += 2;
        }
        if (user.specializations && user.specializations.claw_2 > 1) {
            baseDmg += (user.specializations.claw_2 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class Claw1SpaceAbility extends ClawAbility {
    constructor() {
        super();
        this.name = 'Claw 1';
        this.cost = 2;
        this.damage = 4;
        this.desc = 'Deals fire damage to one opponent.';
    }
}

class Claw2SpaceAbility extends ClawAbility {
    constructor() {
        super();
        this.name = 'Claw 2';
        this.cost = 3;
        this.damage = 7;
        this.desc = 'An upgraded version of Claw. Deals more fire damage.';
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.quick_claw > 0) {
            baseDmg += 2;
        }
        if (user.specializations && user.specializations.claw_2 > 1) {
            baseDmg += (user.specializations.claw_2 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class Punch1Ability extends Ability {
    constructor() {
        super('Punch 1', 3, 5, 'FIRE', 'A quick punch that deals moderate fire damage.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.punch_1 > 1) {
            baseDmg += (user.specializations.punch_1 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class Punch2Ability extends Ability {
    constructor() {
        super('Punch 2', 5, 9, 'FIRE', 'A heavy fire punch that deals massive damage.', 'single_enemy');
    }
}

class Tackle1Ability extends Ability {
    constructor() {
        super('Tackle 1', 2, 4, 'NORMAL', 'Tackles the opponent for physical damage.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.tackle_1 > 1) {
            baseDmg += (user.specializations.tackle_1 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class Tackle2Ability extends Ability {
    constructor() {
        super('Tackle 2', 4, 8, 'NORMAL', 'A heavy charge that slams the opponent.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.tackle_2 > 1) {
            baseDmg += (user.specializations.tackle_2 - 1) * 3;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class PaperPlane1Ability extends Ability {
    constructor() {
        super('Paper Plane 1', 3, 5, 'FLYING', 'Throws a fast paper plane at the target.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.paper_plane_1 > 1) {
            baseDmg += (user.specializations.paper_plane_1 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class PaperPlane2Ability extends Ability {
    constructor() {
        super('Paper Plane 2', 5, 9, 'FLYING', 'Launches a swarm of planes dealing massive FLYING damage.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.paper_plane_2 > 1) {
            baseDmg += (user.specializations.paper_plane_2 - 1) * 3;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class JaguarDash1Ability extends Ability {
    constructor() {
        super('Jaguar Dash 1', 4, 6, 'NORMAL', 'Dashes forward striking the enemy swiftly.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.jaguar_dash_1 > 1) {
            baseDmg += (user.specializations.jaguar_dash_1 - 1) * 2;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class JaguarDash2Ability extends Ability {
    constructor() {
        super('Jaguar Dash 2', 6, 10, 'NORMAL', 'A supersonic strike dealing extreme physical damage.', 'single_enemy');
    }

    calculateDamage(user, target) {
        let baseDmg = user.attack + this.damage;
        if (user.specializations && user.specializations.jaguar_dash_2 > 1) {
            baseDmg += (user.specializations.jaguar_dash_2 - 1) * 3;
        }
        return super.calculateDamage(user, target, baseDmg);
    }
}

class Roar2Ability extends Ability {
    constructor() {
        super('Roar 2', 4, 2, 'NORMAL', 'A terrifying roar that reduces target damage by 20% and deals 2 damage.', 'single_enemy');
    }

    execute(user, target) {
        if (user.energy < this.cost) {
            logCombat(`${user.name} doesn't have enough energy!`);
            return false;
        }

        user.energy -= this.cost;
        logCombat(`${user.name} used Roar 2!`);

        if (target) {
            const oldAttack = target.attack;
            target.attack = Math.max(1, Math.round(target.attack * 0.80));
            logCombat(`${target.name}'s Attack fell from ${oldAttack} to ${target.attack}!`);
            
            let { dmg } = this.calculateDamage(user, target);
            target.currentHealth -= dmg;
            if (target.currentHealth <= 0) {
                target.currentHealth = 0;
                target.isDead = true;
                logCombat(`${target.name} fainted!`);
                const sidePrefix = target.side === 'player' ? 'p' : 'e';
                const list = target.side === 'player' ? combatState.players : combatState.enemies;
                const index = list.indexOf(target);
                const targetSlot = document.getElementById(`${sidePrefix}-slot-${index}`);
                if (targetSlot) targetSlot.classList.add('dead');
            } else {
                logCombat(`${user.name} hits ${target.name} for ${dmg} damage!`);
            }
            
            const sidePrefix = target.side === 'player' ? 'p' : 'e';
            const list = target.side === 'player' ? combatState.players : combatState.enemies;
            const index = list.indexOf(target);
            const targetSlot = document.getElementById(`${sidePrefix}-slot-${index}`);
            if (targetSlot) {
                targetSlot.classList.add('targeted');
                
                const anim = document.createElement('img');
                anim.style.position = 'absolute';
                anim.style.top = '50%';
                anim.style.left = '50%';
                anim.style.transform = 'translate(-50%, -50%)';
                anim.style.width = '350px';
                anim.style.height = '350px';
                anim.style.objectFit = 'contain';
                anim.style.zIndex = '100';
                anim.style.pointerEvents = 'none';
                anim.style.filter = 'drop-shadow(0 0 20px rgba(231, 76, 60, 0.8))';
                targetSlot.appendChild(anim);
                
                let frame = 1;
                anim.src = `assets/abilities/Roar 1/effect/frame${frame}.png`;
                
                const interval = setInterval(() => {
                    frame++;
                    if (frame > 4) {
                        clearInterval(interval);
                        anim.remove();
                        targetSlot.classList.remove('targeted');
                        spawnStatusPopup(target, 'Attack ⬇️⬇️', false, '#ff3333');
                    } else {
                        anim.src = `assets/abilities/Roar 1/effect/frame${frame}.png`;
                    }
                }, 200);
            }

            const audio = new Audio('assets/sound/roar.mp3');
            audio.play().catch(e => console.log('Waiting for roar.mp3 to be added'));
        }
        return true;
    }
}

const AbilityRegistry = {
    'Claw': new ClawAbility(),
    'Claw1': new Claw1Ability(),
    'Claw2': new Claw2Ability(),
    'Claw 1': new Claw1SpaceAbility(),
    'Claw 2': new Claw2SpaceAbility(),
    'Roar': new RoarAbility(),
    'Roar 1': new RoarAbility(),
    'Roar 2': new Roar2Ability(),
    'roar_2': new Roar2Ability(),
    'TigerBite': new TigerBiteAbility(),
    'TigerBite 1': new TigerBiteAbility(),
    'Bite': new BiteAbility(),
    'Punch 1': new Punch1Ability(),
    'punch_1': new Punch1Ability(),
    'Punch 2': new Punch2Ability(),
    'punch_2': new Punch2Ability(),
    'Tackle 1': new Tackle1Ability(),
    'tackle_1': new Tackle1Ability(),
    'Tackle 2': new Tackle2Ability(),
    'tackle_2': new Tackle2Ability(),
    'Paper Plane 1': new PaperPlane1Ability(),
    'paper_plane_1': new PaperPlane1Ability(),
    'Paper Plane 2': new PaperPlane2Ability(),
    'paper_plane_2': new PaperPlane2Ability(),
    'Jaguar Dash 1': new JaguarDash1Ability(),
    'jaguar_dash_1': new JaguarDash1Ability(),
    'Jaguar Dash 2': new JaguarDash2Ability(),
    'jaguar_dash_2': new JaguarDash2Ability()
};
