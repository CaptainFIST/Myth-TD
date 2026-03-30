import { mapData, decoData } from '../managers/MapManager.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    // Object 0
    this.load.image('grass', 'assets/tiles/grass_new.png');
    // Object 1
    this.load.image('path', 'assets/tiles/dirt_path.png');
    // Object 2
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
    }
  }
}