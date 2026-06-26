// Game Databases & Global State
const MINION_DB = {
    'Tigrier': {
        stats: {
            HEALTH: { value: 10, primary: false },
            ENERGY: { value: 15, primary: false },
            ATTACK: { value: 3, primary: true }, // !ATACK means ATTACK is primary
            HEALING: { value: 2, primary: false },
            SPEED: { value: 15, primary: false }
        },
        element: 'NORMAL'
    }
};

const ABILITY_DB = {
    'Claw': {
        name: 'Claw',
        cost: 2,
        damage: 4,
        element: 'FIRE',
        desc: 'Deals damage to one opponent for a very small mana price.',
        color: '#e0cca8',
        targetType: 'single_enemy'
    },
    'Claw1': {
        name: 'Claw1',
        cost: 2,
        damage: 4,
        element: 'FIRE',
        desc: 'Deals fire damage to one opponent.',
        color: '#e0cca8',
        targetType: 'single_enemy'
    },
    'Claw2': {
        name: 'Claw2',
        cost: 3,
        damage: 7,
        element: 'FIRE',
        desc: 'An upgraded version of Claw. Deals more fire damage.',
        color: '#d35400',
        targetType: 'single_enemy'
    },
    'Claw 1': {
        name: 'Claw 1',
        cost: 2,
        damage: 4,
        element: 'FIRE',
        desc: 'Deals fire damage to one opponent.',
        color: '#e0cca8',
        targetType: 'single_enemy'
    },
    'Claw 2': {
        name: 'Claw 2',
        cost: 3,
        damage: 7,
        element: 'FIRE',
        desc: 'An upgraded version of Claw. Deals more fire damage.',
        color: '#d35400',
        targetType: 'single_enemy'
    },
    'Roar': {
        name: 'Roar',
        cost: 3,
        damage: 0,
        element: 'NORMAL',
        desc: 'Scares opponent making them deal less damage the entire game by 10%.',
        color: '#f1c40f',
        targetType: 'single_enemy'
    },
    'TigerBite': {
        name: 'TigerBite',
        cost: 9,
        damage: 6,
        element: 'NORMAL',
        desc: 'Deals damage and regenerates 30% of damage dealt.',
        color: '#d35400',
        targetType: 'single_enemy',
        cooldown: 2
    },
    'Bite': {
        name: 'Bite',
        cost: 0,
        damage: 0,
        element: 'NORMAL',
        desc: 'Basic bite attack.',
        color: '#cccccc',
        targetType: 'single_enemy'
    }
};

const elementalMatchups = {
    'NORMAL': { strong: ['HOLY'], weak: ['UNDEAD', 'DEMONIC'] },
    'FLYING': { strong: ['PLANT', 'WATER', 'FIRE'], weak: ['EARTH', 'ELECTRIC'] },
    'PLANT': { strong: ['WATER', 'EARTH', 'UNDEAD'], weak: ['FLYING', 'ICE', 'FIRE', 'DINO', 'DEMONIC'] },
    'WATER': { strong: ['EARTH', 'FIRE', 'ELECTRIC', 'ROBOT', 'DEMONIC'], weak: ['ELECTRIC', 'ICE', 'PLANT', 'FLYING'] },
    'EARTH': { strong: ['FLYING', 'FIRE', 'DINO', 'ICE'], weak: ['PLANT', 'WATER', 'UNDEAD', 'METAL'] },
    'FIRE': { strong: ['PLANT', 'ELECTRIC', 'ROBOT', 'UNDEAD', 'ICE'], weak: ['WATER', 'EARTH', 'HOLY', 'FLYING'] },
    'ELECTRIC': { strong: ['FLYING', 'WATER', 'ROBOT'], weak: ['WATER', 'DINO', 'FIRE', 'UNDEAD'] },
    'ROBOT': { strong: [], weak: ['WATER', 'FIRE', 'ELECTRIC', 'DINO'] },
    'DINO': { strong: ['PLANT', 'ELECTRIC', 'ROBOT'], weak: ['EARTH', 'ICE'] },
    'UNDEAD': { strong: ['NORMAL', 'EARTH', 'ELECTRIC'], weak: ['PLANT', 'HOLY', 'FIRE', 'LIGHT', 'DARK'] },
    'DEMONIC': { strong: ['NORMAL', 'PLANT', 'HOLY'], weak: ['HOLY', 'WATER'] },
    'HOLY': { strong: ['FIRE', 'UNDEAD', 'DEMONIC'], weak: ['NORMAL', 'DEMONIC'] },
    'ICE': { strong: ['PLANT', 'WATER', 'DINO'], weak: ['METAL', 'EARTH', 'FIRE', 'STONE'] },
    'TITAN': { strong: [], weak: [] },
    'METAL': { strong: ['EARTH', 'ICE'], weak: [] },
    'LIGHT': { strong: ['UNDEAD'], weak: [] },
    'DARK': { strong: ['UNDEAD'], weak: [] },
    'STONE': { strong: ['ICE'], weak: [] }
};

const availableMinions = ['Tigrier'];

const state = {
    collection: [
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 }
    ],
    army: [
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 },
        { name: 'Tigrier', level: 1, xp: 0, skillPoints: 0 }
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

let combatState = {
    enemies: [],
    players: [],
    turnQueue: [],
    currentTurnIndex: 0,
    isBoss: false,
    currentFloor: 1,
    currentRoom: 1,
    state: 'INIT', // INIT, WAITING, ANIMATING, END
    selectedAbility: null,
    activePlayer: null
};

let saves = {
    1: null,
    2: null,
    3: null
};

let currentSlot = null;
let currentGender = null;

const MINION_SKILL_TREES = {
    'Tigrier': {
        specializations: ['Speed', 'Guard', 'Normal'],
        trees: {
            'Speed': [
                [
                    { id: 'haste', name: 'Haste', max: 3 },
                    { id: 'swift_strike', name: 'Swift Strike', max: 2 },
                    { id: 'quick_claw', name: 'Quick Claw', max: 1 }
                ],
                [],
                []
            ],
            'Guard': [
                [
                    { id: 'iron_defense', name: 'Iron Defense', max: 3 },
                    { id: 'sturdy', name: 'Sturdy', max: 2 },
                    { id: 'shield_roar', name: 'Shield Roar', max: 1 }
                ],
                [],
                []
            ],
            'Normal': [
                [
                    { id: 'power_up', name: 'Power Up', max: 3 },
                    { id: 'heal_boost', name: 'Heal Boost', max: 3 },
                    { id: 'fierce_bite', name: 'Fierce Bite', max: 1 }
                ],
                [],
                []
            ]
        }
    }
};

const SKILL_DB = {
    'Haste': {
        icon: '⚡',
        ranks: {
            1: { desc: 'Increases Speed stat by +3.', statsBonus: { speed: 3 } },
            2: { desc: 'Increases Speed stat by +6.', statsBonus: { speed: 6 } },
            3: { desc: 'Increases Speed stat by +9.', statsBonus: { speed: 9 } }
        }
    },
    'Swift Strike': {
        icon: '🦷',
        ranks: {
            1: { desc: 'Increases Critical Hit chance by 10%.' },
            2: { desc: 'Increases Critical Hit chance by 20%.' }
        }
    },
    'Quick Claw': {
        icon: '🐾',
        ranks: {
            1: { desc: 'Claw deals +2 damage.' }
        }
    },
    'Iron Defense': {
        icon: '🛡️',
        ranks: {
            1: { desc: 'Increases Max Health by +5.', statsBonus: { health: 5 } },
            2: { desc: 'Increases Max Health by +10.', statsBonus: { health: 10 } },
            3: { desc: 'Increases Max Health by +15.', statsBonus: { health: 15 } }
        }
    },
    'Sturdy': {
        icon: '🧱',
        ranks: {
            1: { desc: 'Reduces incoming damage by 1.' },
            2: { desc: 'Reduces incoming damage by 2.' }
        }
    },
    'Shield Roar': {
        icon: '🦁',
        ranks: {
            1: { desc: 'Roar reduces enemy attack by 15% instead of 10%.' }
        }
    },
    'Power Up': {
        icon: '⚔️',
        ranks: {
            1: { desc: 'Increases Attack stat by +1.', statsBonus: { attack: 1 } },
            2: { desc: 'Increases Attack stat by +2.', statsBonus: { attack: 2 } },
            3: { desc: 'Increases Attack stat by +3.', statsBonus: { attack: 3 } }
        }
    },
    'Heal Boost': {
        icon: '🩹',
        ranks: {
            1: { desc: 'Increases Healing stat by +1.', statsBonus: { healing: 1 } },
            2: { desc: 'Increases Healing stat by +2.', statsBonus: { healing: 2 } },
            3: { desc: 'Increases Healing stat by +3.', statsBonus: { healing: 3 } }
        }
    },
    'Fierce Bite': {
        icon: '🐯',
        ranks: {
            1: { desc: 'TigerBite heals 40% of damage dealt instead of 30%.' }
        }
    }
};

function getSkillProperties(name, rank) {
    const defaultProps = {
        name: name,
        icon: '🔮',
        desc: `No description for ${name} Rank ${rank}`,
        statsBonus: {}
    };
    
    if (!name) return defaultProps;
    
    const skillData = SKILL_DB[name];
    if (!skillData) {
        return defaultProps;
    }
    
    const rankData = skillData.ranks ? skillData.ranks[rank] : null;
    const firstRankData = skillData.ranks ? skillData.ranks[1] : null;
    
    return {
        name: name,
        icon: skillData.icon || (rankData && rankData.icon) || (firstRankData && firstRankData.icon) || '🔮',
        desc: (rankData && rankData.desc) || (firstRankData && firstRankData.desc) || `Description for ${name} Rank ${rank}`,
        statsBonus: (rankData && rankData.statsBonus) || {}
    };
}

function getMinionSkillTrees(name) {
    const cleanName = name ? name.replace(/^Boss\s+/, '') : '';
    return MINION_SKILL_TREES[cleanName] || MINION_SKILL_TREES['Tigrier'];
}

let activeSkillMinion = null;
let activeSkillTab = 'Speed';
