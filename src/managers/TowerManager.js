import Tower from '../entities/Tower.js';

export default class TowerManager {
    // Tower stat tables: [name, damage, range, attackSpeed, idleEnd, attackEnd]
    static physicalData = [
        ['Izanami', 10, 2, 1.2, 2, 14],
        ['Susanoo', 5, 3, 0.6, 6, 14]
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
        this.towerIndex = ['p0', 'p1'];
    }

    getStatsByIndex(indexStr) {

        let tier = 1;

        if (indexStr.includes('_')) {
            const parts = indexStr.split('_');
            indexStr = parts[0];
            tier = Number(parts[1]);
        }

        const type = indexStr[0];
        const id = Number(indexStr.slice(1));

        switch (type) {
            case 'p': return this.constructor.physicalData[id]; break;
            case 'a': return this.constructor.airData[id]; break;
            case 'w': return this.constructor.waterData[id]; break;
            case 'f': return this.constructor.fireData[id]; break;
            case 'd': return this.constructor.darkData[id]; break;
            case 'o': return this.constructor.otherData[id]; break;
            default: return null;
        }

        if (!base) return null;

        const [name, dmg, range, atkSpeed, idleEnd, attackEnd] = base;

        // Scaling per tier
        const scale = 1 + (tier - 1) * 0.5;

        return [
            name,
            dmg * scale,
            range + (tier - 1),
            atkSpeed * (1 + (tier - 1) * 0.2),
            idleEnd,
            attackEnd
        ];
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
}