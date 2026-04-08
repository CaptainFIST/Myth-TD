export default class SettingsMenu extends Phaser.Scene {

    constructor() {
        super({key: 'SettingsMenu'});
    }

    create() {
        const { width, height } = this.scale;
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
        } 
        this.add.text(width / 2, height / 4 - 80, 'SETTINGS', {
            fontSize: '68px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 8,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        const audioY = height / 2 - 60;
        this.add.text(width / 2 - 500, audioY - 50, 'AUDIO SETTINGS', {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);
        this.masterVolCont = this.createVolumeControl(width / 2 - 450, audioY, 'MASTER VOLUME', 0.3);
        this.soundVolCont = this.createVolumeControl(width / 2 - 450, audioY + 50, 'SOUND VOLUME', 0.4);
        this.musicVolCont = this.createVolumeControl(width / 2 - 450, audioY + 100, 'MUSIC VOLUME', 0.4);
        
        const muteY = audioY + 160;
        const isMuted = false;
        this.muteBtn = this.add.text(width / 2 - 450, muteY, `MUTE: ${isMuted ? 'ON' : 'OFF'}`, {
            fontSize: '20px',
            color: isMuted ? '#ff6b6b' : '#64d5ff',
            fontStyle: 'bold',
            backgroundColor: isMuted ? '#4a2a2a' : '#1a3a3e',
            padding: { x: 15, y: 10 },
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0).setInteractive({ useHandCursor: true });

        const deleteBtn = this.add.text(width / 2, height - 120, 'DELETE ALL DATA', {
            fontSize: '28px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

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
    }

    createVolumeControl(x, y, label,  initialValue, callback) { 
        this.add.text(x, y, label, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);

        const barWidth = 200;
        const barHeight = 20;
        const barX = x + 200;
        const bar = this.add.rectangle(barX, y + 9, barWidth, barHeight, 0x333333).setOrigin(0, 0.5).setStrokeStyle(2, 0x64d5ff, 1);

        const fill = this.add.rectangle(barX, y + 9, barWidth * initialValue, barHeight, 0x64d5ff)
            .setOrigin(0, 0.5);

        const valueText = this.add.text(barX + barWidth + 20, y, Math.round(initialValue * 100) + '%', {
            fontSize: '16px',
            color: '#64d5ff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);

        bar.setInteractive({ useHandCursor: true });
        bar.on('pointerdown', (pointer) => {
            this.updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback);
        });

        bar.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback);
            }
        });
        return { fill, valueText };
    }

    updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback) {
        const relativeX = pointer.x - barX;
        const clampedX = Math.max(0, Math.min(barWidth, relativeX));
        const volumePercent = clampedX / barWidth;

        fill.setSize(clampedX, fill.height);
        valueText.setText(Math.round(volumePercent * 100) + '%');
        if (callback) {
            callback(volumePercent);
        }
    }
}