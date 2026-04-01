export default class PlayerManager {
    STORAGE_KEY = 'stage_stats';
    //static SAVE_GAME_KEY = 'mythological_defense_save';

    initStats() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultp = {
                //inventory: [],
                gold: 150,
                playerHealth: 20
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultp));
        }
    }

    getStats() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('❌ Failed to parse player data:', e);
            return null;
        }
    }

    saveStats(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('❌ Failed to save stats:', e);
        }
    }

    updateHealth(damage) {
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

    isHealthZero() {
        const stats = this.getStats();
        return stats.playerHealth == 0 ? true : false;
    }

    updateGold(change) {
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


    resetStats() {
        localStorage.removeItem(this.STORAGE_KEY);
        //localStorage.removeItem(this.SAVE_GAME_KEY);
        this.initStats();
        console.log('✓ Progress reset!');
    }






    // --------------------------------------
    // For Reference
    // --------------------------------------


    

    // Game save/load system
    // static saveGameState(gameState) {
    //     try {
    //         localStorage.setItem(this.SAVE_GAME_KEY, JSON.stringify(gameState));
    //         console.log('✓ Game saved!');
    //     } catch (e) {
    //         console.error('❌ Failed to save game state:', e);
    //     }
    // }

    // static loadGameState() {
    //     const data = localStorage.getItem(this.SAVE_GAME_KEY);
    //     try {
    //         return data ? JSON.parse(data) : null;
    //     } catch (e) {
    //         console.error('❌ Failed to load game state:', e);
    //         return null;
    //     }
    // }

    // static hasSavedGame() {
    //     return localStorage.getItem(this.SAVE_GAME_KEY) !== null;
    // }

    // static clearSavedGame() {
    //     localStorage.removeItem(this.SAVE_GAME_KEY);
    //     console.log('✓ Saved game cleared!');
    // }
}