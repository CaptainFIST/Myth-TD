import Tower from '../entities/Tower.js';

export default class TowerManager {
    static neutralData = [];
    static physicalData = [
        ['Izanami', 15, 3, 0.7, 2, 14],
        ['Susanoo', 10, 5, 3, 6, 14]
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
        if (type === 'p') return this.physical[id];
        return null;
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
}