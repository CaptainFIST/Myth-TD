import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // [name, damage, health, speed, reward, lastFrame]
    static testData = [
        ['Oni', 1, 4, 1, 5, 15],
        ['flying_fly', 2, 75, 1, 5, 5]
    ];

    constructor(scene) {
        this.scene = scene;
        this.activeEnemies = scene.add.group({ runChildUpdate: true });
    }

    getStatsByIndex(indexStr) {
        const id = +indexStr.slice(1);
        return indexStr[0] === 't' ? EnemyManager.testData[id] : null;
    }

    createAnimations() {
        const { anims } = this.scene;

        EnemyManager.testData.forEach(([name, , , , , lastFrame]) => {
            anims.create({
                key: `${name}_walk`,
                frames: anims.generateFrameNumbers(name, { start: 0, end: lastFrame }),
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

    // Enable/disable enemies + animations
    setActiveState(state) {
        this.activeEnemies.children.each(e => {
            if (!e) return;
            e.active = state;

            // Safe animation control
            if (e.anims) {
                state ? e.anims.resume() : e.anims.pause();
            }
        });
    }

    pause() { this.setActiveState(false); }
    resume() { this.setActiveState(true); }
}