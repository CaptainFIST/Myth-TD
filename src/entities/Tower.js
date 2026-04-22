export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, stats) {
        super(scene, 0, 0, stats[0], 0);
        this.scene = scene;

        // [name, damage, range, attackSpeed]
        [this.name, this.damage, this.range, this.attackSpeed] = stats;
        this.attackDelay = this.attackSpeed * 1000;

        this.pedestal = scene.add.image(0, 0, 'Pedestal').setDepth(9);

        // Attack state
        this.nextTic = scene.time.now + this.attackDelay;
        this.isAttacking = false;
        this.damageDealt = false;

        this.projectiles = scene.add.group();

        scene.add.existing(this);
        this.setDepth(10).setScale(2).play(`${this.name}_idle`);

        // Reset after attack animation
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
        if (!this.active) return;

        const enemy = this.getClosestEnemy();

        // Attack if ready
        if (enemy && time > this.nextTic && !this.isAttacking) {
            this.fire(time, enemy);
        }

        // Deal direct damage (non-projectile towers)
        if (this.isAttacking && !this.damageDealt && enemy && this.name !== 'Susanoo') {
            enemy.takeDamage(this.damage);
            this.damageDealt = true;
        }

        // Update projectiles
        this.projectiles.children.each(p => p.active && this.updateProjectile(p, delta));
    }

    getClosestEnemy() {
        const enemies = this.scene.enemyManager?.activeEnemies?.getChildren();
        if (!enemies?.length) return null;

        let closest = null;
        let minDist = this.range * 64;

        for (const e of enemies) {
            if (!e.active) continue;

            const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            if (d < minDist) {
                minDist = d;
                closest = e;
            }
        }

        return closest;
    }

    fire(time, enemy) {
        this.isAttacking = true;
        this.damageDealt = false;

        this.play(`${this.name}_attack`);
        this.nextTic = time + this.attackDelay;

        if (this.name === 'Susanoo') this.fireProjectile(enemy);
    }

    fireProjectile(target) {
        const p = this.scene.add.sprite(this.x, this.y, 'Susanoo_Stripe')
            .setDepth(5)
            .setScale(1.5)
            .play('Susanoo_Stripe_projectile');

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

        // Destroy if target is gone
        if (!t?.active) return p.destroy();

        const angle = Phaser.Math.Angle.Between(p.x, p.y, t.x, t.y);
        const move = p.speed * (delta / 1000);

        p.x += Math.cos(angle) * move;
        p.y += Math.sin(angle) * move;
        p.rotation = angle;

        // Hit detection
        if (!p.hasHit && Phaser.Math.Distance.Between(p.x, p.y, t.x, t.y) < 20) {
            p.hasHit = true;
            t.takeDamage(this.damage); // safer than p.tower.damage
            return p.destroy();
        }

        // Remove if off screen
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