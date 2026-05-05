import PlayerManager from '../managers/PlayerManager.js';
import AudioManager from '../managers/AudioManager.js';

export default class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3' });
    }

    static level = 3;

    static mapData = [
        [0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
        [3,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    static decoData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
    ];

    static waveData = [
        { enemies: [{ type: 0, count: 5 }, { type: 1, count: 3 }, {type: 3, count: 2}] },
        { enemies: [{ type: 1, count: 4 }, { type: 4, count: 6 }] },
        { enemies: [{ type: 2, count: 5 }, { type: 1, count: 5 }] },
        { enemies: [{ type: 0, count: 2 }, { type: 1, count: 2 }, { type: 2, count: 2 }] },
        { enemies: [{ type: 5, count: 3 }, { type: 6, count: 2 }] },
        { enemies: [{ type: 0, count: 7 }, { type: 2, count: 5 }, { type: 1, count: 1 }] },
        { enemies: [{ type: 2, count: 4 }, { type: 7, count: 5 }] },
        { enemies: [{ type: 4, count: 10 }, { type: 1, count: 10 }, { type: 2, count: 5 }, ] }, 
    ];

    static tileTypes = {
        0: 'volcanic',
        1: 'vPath',
        2: 'vPath',
        3: 'vPath'
    };

    static decoTypes = {
        2: 'plume'
    };

    preload() {
        this.load.image('volcanic', 'assets/tiles/level3/volcano2.png');
        this.load.image('vPath', 'assets/tiles/level3/volcanic_path.png');
        this.load.image('plume', 'assets/decorations/level3/lava_plume.png');
        
        this.audioManager = new AudioManager(this);
        this.audioManager.preloadAudio();
    }
    
    // Initialize the level when scene starts
    create() {
        this.scene.launch('MapManager', { level: Level3 });

        this.player = new PlayerManager({ sceneL: this, audioManager: this.audioManager });
        this.inventory = [];

        this.scene.launch('UIManager', {
            player: this.player,
            inventory: this.inventory,
            sceneL: this,
            levelId: 3
        });
    }

    closeLevel(reason, time, gainGold, spentGold, playerHealth) {
        this.scene.stop('MapManager');
        this.scene.stop('UIManager');

        if (reason === 'return') {
            this.scene.start('MainMenu');
        } else if (reason === 'win') {
            this.scene.start('WinScreen', {
                levelId: 3,
                passTime: time,
                gainGold: gainGold,
                spentGold: spentGold,
                playerHealth: playerHealth
            });
        } else if (reason === 'lose') {
            this.scene.start('LoseScreen', {
                levelId: 3,
                passTime: time,
                gainGold: gainGold,
                spentGold: spentGold,
                playerHealth: playerHealth
            });
        }
    }
}