import SaveManager from '../managers/SaveManager.js';
import AchievementManager from '../managers/AchievementManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import StatsManager from '../managers/StatsManager.js';


export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, stats, path) {
        super(scene, 0, 0, stats[0]);
        this.scene = scene;

        // Basic enemy setup from stats array: [name, id, health, speed, reward, lastFrame]
        [this.name, , this.maxHealth, this.speed, this.reward] = stats;
        this.damage = 1;  // All enemies deal 1 damage regardless of type
        this.health = this.maxHealth;
        this.path = path;

        if (!path?.length) {
            console.error("Invalid path:", path);
            return;
        }

        scene.add.existing(this);
        
        // Scale enemies appropriately - smaller scale for on-path positioning
        const scaleMap = {
            'Oni': 2,
            'Yokai': 1.1,
            'Skeleton': 1.1,
            'Orc': 1.1,
            'Firespawn': 1.4,
            'Plent': 1.1,
            'CurseWanderer': 1.1,
            'Slime': 1.4
        };
        
        const scale = scaleMap[this.name] || 1.5;
        
        this.setDepth(10).setScale(scale).setPosition(path[0].x, path[0].y);
        this.play(`${this.name}_walk`);

        this.pIndex = 0;

        // Health bar graphics grouped for easier cleanup
        this.bar = {
            bg: scene.add.graphics().setDepth(15),
            fill: scene.add.graphics().setDepth(16)
        };

        this.updateHealthBar();
    }

    update(_, delta) {
        if (!this.active || !this.path) return;

        const target = this.path[this.pIndex];
        if (!target) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        // Move to next point or reach base
        if (dist < 5 && ++this.pIndex >= this.path.length) return this.reachedBase();

        const next = this.path[this.pIndex];

        // Direction + frame-rate independent movement
        const angle = Phaser.Math.Angle.Between(this.x, this.y, next.x, next.y);
        const move = this.speed * (delta / 16.67);

        this.x += Math.cos(angle) * move;
        this.y += Math.sin(angle) * move;

        // Flip sprite based on direction (left or right)
        this.setFlipX(angle > Math.PI / 2 && angle < 3 * Math.PI / 2);

        this.updateHealthBar();
    }

    reachedBase() {
        // Damage player when enemy reaches end of path
        this.scene.player?.updateHealth?.(this.damage);
        this.cleanup();
    }

    takeDamage(amount) {
        // Reduce health and check death condition
        this.health -= amount;
        this.updateHealthBar();
        if (this.health <= 0) this.die();
    }

    updateHealthBar() {
        if (!this.bar) return;

        const w = 40, h = 6;

        const hp = Math.max(0, this.health / this.maxHealth);

        const color = hp < 0.25 ? 0xff0000 : hp < 0.5 ? 0xffff00 : 0x00ff00;

        this.bar.bg.clear().fillStyle(0x000).fillRect(this.x - w / 2, this.y - 40, w, h);
        this.bar.fill.clear().fillStyle(color).fillRect(this.x - w / 2, this.y - 40, w * hp, h);
    }

    die() {
        // Reward player on kill
        this.scene.player?.updateGold?.(this.reward);
        
        console.log("Enemy dying! Attempting to play audio...", { hasAudioManager: !!this.scene.audioManager });
        this.scene.audioManager?.playMonsterDeath();
        
        this.cleanup();

        StatsManager.incEnemiesKilled(1);
        AchievementManager.check({
            kill: SaveManager.getSlot().stats.enemiesKilled,
        });
    }

    cleanup() {
        // Safely remove enemy and UI elements
        if (!this.active) return;
        this.bar?.bg?.destroy();
        this.bar?.fill?.destroy();
        this.bar = null;
        this.destroy();
    }
}