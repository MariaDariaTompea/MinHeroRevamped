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
    'Roar 1': {
        name: 'Roar 1',
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
    'TigerBite 1': {
        name: 'TigerBite 1',
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
    },
    'Punch 1': {
        name: 'Punch 1',
        cost: 3,
        damage: 5,
        element: 'FIRE',
        desc: 'A quick punch that deals moderate fire damage.',
        color: '#e67e22',
        targetType: 'single_enemy'
    },
    'punch_1': {
        name: 'Punch 1',
        cost: 3,
        damage: 5,
        element: 'FIRE',
        desc: 'A quick punch that deals moderate fire damage.',
        color: '#e67e22',
        targetType: 'single_enemy'
    },
    'Punch 2': {
        name: 'Punch 2',
        cost: 5,
        damage: 9,
        element: 'FIRE',
        desc: 'A heavy fire punch that deals massive damage.',
        color: '#e74c3c',
        targetType: 'single_enemy'
    },
    'punch_2': {
        name: 'Punch 2',
        cost: 5,
        damage: 9,
        element: 'FIRE',
        desc: 'A heavy fire punch that deals massive damage.',
        color: '#e74c3c',
        targetType: 'single_enemy'
    },
    'Tackle 1': {
        name: 'Tackle 1',
        cost: 2,
        damage: 4,
        element: 'NORMAL',
        desc: 'Tackles the opponent for physical damage.',
        color: '#95a5a6',
        targetType: 'single_enemy'
    },
    'tackle_1': {
        name: 'Tackle 1',
        cost: 2,
        damage: 4,
        element: 'NORMAL',
        desc: 'Tackles the opponent for physical damage.',
        color: '#95a5a6',
        targetType: 'single_enemy'
    },
    'Tackle 2': {
        name: 'Tackle 2',
        cost: 4,
        damage: 8,
        element: 'NORMAL',
        desc: 'A heavy charge that slams the opponent.',
        color: '#7f8c8d',
        targetType: 'single_enemy'
    },
    'tackle_2': {
        name: 'Tackle 2',
        cost: 4,
        damage: 8,
        element: 'NORMAL',
        desc: 'A heavy charge that slams the opponent.',
        color: '#7f8c8d',
        targetType: 'single_enemy'
    },
    'Paper Plane 1': {
        name: 'Paper Plane 1',
        cost: 3,
        damage: 5,
        element: 'FLYING',
        desc: 'Throws a fast paper plane at the target.',
        color: '#3498db',
        targetType: 'single_enemy'
    },
    'paper_plane_1': {
        name: 'Paper Plane 1',
        cost: 3,
        damage: 5,
        element: 'FLYING',
        desc: 'Throws a fast paper plane at the target.',
        color: '#3498db',
        targetType: 'single_enemy'
    },
    'Paper Plane 2': {
        name: 'Paper Plane 2',
        cost: 5,
        damage: 9,
        element: 'FLYING',
        desc: 'Launches a swarm of planes dealing massive FLYING damage.',
        color: '#2980b9',
        targetType: 'single_enemy'
    },
    'paper_plane_2': {
        name: 'Paper Plane 2',
        cost: 5,
        damage: 9,
        element: 'FLYING',
        desc: 'Launches a swarm of planes dealing massive FLYING damage.',
        color: '#2980b9',
        targetType: 'single_enemy'
    },
    'Jaguar Dash 1': {
        name: 'Jaguar Dash 1',
        cost: 4,
        damage: 6,
        element: 'NORMAL',
        desc: 'Dashes forward striking the enemy swiftly.',
        color: '#1abc9c',
        targetType: 'single_enemy'
    },
    'jaguar_dash_1': {
        name: 'Jaguar Dash 1',
        cost: 4,
        damage: 6,
        element: 'NORMAL',
        desc: 'Dashes forward striking the enemy swiftly.',
        color: '#1abc9c',
        targetType: 'single_enemy'
    },
    'Jaguar Dash 2': {
        name: 'Jaguar Dash 2',
        cost: 6,
        damage: 10,
        element: 'NORMAL',
        desc: 'A supersonic dash strike dealing extreme damage.',
        color: '#16a085',
        targetType: 'single_enemy'
    },
    'jaguar_dash_2': {
        name: 'Jaguar Dash 2',
        cost: 6,
        damage: 10,
        element: 'NORMAL',
        desc: 'A supersonic dash strike dealing extreme damage.',
        color: '#16a085',
        targetType: 'single_enemy'
    },
    'Roar 2': {
        name: 'Roar 2',
        cost: 4,
        damage: 2,
        element: 'NORMAL',
        desc: 'A terrifying roar that reduces target damage by 20% and deals 2 damage.',
        color: '#f39c12',
        targetType: 'single_enemy'
    },
    'roar_2': {
        name: 'Roar 2',
        cost: 4,
        damage: 2,
        element: 'NORMAL',
        desc: 'A terrifying roar that reduces target damage by 20% and deals 2 damage.',
        color: '#f39c12',
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

const availableMinions = ['Tigrier', 'Virid'];

// visual map database for levels (Floor_Room keys)
const LEVEL_MAPS = {
    // Default Map for Level 1-1
    "1_1": {
        "width": 50,
        "height": 30,
        "spawn": {
            "x": 12,
            "y": 4
        },
        "grid": [
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","spawn","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","teleport_head","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","npc1","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","wall","wall","wall","wall","wall","wall","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","teleport_tail","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","door_master","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","boss","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","teleport_tail","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","npc1","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","teleport_head","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","npc2","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","wall","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"],
            ["floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray","floor_gray"]
        ],
        "npcs": [
            {
                "id": "npc1",
                "x": 27,
                "y": 5,
                "dialogue": "Hello, adventurer! I am the Student A. Prepare to battle!"
            },
            {
                "id": "boss",
                "x": 19,
                "y": 13,
                "dialogue": "Hello, adventurer! I am the Boss. Prepare to battle!"
            },
            {
                "id": "npc1",
                "x": 31,
                "y": 17,
                "dialogue": "Hello, adventurer! I am the Student A. Prepare to battle!"
            },
            {
                "id": "npc2",
                "x": 15,
                "y": 24,
                "dialogue": "Hello, adventurer! I am the Student B. Prepare to battle!"
            }
        ],
        "doors": [
            {
                "x": 33,
                "y": 12,
                "width": 2,
                "height": 1,
                "open": false
            }
        ],
        "eggs": [],
        "teleports": [
            {
                "head": {
                    "x": 16,
                    "y": 5
                },
                "tail": {
                    "x": 26,
                    "y": 11
                }
            },
            {
                "head": {
                    "x": 23,
                    "y": 21
                },
                "tail": {
                    "x": 14,
                    "y": 16
                }
            }
        ]
    }
};

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
    },
    // New exploration state variables
    exploreActive: false,
    explorePlayerPos: { x: 0, y: 0 },
    exploreMap: null,
    exploreKeysCollected: 0,
    exploreKeysRequired: 3,
    exploreDefeatedNPCs: [], // list of unique NPC positions e.g., "x_y"
    exploreHatchedEggs: [] // list of egg coordinates e.g., "x_y"
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
                    { id: 'punch_1', name: 'Punch 1', max: 3 },
                    { id: 'punch_2', name: 'Punch 2', max: 1 },
                    { id: 'tackle_1', name: 'Tackle 1', max: 2 },
                    { id: 'tackle_2', name: 'Tackle 2', max: 2 }
                ],
                [
                    { id: 'claw_2', name: 'Claw 2', max: 3 },
                    { id: 'paper_plane_1', name: 'Paper Plane 1', max: 3 },
                    { id: 'paper_plane_2', name: 'Paper Plane 2', max: 3 }
                ],
                [
                    { id: 'roar_2', name: 'Roar 2', max: 1 },
                    { id: 'jaguar_dash_1', name: 'Jaguar Dash 1', max: 3 },
                    { id: 'jaguar_dash_2', name: 'Jaguar Dash 2', max: 2 }
                ]
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
    'Punch 1': {
        icon: '👊',
        ranks: {
            1: { desc: 'Unlocks Punch 1 ability: Deals FIRE damage.' },
            2: { desc: 'Increases Punch 1 base damage by +2.' },
            3: { desc: 'Increases Punch 1 base damage by +4.' }
        }
    },
    'Punch 2': {
        icon: '💥',
        ranks: {
            1: { desc: 'Unlocks Punch 2 ability: A crushing blow dealing massive FIRE damage.' }
        }
    },
    'Tackle 1': {
        icon: '🐗',
        ranks: {
            1: { desc: 'Unlocks Tackle 1 ability: Tackles the opponent for physical damage.' },
            2: { desc: 'Increases Tackle 1 base damage by +2.' }
        }
    },
    'Tackle 2': {
        icon: '🐂',
        ranks: {
            1: { desc: 'Unlocks Tackle 2 ability: A heavy slam dealing high physical damage.', statsBonus: {} },
            2: { desc: 'Increases Tackle 2 base damage by +3.' }
        }
    },
    'Claw 2': {
        icon: '⚔️',
        ranks: {
            1: { desc: 'Unlocks Claw 2 ability: Upgraded slash dealing FIRE damage.' },
            2: { desc: 'Increases Claw 2 base damage by +2.' },
            3: { desc: 'Increases Claw 2 base damage by +4.' }
        }
    },
    'Paper Plane 1': {
        icon: '✈️',
        ranks: {
            1: { desc: 'Unlocks Paper Plane 1 ability: Throws a paper plane dealing FLYING damage.' },
            2: { desc: 'Increases Paper Plane 1 base damage by +2.' },
            3: { desc: 'Increases Paper Plane 1 base damage by +4.' }
        }
    },
    'Paper Plane 2': {
        icon: '🛩️',
        ranks: {
            1: { desc: 'Unlocks Paper Plane 2 ability: Launches a swarm of planes dealing massive FLYING damage.' },
            2: { desc: 'Increases Paper Plane 2 base damage by +3.' },
            3: { desc: 'Increases Paper Plane 2 base damage by +6.' }
        }
    },
    'Roar 2': {
        icon: '📣',
        ranks: {
            1: { desc: 'Unlocks Roar 2 ability: Terrifying roar that reduces target damage by 20% and deals 2 damage.' }
        }
    },
    'Jaguar Dash 1': {
        icon: '🐆',
        ranks: {
            1: { desc: 'Unlocks Jaguar Dash 1 ability: A swift dash attack dealing physical damage.' },
            2: { desc: 'Increases Jaguar Dash 1 base damage by +2.' },
            3: { desc: 'Increases Jaguar Dash 1 base damage by +4.' }
        }
    },
    'Jaguar Dash 2': {
        icon: '⚡',
        ranks: {
            1: { desc: 'Unlocks Jaguar Dash 2 ability: A supersonic strike dealing extreme physical damage.' },
            2: { desc: 'Increases Jaguar Dash 2 base damage by +3.' }
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
