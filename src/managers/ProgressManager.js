import SaveManager from './SaveManager.js';

export default class ProgressManager {
    static completeLevel(level) {
        const data = SaveManager.getSlot();

        if(!data.progress.levelsCompleted.includes(level)) {
            data.progress.levelsCompleted.push(level);
            data.progress.levelsCompleted.sort((a,b) => a - b);
        }
        SaveManager.commit();
    }

    static isUnlocked(level) {
        if(level === 1) return true;

        const data = SaveManager.getSlot();
        return data.progress.levelsCompleted.includes(level - 1);
    }
}