import Tower from '../entities/Tower.js';

export default class TowerManager {
    // Tower stat tables: [name, damage, range, attackSpeed, idleEnd, attackEnd]
    static physicalData = [
        ['Izanami', 10, 2, 1.2, 2, 14],
        ['Susanoo', 5, 3, 0.6, 6, 14],
        ['Promachus', 20, 3, 2.5, 3, 12]
    ];

    static airData = [];
    static waterData = [];
    static fireData = [];
    static darkData = [];
    static neutralData = [];
    static otherData = [['Shrine', 0, 0, 0, 0, 0]];

    constructor(scene) {
        this.scene = scene;

        // Local references for quick access
        this.activeTowers = scene.add.group({ runChildUpdate: true });

        // Currently selected tower type (for placement mode)
        this.selectedTower = null;

        // Available tower index list
        this.towerIndex = ['p0', 'p1', 'p2'];
    }

    getStatsByIndex(indexStr) {
        const type = indexStr[0];
        const id = Number(indexStr.slice(1));

        switch (type) {
            case 'p': return this.constructor.physicalData[id];
            case 'a': return this.constructor.airData[id];
            case 'w': return this.constructor.waterData[id];
            case 'f': return this.constructor.fireData[id];
            case 'd': return this.constructor.darkData[id];
            case 'o': return this.constructor.otherData[id];
            default: return null;
        }
    }

    getRandomTowerIndex() {
        return this.towerIndex[
            Math.floor(Math.random() * this.towerIndex.length)
        ];
    }

    createAnimations() {
        this.constructor.physicalData.forEach(([name, , , , idleEnd, attackEnd]) => {
            const idleKey = `${name}_idle`;
            const attackKey = `${name}_attack`;

            // Idle loop animation
            if (!this.scene.anims.exists(idleKey)) {
                this.scene.anims.create({
                    key: idleKey,
                    frames: this.scene.anims.generateFrameNumbers(name, {
                        start: 0,
                        end: idleEnd
                    }),
                    frameRate: 6,
                    repeat: -1
                });
            }

            // Attack animation (plays once)
            if (!this.scene.anims.exists(attackKey)) {
                this.scene.anims.create({
                    key: attackKey,
                    frames: this.scene.anims.generateFrameNumbers(name, {
                        start: idleEnd + 1,
                        end: attackEnd
                    }),
                    frameRate: 12,
                    repeat: 0
                });
            }
        });
    }

    createTower(indexStr, x, y) {
        const stats = this.getStatsByIndex(indexStr);
        if (!stats) return console.error("Invalid tower index:", indexStr);

        const tower = new Tower(this.scene, stats);
        tower.place(x, y);
        this.activeTowers.add(tower);
        return tower;
    }

    selectTower(index) {
        this.selectedTower = index;
    }

    deselectTower() {
        this.selectedTower = null;
    }

    getSelectedTower() {
        return this.selectedTower;
    }

    hasSelectedTower() {
        return this.selectedTower !== null;
    }

    getSelectedTowerStats() {
        return this.selectedTower
            ? this.getStatsByIndex(this.selectedTower)
            : null;
    }

    pause() {
        this.activeTowers.children.each(t => {
            if (t) t.active = false;
        });
    }

    resume() {
        this.activeTowers.children.each(t => {
            if (t) t.active = true;
        });
    }

    preloadAssets() {
        // Load tower sprites and icons
        this.constructor.physicalData.forEach(([name]) => {
            this.scene.load.spritesheet(name, `assets/tower/${name}.png`, { frameWidth: 64, frameHeight: 64 });
            this.scene.load.image(`${name}_Icon`, `assets/tower/TowerIcon/${name}_Icon.png`);
        });
    }

    createProjectileAnimations() {
        // Susanoo projectile animation
        const susanooKey = 'Susanoo_Stripe_projectile';
        if (!this.scene.anims.exists(susanooKey)) {
            this.scene.anims.create({
                key: susanooKey,
                frames: this.scene.anims.generateFrameNumbers('Susanoo_Stripe', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Promachus fire projectile animation
        const promachusKey = 'Promachus_fire_projectile';
        if (!this.scene.anims.exists(promachusKey)) {
            this.scene.anims.create({
                key: promachusKey,
                frames: this.scene.anims.generateFrameNumbers('Promachus_fire', { start: 0, end: 5 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
}