export default class PlayerManager {
    static STORAGE_KEY = 'stage_stats';
    //static SAVE_GAME_KEY = 'mythological_defense_save';
    //static MAX_LEVELS = 4;

    static initStats() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultp = {
                inventory: [],
                gold: 0,
                playerHealth: 20
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultp));
        }
    }

    static getStats() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('❌ Failed to parse player data:', e);
            return null;
        }
    }

    static saveStats(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('❌ Failed to save stats:', e);
        }
    }

    static updateHealth(damage) {
        const stats = this.getStats();

        if(stats.playerHealth != 0)
        {
            if(damage >= stats.playerHealth)
            {
                stats.playerHealth -= damage;
                console.log(`Player took ${damage} damage!`);
            }
            else
            {
                stats.playerHealth -= stats.playerHealth;
                console.log(`Player took ${stats.playerHealth} damage!`);
            }
        }
    }

    static isHealthZero() {
        const stats = this.getStats();
        return stats.playerHealth == 0 ? true : false;
    }

    static updateGold(change) {
        const stats = this.getStats();

        if(change > 0)
        {
            stats.gold += change;
        }
        else if(change < 0)
        {
            if(Math.abs(change) <= stats.gold)
            {
                stats.gold -= change;
            }
            
        }
    }


    static resetStats() {
        localStorage.removeItem(this.STORAGE_KEY);
        //localStorage.removeItem(this.SAVE_GAME_KEY);
        this.initStats();
        console.log('✓ Progress reset!');
    }

    // --------------------------------------
    // For Reference
    // --------------------------------------
    static completeLevel(levelNum) {
        const progress = this.getProgress();
        // make sure earlier levels are also treated as done for safety
        for (let i = 1; i < levelNum; i++) {
            if (!progress.levelsCompleted.includes(i)) {
                progress.levelsCompleted.push(i);
            }
        }
        if (!progress.levelsCompleted.includes(levelNum)) {
            progress.levelsCompleted.push(levelNum);
        }
        progress.levelsCompleted.sort((a, b) => a - b);
        progress.lastPlayedLevel = levelNum;
        this.saveProgress(progress);
        console.log(`✓ Level ${levelNum} marked as complete!`);
    }

    static isLevelCompleted(levelNum) {
        const progress = this.getProgress();
        return progress.levelsCompleted.includes(levelNum);
    }

    static isLevelUnlocked(levelNum) {
        // Progressive unlocking: unlock if previous level completed
        if (levelNum === 1) return true;
        return this.isLevelCompleted(levelNum - 1);
    }

    static getUnlockedLevels() {
        // Use MAX_LEVELS constant - easily configurable for adding new levels
        return Array.from({ length: this.MAX_LEVELS }, (_, i) => i + 1)
            .filter(level => this.isLevelUnlocked(level));
    }

    

    // Game save/load system
    static saveGameState(gameState) {
        try {
            localStorage.setItem(this.SAVE_GAME_KEY, JSON.stringify(gameState));
            console.log('✓ Game saved!');
        } catch (e) {
            console.error('❌ Failed to save game state:', e);
        }
    }

    static loadGameState() {
        const data = localStorage.getItem(this.SAVE_GAME_KEY);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('❌ Failed to load game state:', e);
            return null;
        }
    }

    static hasSavedGame() {
        return localStorage.getItem(this.SAVE_GAME_KEY) !== null;
    }

    static clearSavedGame() {
        localStorage.removeItem(this.SAVE_GAME_KEY);
        console.log('✓ Saved game cleared!');
    }
}