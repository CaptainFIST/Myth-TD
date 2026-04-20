export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, stats) {
        super(scene, 0, 0, stats[0], 0);
        this.scene = scene;

        // Destructure tower stats: name, damage, range, attack speed
        [this.name, this.damage, this.range, this.attackSpeed] = stats;
        this.attackDelay = this.attackSpeed * 1000;
        this.pedestal = scene.add.image(0, 0, 'Pedestal').setDepth(9);

        // Attack state control
        this.nextTic = scene.time.now + this.attackDelay;
        this.isAttacking = false;
        this.damageDealt = false;
        this.projectiles = scene.add.group();

        scene.add.existing(this);
        this.setDepth(10).setScale(2).play(`${this.name}_idle`);

        // When attack animation ends, reset state back to idle
        this.on('animationcomplete', ({ key }) => {
            if (key === `${this.name}_attack`) {
                this.isAttacking = false;
                this.damageDealt = false;
                this.play(`${this.name}_idle`);
            }
        });
    }

    place(x, y) {
        const cx = x + 32, cy = y + 32;
        this.setPosition(cx, cy - 20);
        this.pedestal.setPosition(cx, cy);
        this.nextTic = this.scene.time.now + this.attackDelay;
    }

    update(time, delta) {
        const enemy = this.getClosestEnemy();

        // Attack if ready and not already attacking
        if (time > this.nextTic && !this.isAttacking && enemy) {
            this.fire(time, enemy);
        }

        // Deal damage once per attack (except projectile towers)
        if (this.isAttacking && !this.damageDealt && enemy && this.name !== 'Susanoo') {
            enemy.takeDamage(this.damage);
            this.damageDealt = true;
        }
        this.projectiles.children.each(p => p.active && this.updateProjectile(p, delta));
    }

    getClosestEnemy() {
        // Safely access enemy list
        const enemies = this.scene.enemyManager?.activeEnemies.getChildren();
        if (!enemies) return null;

        let closest = null;
        let minDist = this.range * 64; // Convert tile range to pixels

        // Find nearest enemy within range
        enemies.forEach(e => {
            const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            if (d < minDist) {
                minDist = d;
                closest = e;
            }
        });
        return closest;
    }

    fire(time, enemy) {
        // Start attack animation and reset damage flag
        this.isAttacking = true;
        this.damageDealt = false;
        this.play(`${this.name}_attack`);
        this.nextTic = time + this.attackDelay;
        if (this.name === 'Susanoo') this.fireProjectile(enemy);
    }

    fireProjectile(target) {
        // Create projectile sprite and play animation
        const p = this.scene.add.sprite(this.x, this.y, 'Susanoo_Stripe')
            .setDepth(5).setScale(1.5).play('Susanoo_Stripe_projectile');
        Object.assign(p, {
            targetEnemy: target,
            tower: this,
            speed: 300,
            hasHit: false
        });
        this.projectiles.add(p);
    }

    updateProjectile(p, delta) {
        const t = p.targetEnemy;
        if (!t?.active) return p.destroy();

        // Move projectile toward target
        const angle = Phaser.Math.Angle.Between(p.x, p.y, t.x, t.y);
        const move = p.speed * (delta / 1000);
        p.x += Math.cos(angle) * move;
        p.y += Math.sin(angle) * move;
        p.rotation = angle;

        // Check collision with target
        if (!p.hasHit && Phaser.Math.Distance.Between(p.x, p.y, t.x, t.y) < 20) {
            p.hasHit = true;
            t.takeDamage(p.tower.damage);
            return p.destroy();
        }

        // Remove projectile if it goes off screen
        const { width, height } = this.scene.scale;
        if (p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
            p.destroy();
        }
    }

    destroy(fromScene) {
        // Prevent double-destroy bugs
        if (this._destroyed) return;
        this._destroyed = true;
        this.pedestal?.destroy();
        this.projectiles?.clear(true, true);
        super.destroy(fromScene);
    }
}