export const ACHIEVEMENTS = {
    first_win: {
        name: 'First Victory',
        condition: (e) => e.type === 'Win'
    },

    first_loss: {
        name: 'First Loss',
        condition: (e) => e.type === 'Lose'
    },

    speedrun: {
        name: 'Speedrunner',
        condition: (e) => e.type === 'Win' && e.time < 360
    },

    no_damage: {
        name: 'Perfect Defense',
        condition: (e) => e.type === 'Win' && e.pHealth === 20
    },

     rich: {
         name: 'Rich!',
        condition: (e) => e.type === 'Win' && e.gainedGold > 1000
    }
};