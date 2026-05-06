import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // [name, id, health, speed, reward, lastFrame]
    static neutralEnemy = [
        ['Orc', 3, 250, 0.75, 15, 6],
        ['CurseWanderer', 6, 115, 1.25, 25, 7]
    ];
    static physicalEnemy = [['Oni', 0, 60, 1.5, 5, 15]];
    static airEnemy = [['Yokai', 1, 40, 5, 7, 5]];
    static waterEnemy = [['Slime', 7, 70, 1, 3, 7]];
    static fireEnemy = [['Firespawn', 4, 50, 4, 20, 6]];
    static darkEnemy = [        
        ['Skeleton', 2, 75, 1.5, 10, 6],
        ['Plent', 5, 275, 0.5, 8, 8]
    ];

    static get allEnemyData() {
        return [
        ...this.neutralEnemy,
        ...this.physicalEnemy,
        ...this.airEnemy,
        ...this.waterEnemy,
        ...this.fireEnemy,
        ...this.darkEnemy
        ];
    }

    static enemyAffinity = [
        ['Orc', 0],
        ['CurseWanderer', 0],
        ['Oni', 1],
        ['Yokai', 2],
        ['Slime', 3],
        ['Firespawn', 4],
        ['Skeleton', 5],
        ['Plent', 5]
    ];

    constructor(scene) {
        this.scene = scene;
        this.activeEnemies = scene.add.group({ runChildUpdate: true });
    }

    getStatsByIndex(index) {
        // Handle numbers from Level1 waveData (e.g., 0, 1, 7)
        if (typeof index === 'number') {
            return EnemyManager.allEnemyData.find(enemy => enemy[1] === index);
        }

        // Handle strings if you ever use them (e.g., 'p0')
        if (typeof index === 'string') {
            const type = index[0];
            const id = parseInt(index.slice(1));
            switch (type) {
                case 'p': return EnemyManager.physicalEnemy[id];
                case 'a': return EnemyManager.airEnemy[id];
                case 'w': return EnemyManager.waterEnemy[id];
                case 'f': return EnemyManager.fireEnemy[id];
                case 'd': return EnemyManager.darkEnemy[id];
                case 'n': return EnemyManager.neutralEnemy[id];
                default: return null;
            }
        }
        return null;
    }

    createAnimations() {
        const { anims } = this.scene;
        EnemyManager.allEnemyData.forEach(([name, , , , , lastFrame]) => {
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
        
        // index could be 7 (number) or 'w0' (string)
        const stats = this.getStatsByIndex(index);
        if (!stats) return console.error("Invalid enemy index or ID:", index);

        const affinityData = EnemyManager.enemyAffinity.find(a => a[0] === stats[0]);
        const affinityID = affinityData ? affinityData[1] : 0;

        const enemy = new Enemy(this.scene, stats, path, affinityID);

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

    preloadAssets() {
        // Load enemy sprites
        this.constructor.allEnemyData.forEach(([name]) => {
            this.scene.load.spritesheet(name, `assets/Enemies/${name}.png`, { frameWidth: 64, frameHeight: 64 });
        });
    }
}