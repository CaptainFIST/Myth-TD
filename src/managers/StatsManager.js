import SaveManager from './SaveManager.js';

export default class StatsManager {
    static incrementStat(amount) {
        const data = SaveManager.getSlot();

        console.log(data.stats.totalGold);
        data.stats.totalGold += amount;
        console.log(data.stats.totalGold);


        SaveManager.commit();
    }

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
}