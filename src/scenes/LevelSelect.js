export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(width / 2, 80, 'SELECT LEVEL', {
            fontSize: '64px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 6,
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const levels = [
            { num: 1, name: 'LEVEL 1', scene: 'Level1' },
            { num: 2, name: 'LEVEL 2', scene: 'Level2' },
            { num: 3, name: 'LEVEL 3', scene: 'Level3' }
        ];

        levels.forEach((lvl, i) => {
            const x = width / 2 + (i - 1) * 300;
            const y = height / 2;
            const card = this.add.rectangle(x, y, 200, 150, 0x1a3f5e).setStrokeStyle(3, 0x64d5ff).setInteractive({ useHandCursor: true });
            this.add.text(x, y - 20, lvl.name, {
                fontSize: '28px',
                color: '#64d5ff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            card.on('pointerover', () => card.setScale(1.05));
            card.on('pointerout', () => card.setScale(1));
            card.on('pointerdown', () => this.scene.start(lvl.scene));
        });

        const back = this.add.text(50, height - 50, '← BACK', {
            fontSize: '24px',
            color: '#64d5ff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true }).setOrigin(0);

        back.on('pointerover', () => { back.setColor('#ffffff'); back.setScale(1.1); });
        back.on('pointerout', () => { back.setColor('#64d5ff'); back.setScale(1); });
        back.on('pointerdown', () => this.scene.start('MainMenu'));
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MainMenu'));
    }
}