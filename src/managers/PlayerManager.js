export default class PlayerManager extends Phaser.Scene {
    constructor(data) {
        super({ key: 'PlayerManager' });

        // Core player stats (economy + health)
        this.gold = 250;
        this.playerHealth = 20;
        this.goldPerSec = 0;
        this.incInterval = 1000;

        if (data) {
            this.sceneL = data.sceneL;
        }
    }

    income() {
        // Passive gold gain over time
        this.gold += this.goldPerSec;
    }

    updateHealth(damage) {
        // Prevent health from going below 0
        this.playerHealth = Math.max(0, this.playerHealth - damage);
    }

    isHealthZero() {
        return this.playerHealth === 0;
    }

    updateGold(change) {
        // Positive = earn gold
        if (change > 0) {
            this.gold += change;
            return;
        }

        // Negative = spend gold (check if enough)
        if (-change > this.gold) {
            console.log('Not enough gold!');
            return;
        }
        this.gold += change;
    }

    status(condition) {
        // Trigger win/lose state through level manager
        if (condition === 'win') this.sceneL?.closeLevel('win', 0);
        else if (condition === 'lose') this.sceneL?.closeLevel('lose', 0);
    }

    createFloatingText(x, y, text, color) {
        const main = this.scene.add.text(x, y, text, {
            fontSize: '28px',
            fill: color,
            fontStyle: 'bold',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000);

        const shadow = this.scene.add.text(x + 4, y + 4, text, {
            fontSize: '28px',
            fill: '#000000',
            alpha: 0.3
        }).setOrigin(0.5).setDepth(1999);

        // Animate upward + fade out
        this.scene.tweens.add({
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