import SaveManager from './SaveManager.js';
import  {ACHIEVEMENTS} from './Achievements.js';

export default class AchievementManager {
    static check(event) {
        const data = SaveManager.getSlot();

        for(const id in ACHIEVEMENTS) 
        {
            if(data.achievements[id]) continue;

            const achievement = ACHIEVEMENTS[id];

            if(achievement.condition && achievement.condition(event)) 
            {
                AchievementManager.unlock(id);
            }
        }
    }

    static unlock(id) {
        const data = SaveManager.getSlot();

        data.achievements[id] = {
            unlockedAt: Date.now()
        };

        console.log(ACHIEVEMENTS[id].name);

        SaveManager.commit();


    }
}