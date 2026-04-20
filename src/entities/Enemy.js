export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, stats, path) {
        super(scene, 0, 0, stats[0], 0);

        this.scene = scene;

        this.name = stats[0];
        this.damage = stats[1];

        this.maxHealth = stats[2];

        this.health = stats[2];
        this.speed = stats[3];
        this.reward = stats[4];

        this.scene.add.existing(this);
        this.setDepth(10);
        this.setScale(2);

        this.healthBarBg = this.scene.add.graphics();
        this.healthBarFill = this.scene.add.graphics();
        this.updateHealthBar();

        this.distanceTraveled = 0;

        if (!path || path.length === 0) {
            console.error(" Enemy spawned with invalid path:", path);
            return;
        }

        this.path = path;
        this.pIndex = 0;
        this.setPosition(this.path[0].x, this.path[0].y);
        this.play(`${this.name}_walk`);
    }

    update(time, delta) {
        if (!this.path || this.pIndex >= this.path.length) return;

        const target = this.path[this.pIndex];
        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        if (dist < 5) {
            this.pIndex++;

            if (this.pIndex >= this.path.length) {
                this.reachedBase();
                return;
            }
        }

        const next = this.path[this.pIndex];
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            next.x,
            next.y
        );

        const dt = delta / 16.6667;
        const moveDist = this.speed * dt;
        this.x += Math.cos(angle) * moveDist;
        this.y += Math.sin(angle) * moveDist;

        this.distanceTraveled += moveDist;
        this.updateHealthBar();
    }

    reachedBase() {

        if (this.scene.player && this.scene.player.updateHealth) {
            this.scene.player.updateHealth(this.damage);
        }
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBarFill) this.healthBarFill.destroy();

        this.destroy();
    }

    takeDamage(amount) {
        this.health -= amount;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    updateHealthBar() {
        if (!this.healthBarBg || !this.healthBarFill) return;

        const barWidth = 40;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 40;

        this.healthBarBg.clear();
        this.healthBarFill.clear();

        this.healthBarBg.fillStyle(0x000000, 0.8);
        this.healthBarBg.fillRect(barX, barY, barWidth, barHeight);
        this.healthBarBg.setDepth(15);

        const healthPercent = Math.max(0, this.health / this.maxHealth);
        const fillWidth = barWidth * healthPercent;
        
        let fillColor = 0x00ff00; 
        if (healthPercent < 0.5) fillColor = 0xffff00; 
        if (healthPercent < 0.25) fillColor = 0xff0000; 
        
        this.healthBarFill.fillStyle(fillColor, 1);
        this.healthBarFill.fillRect(barX, barY, fillWidth, barHeight);
        this.healthBarFill.setDepth(16);
    }

    die() {
        if (this.scene.player) {
            this.scene.player.updateGold(this.reward);
        }
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBarFill) this.healthBarFill.destroy();
        this.destroy();
    }
}