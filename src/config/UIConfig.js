export const UIConfig = {
    // Colors
    colors: {
        primary: 0x06b6d4,
        primaryLight: 0x7c3aed,
        buttonBg: 0x333333,
        buttonHover: 0x555555,
        white: 0xffffff,
        black: 0x000000,
        darkBg: 0x0f1534,
        mutedGray: 0x666666,
        healthRed: 0xCD1C18,
        gold: '#ffd700',
        cyan: '#64d5ff',
        primaryText: '#06b6d4',
        hoverText: '#7c3aed'
    },

    // Font styles
    fonts: {
        title: { fontSize: '120px', color: '#ffffff', fontStyle: 'bold' },
        heading: { fontSize: '34px', color: '#06b6d4', fontStyle: 'bold', fontFamily: 'Arial, sans-serif' },
        buttonLarge: { fontSize: '20px', color: '#ffffff', fontStyle: 'bold', align: 'center' },
        buttonSmall: { fontSize: '16px', color: '#ffffff', fontStyle: 'bold', align: 'center' },
        label: { fontSize: '18px', color: '#06b6d4', fontStyle: 'bold' },
        smallLabel: { fontSize: '12px', color: '#06b6d4' },
        statusText: { fontSize: '14px', color: '#ffffff' }, //health
        goldText: { fontSize: '20px', color: '#ffd700', fontStyle: 'bold' },
        waveText: { fontSize: '20px', color: '#64d5ff' },
        timerText: { fontSize: '20px', color: '#ffffff' },
        volumeText: { fontSize: '14px', color: '#06b6d4', fontStyle: 'bold', align: 'center' },
        emojiButton: { fontSize: '32px', color: '#06b6d4', fontStyle: 'bold' }
    },

    // Button dimensions
    buttons: {
        standard: { width: 160, height: 80 },
        sidebarButton: { width: 200, height: 50 },
        speedButton: { width: 60, height: 40 },
        controlButton: { width: 60, height: 40 }
    },

    // Depth layers
    depths: {
        ui: 60,
        uiText: 61,
        modal: 200,
        modalBg: 201,
        modalContent: 202,
        modalHandle: 203
    },

    // UI positions (relative adjustments)
    positions: {
        bottomUIOffset: 49,
        controlButtonY: 10,
        healthDisplayX: 250
    },

    // Slider dimensions
    slider: {
        width: 200,
        height: 6,
        handleRadius: 10,
        bgColor: 0x333333,
        primaryColor: 0x06b6d4
    },

    // Health display
    health: {
        maxHP: 20,
        radiusRatio: 0.5, // 39/2 = 0.5 * 78
        fillColor: 0xCD1C18
    }
};