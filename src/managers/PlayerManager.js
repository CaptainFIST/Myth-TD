import SaveManager from '../managers/SaveManager.js';
import AchievementManager from '../managers/AchievementManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import StatsManager from '../managers/StatsManager.js';

export default class PlayerManager extends Phaser.Scene {
    constructor(data) {
        super({ key: 'PlayerManager' });

        // Core player stats (economy + health)
        this.gold = 250;
        this.playerHealth = 20;
        this.goldPerSec = 0;
        this.incInterval = 1000;

        this.gainGold = 0;
        this.spentGold = 0;
        this.audioManager = null;

        if (data) {
            this.sceneL = data.sceneL;
            this.audioManager = data.audioManager;
        }
    }


    income() {
        this.gold += this.goldPerSec;
    }

    updateHealth(damage) {
        // Prevent health from going below 0
        this.playerHealth = Math.max(0, this.playerHealth - damage);
        
        // Play health loss audio
        if (this.audioManager && typeof this.audioManager.playHealthLoss === 'function') {
            this.audioManager.playHealthLoss();
        }
    }

    isHealthZero() {
        return this.playerHealth === 0;
    }

    updateGold(change) {
        // Positive = earn gold
        if (change > 0) {
            this.gold += change;
            this.gainGold += change;
            StatsManager.incTotalGold(change);
            return;
        }

        // Negative = spend gold (check if enough)
        if (-change > this.gold) {
            console.log('Not enough gold!');
            return;
        }
        this.gold += change;
        this.spentGold -= change;
        StatsManager.incGoldSpent(-change);
    }

    status(condition) {
        // Trigger win/lose state through level manager
        if (condition === 'win') this.sceneL?.closeLevel('win', 0);
        else if (condition === 'lose') this.sceneL?.closeLevel('lose', 0);
    }

    setupHealthDisplay(uiConfig, uiManager, x, y) {
        this.hpMax = uiConfig.health.maxHP;
        this.hpFrameX = x;
        this.hpFrameY = y;
        this.hpRadius = 39; // 78 / 2
        this.hpContainer = uiManager.add.container(0, 0).setDepth(1);
        this.hpFill = uiManager.add.graphics();
        this.hpContainer.add(this.hpFill);

        const maskShape = uiManager.add.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillCircle(x, y, this.hpRadius);
        maskShape.setVisible(false);
        this.hpContainer.setMask(maskShape.createGeometryMask());
        
        this.healthText = uiManager.add.text(x, y, '', uiConfig.fonts.statusText)
            .setOrigin(0.5).setDepth(3);
    }

    updateHealthDisplay() {
        const percent = Phaser.Math.Clamp(this.playerHealth / this.hpMax, 0, 1);
        const fillHeight = (this.hpRadius * 2) * percent;

        this.hpFill.clear();
        this.hpFill.fillStyle(0xff0000, 1);
        this.hpFill.fillRect(
            this.hpFrameX - this.hpRadius,
            (this.hpFrameY + this.hpRadius) - fillHeight,
            this.hpRadius * 2,
            fillHeight
        );
        this.healthText?.setText?.(`${this.playerHealth} / ${this.hpMax}`);
    }

    createFloatingText(x, y, text, color) {
        const main = this.sceneL.add.text(x, y, text, {
            fontSize: '28px',
            fill: color,
            fontStyle: 'bold',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000);

        const shadow = this.sceneL.add.text(x + 4, y + 4, text, {
            fontSize: '28px',
            fill: '#000000',
            alpha: 0.3
        }).setOrigin(0.5).setDepth(1999);

        // Animate upward + fade out
        this.sceneL.tweens.add({
            targets: [main, shadow],
            y: y - 80,
            alpha: 0,
            duration: 1200,
            ease: 'Quad.easeOut',
            onComplete: () => {
                main.destroy();
                shadow.destroy();
            }
        });
    }
}