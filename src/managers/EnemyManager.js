import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
    // Table info:
    // ['Name', dmg, health, speed, gold] later frames

    static testData = [
        ['Oni', 1, 10, 1, 5],
        ['flying_fly', 2, 15, 1, 5]
    ];

    constructor(scene) {
        this.scene = scene;

        this.test = EnemyManager.testData;

        

        this.activeEnemies = this.scene.add.group({
            runChildUpdate: true
        });

    }

    getStatsByIndex(indexStr) {
        const type = indexStr[0];
        const id = parseInt(indexStr.slice(1));

        switch(type) {
            case 't': return this.test[id];
            
            default: return null;
        }
    }

    createEnemy(indexStr, path) {
        const stats = EnemyManager.testData[indexStr];
        //const stats = this.getStatsByIndex(indexStr);

        if (!stats) {
            console.error("Invalid enemy index:", indexStr);
            return;
        }

        const enemy = new Enemy(this.scene, stats, path);
        this.activeEnemies.add(enemy);

        return enemy;
    }
}

/* 
    
    

*/