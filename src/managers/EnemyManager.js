import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // ['Name', damage, health, speed, gold reward, lastMovementFrame]
    static testData = [
        ['Oni', 1, 40, 1, 5, 15],
        ['flying_fly', 2, 75, 1, 5, 5]
    ];

    constructor(scene) {
        this.scene = scene;
        this.activeEnemies = scene.add.group({ runChildUpdate: true });
    }

    // Convert string index like "t0" → stats
    getStatsByIndex(indexStr) {
        const type = indexStr[0];
        const id = +indexStr.slice(1);
        return type === 't' ? EnemyManager.testData[id] : null;
    }

    createAnimations() {
        const { anims } = this.scene;

        EnemyManager.testData.forEach(([name, , , , , lastMove]) => {
            anims.create({
                key: `${name}_walk`,
                frames: anims.generateFrameNumbers(name, { start: 0, end: lastMove }),
                frameRate: 8,
                repeat: -1
            });
        });
    }

    createEnemy(index, path) {
        if (!path?.length) return console.error("EnemyManager: Invalid path");
        const stats = EnemyManager.testData[index];
        if (!stats) return console.error("Invalid enemy index:", index);

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

    // Toggle all enemies active/inactive
    setActiveState(state) {
        this.activeEnemies.children.each(e => e && (e.active = state));
    }

    pause() { this.setActiveState(false); }
    resume() { this.setActiveState(true); }
}