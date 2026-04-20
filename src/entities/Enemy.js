export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, stats, path) {
        super(scene, 0, 0, stats[0], 0);
        this.scene = scene;

        // Destructure stats: name, damage, health, speed, reward
        [this.name, this.damage, this.maxHealth, this.speed, this.reward] = stats;
        this.health = this.maxHealth;

        scene.add.existing(this);
        this.setDepth(10).setScale(2);

        this.healthBarBg = scene.add.graphics();
        this.healthBarFill = scene.add.graphics();

        // Validate path
        if (!path?.length) return console.error("Enemy spawned with invalid path:", path);

        this.path = path;
        this.pIndex = 0;

        this.setPosition(path[0].x, path[0].y);
        this.play(`${this.name}_walk`);

        this.updateHealthBar();
    }

    update(time, delta) {
        const target = this.path?.[this.pIndex];
        if (!target) return;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        // Move to next waypoint if close enough
        if (dist < 5 && ++this.pIndex >= this.path.length) {
            return this.reachedBase();
        }

        const next = this.path[this.pIndex];
        const angle = Phaser.Math.Angle.Between(this.x, this.y, next.x, next.y);
        const move = this.speed * (delta / 16.6667);

        this.x += Math.cos(angle) * move;
        this.y += Math.sin(angle) * move;
        this.updateHealthBar();
    }

    reachedBase() {
        this.scene.player?.updateHealth?.(this.damage);
        this.cleanup();
        this.destroy();
    }

    takeDamage(amount) {
        this.health -= amount;
        this.updateHealthBar();
        if (this.health <= 0) this.die();
    }

    updateHealthBar() {
        if (!this.healthBarBg || !this.healthBarFill) return;

        const w = 40, h = 6;
        const x = this.x - w / 2;
        const y = this.y - 40;

        const hp = Math.max(0, this.health / this.maxHealth);
        const color = hp < 0.25 ? 0xff0000 : hp < 0.5 ? 0xffff00 : 0x00ff00;

        this.healthBarBg.clear().fillStyle(0x000000, 0.8).fillRect(x, y, w, h).setDepth(15);
        this.healthBarFill.clear().fillStyle(color, 1).fillRect(x, y, w * hp, h).setDepth(16);
    }

    die() {
        this.scene.player?.updateGold?.(this.reward);
        this.cleanup();
        this.destroy();
    }

    // Centralized cleanup (avoids repeating destroy logic)
    cleanup() {
        this.healthBarBg?.destroy();
        this.healthBarFill?.destroy();
    }
}