export default class PlayerManager extends Phaser.Scene {
    constructor(data) {
        super({ key: 'PlayerManager' });

        // Player economy + health values
        this.gold = 150;
        this.playerHealth = 20;
        this.goldPerSec = 2;
        this.incInterval = 1000;

        // Optional scene reference for level control
        if (data) {
            console.log(data);
            this.sceneL = data.sceneL;
        }
    }

    income() {
        // Passive gold income
        this.gold += this.goldPerSec;
    }

    updateHealth(damage) {
        this.playerHealth = Math.max(0, this.playerHealth - damage);
    }

    isHealthZero() {
        return this.playerHealth === 0;
    }

    updateGold(change) {
        if (change > 0) {
            this.gold += change;
            //console.log(`+${change} gold earned (Total: ${this.gold})`);
        } else if (change < 0) {
            if (Math.abs(change) <= this.gold) {
                this.gold += change;
                //console.log(`-${Math.abs(change)} gold spent (Total: ${this.gold})`);
            } else {
                console.log('Not enough gold!');
            }
        }

        if (Math.abs(change) > this.gold) {
            console.log('Not enough gold!');
            return;
        }

        this.gold += change;
        console.log(`-${Math.abs(change)} gold spent (Total: ${this.gold})`);
    }

    status(condition) {
        // Trigger win/lose screen via level manager
        if (condition === 'win') this.sceneL.closeLevel('win', 0);
        else if (condition === 'lose') this.sceneL.closeLevel('lose', 0);
    }

    createFloatingText(x, y, text, color) {
        const floatingText = this.scene.add.text(x, y, text, {
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

        // Animate float upward + fade out
        this.scene.tweens.add({
            targets: [floatingText, shadow],
            y: y - 80,
            alpha: 0,
            duration: 1200,
            ease: 'Quad.easeOut',
            onComplete: () => {
                floatingText.destroy();
                shadow.destroy();
            }
        });
    }
}