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
        data.stats.perfectClears += 0;
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
            
*/