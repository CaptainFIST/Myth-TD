import SaveManager from '../managers/SaveManager.js';
import AchievementManager from '../managers/AchievementManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import StatsManager from '../managers/StatsManager.js';
import TimeManager from '../managers/TimeManager.js';


export default class Tower extends Phaser.GameObjects.Sprite {
    // Tower configuration lookup tables
    static SCALES = { Promachus: 1, Kitsune: 0.9, Izanami: 2, Susanoo: 2.3, Nattvolva: 0.95, default: 0.9 };
    static OFFSETS = {
        Promachus: { x: 0, y: -25 },
        Kitsune: { x: -5, y: -28 },
        Satyr: { x: 5, y: -30 },
        Nattvolva: { x: 15, y: -40 },
        Izanami: { x: 10, y: -20 },
        Susanoo: { x: 0, y: -20 }
    };
    static PROJECTILE_TOWERS = new Set(['Susanoo', 'Promachus', 'Kitsune', 'Satyr', 'Nattvolva']);
    static PROJECTILE_DATA = {
        Susanoo: { sprite: 'Susanoo_Stripe', anim: 'Susanoo_Stripe_projectile', speed: 300, scale: 1.5 },
        Promachus: { sprite: 'Promachus_fire', anim: 'Promachus_fire_projectile', speed: 400, scale: 4.5 },
        Kitsune: { sprite: 'Kitsune_charge', anim: 'Kitsune_charge_projectile', speed: 350, scale: 3.5 },
        Satyr: { sprite: 'Satyr_leaf', anim: 'Satyr_leaf_projectile', speed: 300, scale: 3.5 },
        Nattvolva: { sprite: 'Nattvolva_dark', anim: 'Nattvolva_dark_projectile', speed: 320, scale: 3.5 }
    };

    constructor(scene, stats) {
        super(scene, 0, 0, stats[0]);
        this.scene = scene;

        // Tower stats: [name, damage, range, attackSpeed, idleEnd, attackEnd, affinityID]
        [this.name, this.damage, this.range, this.attackSpeed, this.idleEnd, this.attackEnd, this.affinityID] = stats;
        if (this.affinityID === undefined) this.affinityID = 0;

        this.attackDelay = 1000 / this.attackSpeed;

        this.pedestal = scene.add.image(0, 0, 'Pedestal').setDepth(9);
        this.projectiles = scene.add.group();

        // Attack timing/state control 
        this.timeSinceLastAttack = this.attackDelay;  // Set to delay so it can attack immediately
        this.isAttacking = false;
        this.damageDealt = false;

        scene.add.existing(this);
        const scale = this.constructor.SCALES[this.name] || this.constructor.SCALES.default;
        this.setDepth(10).setScale(scale).play(`${this.name}_idle`);

        // Reset tower after attack animation finishes
        this.on('animationcomplete', ({ key }) => {
            if (key === `${this.name}_attack`) {
                this.isAttacking = false;
                this.damageDealt = false;
                this.play(`${this.name}_idle`);
            }
        });

        this.affinityID = stats[6] || 0;
    }

    calculateDamage(enemy) {
        // Get the table from TowerManager's static property
        const table = this.scene.towerManager.constructor.towerAffinityCoeff;
        
        // Identify enemy type ID
        const enemyTypeID = enemy.affinityID || 0; 
        
        // Look up coefficient table [TowerRow][EnemyColumn]
        const coeff = table[this.affinityID][enemyTypeID];
        console.log(`${this.name} dealt ${this.damage*coeff} damage!`);
        return this.damage * coeff;
    }

    place(x, y) {
        const cx = x + 32, cy = y + 32;
        const offset = this.constructor.OFFSETS[this.name] || { x: 0, y: -20 };
        
        this.setPosition(cx + offset.x, cy + offset.y);
        this.pedestal.setPosition(cx, cy);

        // Reset attack cooldown when placed - set to delay so it can attack on first update
        this.timeSinceLastAttack = this.attackDelay;

        StatsManager.incTowersPlaced(1);
        AchievementManager.check({
            place: SaveManager.getSlot().stats.towersPlaced,
        });
    }

    update(time, delta) {
        if (!this.active) return;
        this.timeSinceLastAttack += delta;

        const enemy = this.getTargetEnemy();

        if (enemy && this.timeSinceLastAttack >= this.attackDelay) {
            this.fire(enemy);
            this.timeSinceLastAttack = 0;
        }

        // Direct-damage towers (non-projectile) - only if enemy exists
        if (this.isAttacking && enemy && !this.damageDealt && !this.constructor.PROJECTILE_TOWERS.has(this.name)) {
            const finalDamage = this.calculateDamage(enemy);
            enemy.takeDamage(finalDamage);
            this.damageDealt = true;
        }

        // Update all active projectiles
        this.projectiles.children.each(p => p.active && this.updateProjectile(p, delta));
    }

    // UPDATED: Attacks the enemy furthest along the path
    getTargetEnemy() {
        const enemies = this.scene.enemyManager?.activeEnemies?.getChildren();
        if (!enemies?.length) return null;

        let leadEnemy = null;
        let maxProgress = -1;
        const rangeInPixels = this.range * 64;

        for (const e of enemies) {
            if (!e.active) continue;

            const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            
            // Check if within range
            if (dist <= rangeInPixels) {
                // Priority: Use distanceTraveled which we added to Enemy.js
                if (e.distanceTraveled > maxProgress) {
                    maxProgress = e.distanceTraveled;
                    leadEnemy = e;
                }
            }
        }
        return leadEnemy;
    }

    getClosestEnemy() {
        const enemies = this.scene.enemyManager?.activeEnemies?.getChildren();
        if (!enemies?.length) return null;
        let closest = null, minDist = this.range * 64;

        for (const e of enemies) {
            if (!e.active) continue;
            const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            if (d < minDist) (minDist = d, closest = e);
        }
        return closest;
    }

    fire(enemy) {
        this.isAttacking = true;
        this.damageDealt = false;

        const anim = this.play(`${this.name}_attack`);

        if (anim && anim.anims) {
            anim.anims.msPerFrame = (1000/12) / (this.scene.TimeManager?.getScale() || 1);
        }

        this.scene.audioManager?.playTowerAttack();
        
        if (this.constructor.PROJECTILE_TOWERS.has(this.name)) {
            this.fireProjectile(enemy);
        }
    }

    fireProjectile(target) {
        if (!target) return; // No target for projectile attack
        
        const projData = this.constructor.PROJECTILE_DATA[this.name];
        if (!projData) return;
        
        const { sprite, anim, speed, scale } = projData;
        
        const p = this.scene.add.sprite(this.x, this.y, sprite)
            .setDepth(5).setScale(scale).play(anim);
        Object.assign(p, {
            targetEnemy: target,
            speed,
            hasHit: false
        });
        this.projectiles.add(p);
    }

    updateProjectile(p, delta) {
        const t = p.targetEnemy;
        if (!t?.active) return p.destroy();

        const angle = Phaser.Math.Angle.Between(p.x, p.y, t.x, t.y);
        const move = p.speed * (delta / 1000);

        p.x += Math.cos(angle) * move;
        p.y += Math.sin(angle) * move;
        p.rotation = angle;

        // Collision check with enemy
        if (!p.hasHit && Phaser.Math.Distance.Between(p.x, p.y, t.x, t.y) < 20) {
            p.hasHit = true;

            const finalDamage = this.calculateDamage(t);
            t.takeDamage(finalDamage);

            return p.destroy();
        }

        // Cleanup if projectile leaves screen
        const { width, height } = this.scene.scale;
        if (p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
            p.destroy();
        }
    }

    destroy(fromScene) {
        if (this._destroyed) return;
        this._destroyed = true;
        this.pedestal?.destroy();
        this.projectiles?.clear(true, true);
        super.destroy(fromScene);
    }
}