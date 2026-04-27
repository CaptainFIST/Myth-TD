import PlayerManager from '../managers/PlayerManager.js';
export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    static level = 2;  

    static mapData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,3],
        [0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    static decoData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    // Wave format: array of [enemyIndex, count] pairs per wave
    // 0: Oni, 1: Yokai, 2: Skeleton, 3: Orc, 4: Firespawn, 5: Plent, 6: CurseWanderer, 7: Slime
    static waveData = [
        { enemies: [{ type: 0, count: 2 }] },
        { enemies: [{ type: 1, count: 3 }] },
        { enemies: [{ type: 2, count: 2 }, { type: 0, count: 2 }] },
        { enemies: [{ type: 0, count: 3 }, { type: 1, count: 2 }] },
        { enemies: [{ type: 2, count: 3 }, { type: 1, count: 3 }] },
        { enemies: [{ type: 1, count: 4 }, { type: 0, count: 2 }] },
        { enemies: [{ type: 2, count: 3 }, { type: 0, count: 3 }, { type: 1, count: 1 }] },
        { enemies: [{ type: 0, count: 4 }, { type: 1, count: 4 }] }
    ];

    static tileTypes = {
        0: 'snow',   
        1: 'path',   
        2: 'path',   
        3: 'path'    
    };

    static decoTypes = {
        2: 'rock'   
    };

    preload() {
        this.load.image('snow', 'assets/tiles/level2/snow.png');
        this.load.image('path', 'assets/tiles/level2/snow_path.png');
        this.load.image('rock', 'assets/decorations/level2/snowy_rock.png');
    }

    // Initialize the level when scene starts
    create() {
        this.scene.launch('MapManager', { level: Level2 });

        // Create player instance and initialize inventory
        this.player = new PlayerManager({ sceneL: this });
        this.inventory = [];  

        // Launch UIManager scene which handles all UI and game logic
        this.scene.launch('UIManager', {
            player: this.player,
            inventory: this.inventory,
            sceneL: this,           
            levelId: 2              
        });
    }

    // Handle level completion or failure
    closeLevel(reason, time) {
        this.scene.stop('MapManager');  // Stop map rendering
        this.scene.stop('UIManager');   // Stop UI and game logic

        // Determine outcome and transition to appropriate scene
        if (reason === 'return') {
            this.scene.start('MainMenu');
        } else if (reason === 'win') {
            this.scene.start('WinScreen', {
                levelId: 2,
                passTime: time
            });
        } else if (reason === 'lose') {
            this.scene.start('LoseScreen', {
                levelId: 2,
                passTime: time
            });
        }
    }
}