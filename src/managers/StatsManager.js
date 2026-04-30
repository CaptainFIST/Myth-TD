import SaveManager from './SaveManager.js';
export default class StatsManager {

    static incTotalGold(amount) {
        const data = SaveManager.getSlot();
        data.stats.totalGold += amount;
        console.log(data.stats.totalGold);
        SaveManager.commit();
    }

    static incGoldSpent(amount) {
        const data = SaveManager.getSlot();
        data.stats.goldSpent += amount;
        console.log(data.stats.goldSpent);
        SaveManager.commit();
    }

    static incPerfectClears(amount) {
        const data = SaveManager.getSlot();
        data.stats.perfectClears += amount;
        console.log(data.stats.perfectClears);
        SaveManager.commit();
    }

    static incLevelClears(amount) {
        const data = SaveManager.getSlot();
        data.stats.levelClears += amount;
        console.log(data.stats.levelClears);
        SaveManager.commit();
    }

    static incLevelFails(amount) {
        const data = SaveManager.getSlot();
        data.stats.levelFails += amount;
        console.log(data.stats.levelFails);
        SaveManager.commit();
    }

    static incEnemiesKilled(amount) {
        const data = SaveManager.getSlot();
        data.stats.enemiesKilled += amount;
        console.log(data.stats.enemiesKilled);
        SaveManager.commit();
    }

    static incTowersPlaced(amount) {
        const data = SaveManager.getSlot();
        data.stats.towersPlaced += amount;
        console.log(data.stats.towersPlaced);
        SaveManager.commit();
    }

    static incMergesDone(amount) {
        const data = SaveManager.getSlot();
        data.stats.mergesDone += amount;
        console.log(data.stats.mergesDone);
        SaveManager.commit();
    }
}

/*
stats: 
            totalGold: 0,
            goldSpent: 0,
            perfectClears: 0,
            levelClears: 0,
            levelFails: 0,
            enemiesKilled: 0,
            towersPlaced: 0,
            mergesDone: 0
*/