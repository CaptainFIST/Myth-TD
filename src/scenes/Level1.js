import PlayerManager from '../managers/PlayerManager.js';
import AudioManager from '../managers/AudioManager.js';
import SaveManager from '../managers/SaveManager.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    static level = 1;

    static mapData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,3],
        [0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,1,1,1,1,1,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    static decoData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,4,0,0,0,0,0,2,0,0,0,0,0,5,0,0,0,3,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],
        [0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,2,2,2],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0],
        [0,0,2,0,0,0,0,0,5,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
        [0,0,4,0,0,0,0,0,0,0,0,0,4,0,3,0,0,0,0,0,0,0,0,2,0,0,5,0,0],
        [0,0,0,0,0,4,2,0,0,5,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    // Wave format: one object per wave with enemy groups.
    // Each enemy group can specify type, count, and spawnPoint.
    // Enemy types: 0=Oni, 1=Yokai, 2=Skeleton, 3=Orc, 4=Firespawn, 5=Plent, 6=CurseWanderer, 7=Slime
    static waveData = [
        { enemies: [{ type: 0, count: 10 }, { type: 7, count: 6 }] },
        { enemies: [{ type: 1, count: 6 }, { type: 0, count: 8 }] },
        { enemies: [{ type: 2, count: 6 }, { type: 1, count: 6 }] },
        { enemies: [{ type: 0, count: 6 }, { type: 1, count: 6 }, { type: 2, count: 6 }] },
        { enemies: [{ type: 2, count: 10 }, { type: 1, count: 6 }] },
        { enemies: [{ type: 0, count: 10 }, { type: 2, count: 6 }, { type: 1, count: 4 }] },
        { enemies: [{ type: 2, count: 12 }, { type: 3, count: 6 }] },
        { enemies: [{ type: 4, count: 8 }, { type: 1, count: 8 }, { type: 2, count: 8 }, ] }, 
    ];

    static tileTypes = {
        0: 'grass',
        1: 'dPath',
        2: 'dPath',
        3: 'dPath'
    };

    static decoTypes = {
        2: 'tree',
        3: 'rock1',
        4: 'bush',
        5: 'bush2'
    };

    preload() {
        this.load.image('grass', 'assets/tiles/level1/grass_new.png');
        this.load.image('dPath', 'assets/tiles/level1/dirt_path.png');
        this.load.image('tree', 'assets/decorations/tree1.png');
        this.load.image('rock1', 'assets/decorations/rock1.png');
        this.load.image('bush', 'assets/decorations/Bush1.png');
        this.load.image('bush2', 'assets/decorations/Bush2.png');
        this.load.image('SpawnPoint', 'assets/Tower Placement/SpawnPoint.png');

        
        this.audioManager = new AudioManager(this);
        this.audioManager.preloadAudio();
        
        // Restore audio settings from saved state
        const volume = SaveManager.getVolumeForSlot();
        const isMuted = SaveManager.getMuteForSlot();
        this.audioManager.setVolume(volume);
        this.audioManager.setMute(isMuted);
    }
    
    // Initialize the level when scene starts
    create() {
        this.scene.launch('MapManager', { level: Level1 });

        this.player = new PlayerManager({ sceneL: this, audioManager: this.audioManager });
        this.inventory = [];

        this.scene.launch('UIManager', {
            player: this.player,
            inventory: this.inventory,
            sceneL: this,
            levelId: 1
        });
    }

    closeLevel(reason, time, gainGold, spentGold, playerHealth) {
        this.scene.stop('MapManager');
        this.scene.stop('UIManager');

        if (reason === 'return') {
            this.scene.start('MainMenu');
        } else if (reason === 'win') {
            this.scene.start('WinScreen', {
                levelId: 1,
                passTime: time,
                gainGold: gainGold,
                spentGold: spentGold,
                playerHealth: playerHealth
            });
        } else if (reason === 'lose') {
            this.scene.start('LoseScreen', {
                levelId: 1,
                passTime: time,
                gainGold: gainGold,
                spentGold: spentGold,
                playerHealth: playerHealth
            });
        }
    }

    shutdown() {
        // Save audio settings when leaving the level
        if (this.audioManager) {
            SaveManager.setVolumeForSlot(this.audioManager.getVolume());
            SaveManager.setMuteForSlot(this.audioManager.isMutedState());
        }
    }
}