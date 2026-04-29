import SaveManager from '../managers/SaveManager.js';
import AchievementManager from '../managers/AchievementManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import StatsManager from '../managers/StatsManager.js';

export default class LoseScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScreen' });
    }

    // Build the defeat screen UI
    create(data) {
        const { width, height } = this.scale;
        

        // Red/dark layered background for defeat theme
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a0000).setDepth(-1);
        this.add.rectangle(width / 2, height / 2, width, height, 0x2d0000)
            .setDepth(-1).setAlpha(0.5);

        const levelId = data?.levelId ?? 1;
        const passTime = data.passTime ?? 0;
        const gainGold = data.gainGold ?? 0;
        const spentGold = data.spentGold ?? 0;

        AchievementManager.check({
            type: 'Lose',
            time: passTime,
            gainedGold: gainGold,
            usedGold: spentGold
        });

        StatsManager.incLevelFails(1);

        const title = this.add.text(width / 2, height / 2 - 150, 'DEFEAT', {
            fontSize: '96px',
            fill: '#ff4444',                
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#ff0000',              
            strokeThickness: 6
        }).setOrigin(0.5);

        // Animate title bouncing in
        this.tweens.add({
            targets: title,
            y: height / 2 - 140,
            duration: 600,
            ease: 'Elastic.easeOut'
        });

        // Defeat message
        this.add.text(width / 2, height / 2 - 70, 'Your castle has fallen...', {
            fontSize: '32px',
            fill: '#ff6666',                
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        this.createButton(width / 2 - 180, height / 2 + 140, 'RETRY', '#ef4444', () => {
            this.retryLevel(levelId);
        });
        
        this.createButton(width / 2 + 180, height / 2 + 140, 'MENU', '#6366f1', () => {
            this.scene.start('MainMenu');
        });
    }

    // Restart the specified level
    retryLevel(levelId) {
        const levels = {
            1: 'Level1',
            2: 'Level2'
        };
        const sceneKey = levels[levelId] || 'Level1';
        this.scene.start(sceneKey);
    }

    // Helper function to create clickable buttons
    createButton(x, y, text, color, callback) {
        const bg = this.add.rectangle(x, y, 300, 70, color)
            .setInteractive({ useHandCursor: true }).setDepth(3000);
        const label = this.add.text(x, y, text, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(3001);

        // Interactive behavior
        bg.on('pointerover', () => {        
            bg.setScale(1.08);
            label.setScale(1.08);
        });

        bg.on('pointerout', () => {         
            bg.setScale(1);
            label.setScale(1);
        });

        bg.on('pointerdown', callback);     
    }
}