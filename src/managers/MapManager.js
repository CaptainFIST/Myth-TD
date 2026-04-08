export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    create(data) {
        const level = data.level;
        const mapData = level.mapData;
        const decoData = level.decoData;
        const tileTypes = level.tileTypes;
        const decoTypes = level.decoTypes;

            const tileSize = this.tileSize || 64;        
            for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const tileKey = tileTypes[mapData[row][col]];
                const decoKey = decoTypes[decoData[row][col]];
                const x = col * tileSize;
                const y = row * tileSize;
                if (tileKey) {
                    this.add.image(x, y, tileKey).setOrigin(0);
                }
                if (decoKey) {
                    this.add.image(x, y, decoKey).setOrigin(0).setDepth(0.5);               
                }
            }
        }
    }
}