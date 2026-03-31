export default class SettingsMenu extends Phaser.Scene {

    constructor() {
        super({key: 'SettingsMenu'});
        //audio here
    }

    create() {
        const { width, height } = this.scale;

        //audio here

        // ---------- BACKGROUND EFFECT ----------
        this.bgGraphics = this.add.graphics();
        this.circles = [];
        for (let i = 0; i < 20; i++) {
            this.circles.push({
                x: Phaser.Math.Between(0, width),
                y: Phaser.Math.Between(0, height),
                radius: Phaser.Math.Between(20, 60),
                alpha: Phaser.Math.FloatBetween(0.05, 0.15),
                speed: Phaser.Math.FloatBetween(0.1, 0.4)
            });
        } //update() needed

        // ---------- GRADIENT OVERLAY ----------
        // const gradient = this.make.graphics({ x: 0, y: 0, add: false });
        // gradient.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x2d5f6f, 0x2d5f6f, 1);
        // gradient.fillRect(0, 0, width, height);
        // gradient.generateTexture('gradientBG', width, height);
        // this.add.image(0, 0, 'gradientBG').setOrigin(0, 0).setDepth(-1);
        // gradient.destroy();

        // ---------- TITLE ----------
        this.add.text(width / 2, height / 4 - 80, 'SETTINGS', {
            fontSize: '68px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 8,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // --------- DEV ---------
        const DEVY = height / 2 - 60;
        this.Dev = this.add.text(width / 2 + 200, DEVY - 50, 'DEV', {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0,0).setInteractive({ useHandCursor: true });

        // ---------- AUDIO SECTION ----------
        const audioY = height / 2 - 60;
        this.add.text(width / 2 - 500, audioY - 50, 'AUDIO SETTINGS', {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);
        // Master Volume Slider

        // Sound Volume Slider

        // Music Volume Slider

        // Mute Button

        // ---------- DELETE DATA BUTTON ----------
        const deleteBtn = this.add.text(width / 2, height - 120, 'DELETE ALL DATA', {
            fontSize: '28px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // ---------- BACK BUTTON ----------
        const backBtn = this.add.text(width / 2, height - 40, 'BACK TO MENU', {
            fontSize: '32px',
            color: '#64d5ff',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        this.createAudioUI();
    }

    createAudioUI() {
        const { width } = this.scale;
        const iconX = width - 160;
        const iconY = 50;
        this.add.circle(iconX, iconY, 20, 0x7c3aed);
        this.add.text(iconX, iconY, '🔊', { fontSize: '18px' }).setOrigin(0.5);

        const sliderX = width - 150; 
        const sliderY = 50;
        this.add.rectangle(sliderX + 70, sliderY, 100, 6, 0x333333);  
        this.add.rectangle(sliderX + 20, sliderY, 40, 6, 0x7c3aed).setOrigin(0, 0.5); 
        this.add.circle(sliderX + 60, sliderY, 8, 0x7c3aed);       
    }
    createVolumeControl() {  
    }

    update() {
        // Animate background circles
        this.bgGraphics.clear();
        this.bgGraphics.fillStyle(0x66ccff, 0.05);
        this.circles.forEach(c => {
            c.y -= c.speed;
            if (c.y + c.radius < 0) c.y = this.scale.height + c.radius;
            this.bgGraphics.fillCircle(c.x, c.y, c.radius);
        });
    }
}