import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // Table info:
    // ['Name', dmg, health, speed, gold, last Movement Frame] later frames

    static testData = [

        ['Oni', 1, 60, 1, 5, 15],
        ['flying_fly', 2, 75, 1, 5, 5]

    ];

    constructor(scene) {
        this.scene = scene;
        this.activeEnemies = this.scene.add.group({
            runChildUpdate: true
        });
    }

    getStatsByIndex(indexStr) {
        const type = indexStr[0];
        const id = parseInt(indexStr.slice(1));

        switch (type) {
            case 't':
                return EnemyManager.testData[id];
            default:
                return null;
        }
    }

    createEnemy(index, path) {
        if (!path || path.length === 0) {
            console.error("EnemyManager: Invalid path");
            return;
        }

        const stats = EnemyManager.testData[index];

        if (!stats) {
            console.error("Invalid enemy index:", index);
            return;
        }

        const enemy = new Enemy(this.scene, stats, path);
        this.activeEnemies.add(enemy);
        return enemy;
    }

    clearEnemies() {
        this.activeEnemies.clear(true, true);
    }

    getAliveCount() {
        return this.activeEnemies.getChildren().length;
    }
}