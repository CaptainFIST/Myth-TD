<<<<<<< HEAD
import { mapData, decoData } from '../managers/MapManager.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    this.load.image('grass', 'assets/tiles/grass_new.png');
    this.load.image('path', 'assets/tiles/dirt_path.png');
    this.load.image('tree', 'assets/decorations/tree1.png');
  }
  create() {
    const tileSize = 64;
    for (let row = 0; row < mapData.length; row++) {
        for (let col = 0; col < mapData[row].length; col++) {

            let tileType = mapData[row][col];
            let decoType = decoData[row][col];
            let x = col * tileSize;
            let y = row * tileSize;

            if (tileType === 0) {
                this.add.image(x, y, 'grass').setOrigin(0);
                if (decoType === 2) {
                  this.add.image(x, y, 'tree').setOrigin(0.5);
                }
            } else if (tileType === 1) {
                this.add.image(x, y, 'path').setOrigin(0);
            }
        }
=======
import TimeManager from '../managers/TimeManager.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }
    
    static mapData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    static decoData = [
    [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    static tileTypes = {
        0: 'grass',
        1: 'path'
    };

    static decoTypes = {
        2: 'tree'
    };
    
    preload() {
        this.load.image('grass', 'assets/tiles/level1/grass_new.png');
        this.load.image('path', 'assets/tiles/level1/dirt_path.png');
        this.load.image('tree', 'assets/decorations/tree1.png');
    }

    create() {
        this.scene.launch('MapManager', { level: this.constructor });
        this.scene.launch('UIManager');
        this.timeManager = new TimeManager();

        this.timerText = this.add.text(16, 16, 'Time: 0.00s', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setDepth(10);
    }

    update(time, delta) {
        this.timeManager.update(delta);
        const elapsedTime = this.timeManager.getTime().toFixed(2);
        this.timerText.setText(`Time: ${elapsedTime}s`);
>>>>>>> 4e25e2fc37588c7ab2d247af757f5a90534c52a3
    }
}