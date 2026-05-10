import PlayerManager from '../managers/PlayerManager.js';
import AudioManager from '../managers/AudioManager.js';
import SaveManager from '../managers/SaveManager.js';

export default class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3' });
    }

    static level = 3;
    static showDebugGrid = false;
    static showDebugPaths = false;

    static mapData = [
        [0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
        [3,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0],
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

    // Wave format: one object per wave with enemy groups.
    // Each enemy group can specify type, count, and spawnPoint.
    // Enemy types: 0=Oni, 1=Yokai, 2=Skeleton, 3=Orc, 4=Firespawn, 5=Plent, 6=CurseWanderer, 7=Slime
    static waveData = [
        { enemies: [{ type: 0, count: 12, spawnPoint: 2 }, { type: 1, count: 6, spawnPoint: 4 }, { type: 3, count: 6, spawnPoint: 5 }] },
        { enemies: [{ type: 1, count: 16, spawnPoint: 4 }, { type: 4, count: 8, spawnPoint: 5 }] },
        { enemies: [{ type: 2, count: 15, spawnPoint: 2 }, { type: 1, count: 8, spawnPoint: 5 }] },
        { enemies: [{ type: 0, count: 6, spawnPoint: 4 }, { type: 3, count: 8, spawnPoint: 2 }, { type: 2, count: 6, spawnPoint: 5 }] },
        { enemies: [{ type: 5, count: 10, spawnPoint: 5 }, { type: 6, count: 2, spawnPoint: 4 }] },
        { enemies: [{ type: 0, count: 15, spawnPoint: 2 }, { type: 2, count: 6, spawnPoint: 4 }, { type: 1, count: 5, spawnPoint: 5 }] },
        { enemies: [{ type: 2, count: 8, spawnPoint: 5 }, { type: 7, count: 9, spawnPoint: 2 }] },
        { enemies: [{ type: 4, count: 14, spawnPoint: 4 }, { type: 5, count: 12, spawnPoint: 5 }, { type: 2, count: 5, spawnPoint: 2 }] },
        { enemies: [{ type: 5, count: 10, spawnPoint: 5 }, { type: 6, count: 16, spawnPoint: 4 }, { type: 7, count: 8, spawnPoint: 2 }] },
        { enemies: [{ type: 4, count: 18, spawnPoint: 4 }, { type: 1, count: 14, spawnPoint: 5 }, { type: 2, count: 6, spawnPoint: 2 }] },
        { enemies: [{ type: 3, count: 16, spawnPoint: 2 }, { type: 7, count: 10, spawnPoint: 4 }, { type: 4, count: 14, spawnPoint: 5 }] },
        { enemies: [{ type: 5, count: 20, spawnPoint: 2 }, { type: 3, count: 15, spawnPoint: 4 }, { type: 2, count: 16, spawnPoint: 5 },
            { type: 0, count: 20, spawnPoint: 2 }, { type: 6, count: 18, spawnPoint: 4 }, { type: 3, count: 10, spawnPoint: 5 }] },
    ];

    static tileTypes = {
        0: 'volcanic',
        1: 'vPath',
        2: 'vPath',
        3: 'vPath',
        4: 'vPath',
        5: 'vPath'
    };

    static decoTypes = {
        2: 'plume'
    };

    preload() {
        this.load.image('volcanic', 'assets/tiles/level3/volcano2.png');
        this.load.image('vPath', 'assets/tiles/level3/volcanic_path.png');
        this.load.image('plume', 'assets/decorations/level3/lava_plume.png');
        this.load.image('SpawnPoint', 'assets/Tower Placement/SpawnPoint.png');
        
        this.audioManager = new AudioManager(this);
        this.audioManager.preloadAudio();

        // Restore audio settings from saved slot
        const volume = SaveManager.getVolumeForSlot();
        const isMuted = SaveManager.getMuteForSlot();
        this.audioManager.setVolume(volume);
        this.audioManager.setMute(isMuted);
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

    shutdown() {
        // Save audio settings when leaving the level
        if (this.audioManager) {
            SaveManager.setVolumeForSlot(this.audioManager.getVolume());
            SaveManager.setMuteForSlot(this.audioManager.isMutedState());
        }
    }
}