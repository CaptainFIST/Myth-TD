export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, stats) {
        super(scene, 0, 0, stats[0], 0);

        this.scene = scene;
        this.name = stats[0];
        this.damage = stats[1];
        this.range = stats[2];
        this.attackSpeed = stats[3];

        this.pedestal = this.scene.add.image(0, 0, 'Pedestal');
        this.pedestal.setDepth(9);

        this.nextTic = this.scene.time.now + (this.attackSpeed * 1000);
        this.isAttacking = false;
        this.damageDealt = false; 

        this.scene.add.existing(this);
        this.setDepth(10);
        this.setScale(2);
        this.play(`${this.name}_idle`);

        this.on('animationcomplete', (animation) => {
            if (animation.key === `${this.name}_attack`) {
                this.isAttacking = false;
                this.damageDealt = false; 
                this.play(`${this.name}_idle`);
            }
        });
    }

    place(x, y) {
        const centerX = x + 32;
        const centerY = y + 32;

        const verticalOffset = 20;
        this.x = centerX;
        this.y = centerY - verticalOffset;

        this.pedestal.setPosition(centerX, centerY);
        this.nextTic = this.scene.time.now + (this.attackSpeed * 1000);
    }

    update(time, delta) {
        if (time > this.nextTic && !this.isAttacking) {
            const enemy = this.getClosestEnemy();
            if (enemy) {
                this.fire(time, enemy);
            }
        }
        
        if (this.isAttacking && !this.damageDealt) {
            const enemy = this.getClosestEnemy();
            if (enemy) {
                enemy.takeDamage(this.damage);
                console.log(`${this.name} hit ${enemy.name} for ${this.damage} damage! (${enemy.health} HP remaining)`);
                this.damageDealt = true;
            }
        }
    }

    getClosestEnemy() {
        if (!this.scene.enemyManager) return null;
        
        const enemies = this.scene.enemyManager.activeEnemies.getChildren();
        let closest = null;
        let closestDist = this.range * 64; 
        
        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                this.x, this.y,
                enemy.x, enemy.y
            );
            
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        });
        return closest;
    }

    fire(time, enemy) {
        this.isAttacking = true;
        this.damageDealt = false;
        this.play(`${this.name}_attack`);
        this.nextTic = time + (this.attackSpeed * 1000);
        console.log(`${this.name} attacking ${enemy.name}!`);
    }

    destroy(fromScene) {
        if (this._destroyed) return;

    this._destroyed = true;

    if (this.pedestal) {
        this.pedestal.destroy();
        this.pedestal = null;
    }

    super.destroy(fromScene);
    }
}

/** 
 
*/