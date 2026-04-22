import SaveManager from './SaveManager.js';

export default class StatsManager {
    static incrementStat(stat, amount) {
        const data = SaveManager.getSlot();

        console.log(data.stats.totalGold);
        data.stats.totalGold += amount;
        console.log(data.stats.totalGold);


        SaveManager.commit();
    }

    static isUnlocked(level) {
        if(level === 1) return true;

        const data = SaveManager.getSlot();
        return data.progress.levelsCompleted.includes(level - 1);
    }
}