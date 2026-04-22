export const ACHIEVEMENTS = {
    first_win: {
        name: 'First Victory',
        condition: (e) => e.type === 'LEVEL_COMPLETE'
    },

    speedrun: {
        name: 'Speedrunner',
        condition: (e) =>
            e.type === 'LEVEL_COMPLETE' && e.time < 120
    },

    no_damage: {
        name: 'Perfect Defense',
        condition: (e) =>
            e.type === 'LEVEL_COMPLETE' && e.damageTaken === 0
    },

    rich: {
        name: 'Rich!',
        condition: (e) =>
            e.type === 'LEVEL_COMPLETE' && e.gold >= 10000
    }
};