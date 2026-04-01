import PlayerManager from '../managers/PlayerManager.js';

export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    create(data) {
        this.player = new PlayerManager();

        this.testingPlayerMethods();
        this.testingPlayerMethods();

        const level = data.level;
        const mapData = level.mapData;
        const decoData = level.decoData;
        const tileTypes = level.tileTypes;
        const decoTypes = level.decoTypes;

        const tileSize = 64;
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
                    this.add.image(x, y, decoKey).setOrigin(0.5);
                }
            }
        }
    }

    testingPlayerMethods() {
        console.log(`player health is ${this.player.playerHealth}`);
        console.log(`Player gold is ${this.player.gold}`);
        console.log(`Is health zero: ${this.player.isHealthZero()}`);

        console.log(`Testing functions:`);
        this.player.updateGold(50);
        console.log(`Player gold is ${this.player.gold}`);
        this.player.updateHealth(10);
        console.log(`player health is ${this.player.playerHealth}`);
        console.log(`Is health zero: ${this.player.isHealthZero()}`);

    }
}