import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // [name, id, health, speed, reward, lastFrame]
    static testData = [
        ['Oni', 0, 40, 1, 5, 15],
        ['Yokai', 1, 60, 1, 7, 5],
        ['Skeleton', 2, 50, 1, 10, 6],
        ['Orc', 3, 65, 0.8, 15, 5],
        ['Firespawn', 4, 30, 1.2, 20, 6],
        ['Plent', 5, 35, 0.9, 4, 10],
        ['CurseWanderer', 6, 65, 0.7, 25, 8],
        ['Slime', 7, 20, 1, 3, 4]
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
            const key = `${name}_walk`;
            // Only create animation if it doesn't already exist
            if (!anims.exists(key)) {
                anims.create({
                    key,
                    frames: anims.generateFrameNumbers(name, { start: 0, end: lastFrame }),
                    frameRate: 8,
                    repeat: -1
                });
            }
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