export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, stats, path) {
        super(scene, 0, 0, stats[0], 0);
        this.scene = scene;

        // Destructure stats for cleaner code
        [this.name, this.damage, this.maxHealth, this.speed, this.reward] = stats;
        this.health = this.maxHealth;

        scene.add.existing(this);
        this.setDepth(10).setScale(2);

        // Health bar graphics
        this.healthBarBg = scene.add.graphics().setDepth(15);
        this.healthBarFill = scene.add.graphics().setDepth(16);

        // Validate path
        if (!path?.length) {
            console.error("Enemy spawned with invalid path:", path);
            return;
        }

        this.path = path;
        this.pIndex = 0;

        this.setPosition(path[0].x, path[0].y);
        this.play(`${this.name}_walk`);

        this.updateHealthBar();
    }

    update(time, delta) {
        if (!this.active || !this.path) return;

        const target = this.path[this.pIndex];
        if (!target) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        // Advance waypoint or reach base
        if (dist < 5 && ++this.pIndex >= this.path.length) {
            return this.reachedBase();
        }

        const next = this.path[this.pIndex];
        const angle = Phaser.Math.Angle.Between(this.x, this.y, next.x, next.y);

        // Normalize movement to ~60 FPS
        const move = this.speed * (delta / 16.67);

        this.x += Math.cos(angle) * move;
        this.y += Math.sin(angle) * move;

        this.updateHealthBar();
    }

    reachedBase() {
        this.scene.player?.updateHealth?.(this.damage);
        this.destroyWithCleanup();
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

        this.healthBarBg.clear().fillStyle(0x000000, 0.8).fillRect(x, y, w, h);
        this.healthBarFill.clear().fillStyle(color, 1).fillRect(x, y, w * hp, h);
    }

    die() {
        this.scene.player?.updateGold?.(this.reward);
        this.destroyWithCleanup();
    }

    // Combined destroy + cleanup
    destroyWithCleanup() {
        if (!this.active) return;

        this.healthBarBg?.destroy();
        this.healthBarFill?.destroy();

        this.healthBarBg = null;
        this.healthBarFill = null;

        this.destroy();
    }
}