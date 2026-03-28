import { mapData } from '../managers/MapManager.js';





export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    this.load.image('grass_new', 'assets/tiles/grass_new.png');
    this.load.image('stone_horizontal','assets/tiles/stone_horizontal.png');
    this.load.image('stone_vertical','assets/tiles/stone_vertical.png');
    this.load.image('corner_tl','assets/tiles/corner_tl.png');
    this.load.image('corner_tr','assets/tiles/corner_tr.png');
    this.load.image('corner_bl','assets/tiles/corner_bl.png');
    this.load.image('corner_br','assets/tiles/corner_br.png');
    this.load.image('dirt_path','assets/tiles/dirt_path.png');

  }
  create() {
    const tileSize = 64;
    for (let row = 0; row < mapData.length; row++) {
        for (let col = 0; col < mapData[row].length; col++) {

            let tileType = mapData[row][col];
            let x = col * tileSize;
            let y = row * tileSize;

            if (tileType === 0) {
                this.add.image(x, y, 'grass_new').setOrigin(0);
            } else if (tileType === 1) {
                this.add.image(x, y, 'dirt_path').setOrigin(0);
            }
        }
    }
  }
}