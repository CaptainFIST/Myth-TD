import Tower from '../entities/Tower.js';

export default class TowerManager {
    // Table info:
    // ['Name', dmg, range, attspd, lastIdleFrame, lastAttackFrame]
    static neutralData = [];
    static physicalData = [
        ['Izanami', 25, 3, 1.2, 2, 14],
        ['Susanoo', 12, 4, 0.25, 6, 14]
    ];
    static airData = [];
    static waterData = [];
    static fireData = [];
    static darkData = [];
    static otherData = [
        ['Shrine', 0, 0, 0, 0, 0]
    ];

    constructor(scene) {
        this.scene = scene;

        // init tower data
        this.neutral = TowerManager.neutralData;
        this.physical = TowerManager.physicalData;
        this.air = TowerManager.airData;
        this.water = TowerManager.waterData;
        this.fire = TowerManager.fireData;
        this.dark = TowerManager.darkData;
        this.other = TowerManager.otherData;

        // index array for tower rolling
        this.towerIndex = [
            'p0','p1'
        ];

        this.activeTowers = this.scene.add.group({
            runChildUpdate: true
        });
    }

    getStatsByIndex(indexStr) {
        const type = indexStr[0];
        const id = parseInt(indexStr.slice(1));

        switch(type) {
            case 'p': return this.physical[id];
            case 'a': return this.air[id];
            case 'w': return this.water[id];
            case 'f': return this.fire[id];
            case 'd': return this.dark[id];
            case 'o': return this.other[id];
            default: return null;
        }
    }

    getRandomTowerIndex() {
        const randomIndex = Math.floor(Math.random() * this.towerIndex.length);
        return this.towerIndex[randomIndex];
    }

    createTower(indexStr, x, y) {
        const stats = this.getStatsByIndex(indexStr);
        if (!stats) {
            console.error("Could not find stats from index:", indexStr);
            return;
        }
        const tower = new Tower(this.scene, stats);

        tower.place(x, y);
        this.activeTowers.add(tower);
        return tower;
    }

    //this.towerManager.activeTowers.clear(true, true);
}