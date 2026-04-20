import Tower from '../entities/Tower.js';

export default class TowerManager {
    // Table format: ['Name', damage, range, attackSpeed, lastIdleFrame, lastAttackFrame]
    static neutralData = [];            
    static physicalData = [
        ['Izanami', 18, 2, 1.2, 2, 14],  
        ['Susanoo', 10, 3, 0.3, 6, 14]   
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

        // Create local references to tower data for quick access
        this.neutral = TowerManager.neutralData;
        this.physical = TowerManager.physicalData;
        this.air = TowerManager.airData;
        this.water = TowerManager.waterData;
        this.fire = TowerManager.fireData;
        this.dark = TowerManager.darkData;
        this.other = TowerManager.otherData;


        this.towerIndex = [
            'p0',  // Izanami 
            'p1'   // Susanoo 
        ];

        // Active towers
        this.activeTowers = this.scene.add.group({
            runChildUpdate: true
        });
        this.selectedTower = null;      
    }

    // Convert tower index string to actual tower stats
    getStatsByIndex(indexStr) {
        const type = indexStr[0];       
        const id = parseInt(indexStr.slice(1)); 

        // Look up the tower stats based on type
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

    // Pick a random tower from available tower pool 
    getRandomTowerIndex() {
        const randomIndex = Math.floor(Math.random() * this.towerIndex.length);
        return this.towerIndex[randomIndex];
    }

    // Generate sprite sheet animations for all physical towers
    createAnimations() {
        this.physical.forEach(stats => {
            const name = stats[0];           
            const lastIdle = stats[4];       
            const lastAttack = stats[5];     

            this.scene.anims.create({
                key: `${name}_idle`,
                frames: this.scene.anims.generateFrameNumbers(name, { start: 0, end: lastIdle }),
                frameRate: 6,
                repeat: -1                   // Loop forever
            });

            // Create attack animation (plays once then stops)
            this.scene.anims.create({
                key: `${name}_attack`,
                frames: this.scene.anims.generateFrameNumbers(name, { start: lastIdle + 1, end: lastAttack }),
                frameRate: 12,
                repeat: 0                    // Play once
            });
        });
    }

    // Instantiate a new tower and add it to the scene
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

    // Tower selection for placement mode
    selectTower(towerIndex) {
        this.selectedTower = towerIndex;  
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
        if (!this.selectedTower) return null;
        return this.getStatsByIndex(this.selectedTower);  
    }

    pause() {
        this.activeTowers.children.entries.forEach(tower => {
            if (tower) tower.active = false;  // Disable each tower
        });
    }

    resume() {
        this.activeTowers.children.entries.forEach(tower => {
            if (tower) tower.active = true;   // Re-enable each tower
        });
    }
}