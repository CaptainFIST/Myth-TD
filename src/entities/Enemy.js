export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, stats, path) {
        super(scene, 0, 0, stats[0], 0);

        this.scene = scene;
        this.name = stats[0];
        this.damage = stats[1];
        this.health = stats[2];
        this.speed = stats[3];
        this.reward = stats[4];

        

        this.scene.add.existing(this);
        this.setDepth(10);
        this.setScale(2);

        if (!path || path.length === 0) {
            console.error("❌ Enemy spawned with invalid path:", path);
            return;
        }
        this.path = path;
        this.pIndex = 0;

    

        // Start at first path point
        this.setPosition(this.path[0].x, this.path[0].y);

        this.play(`${this.name}_walk`);

    }

    update(time, delta) {
        if (this.pIndex >= this.path.length) return;

        const target = this.path[this.pIndex];

        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (dist < 5) {
            this.pIndex++;

            // Reached end
            if (this.pIndex >= this.path.length) {
                this.reachedBase();
                return;
            }
        }

        const next = this.path[this.pIndex];

        const angle = Phaser.Math.Angle.Between(this.x, this.y, next.x, next.y);

        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    
    }

    reachedBase() {
        //console.log(`${this.name} reached the base!`);

        // Damage player here later
        this.scene.player.updateHealth(this.damage);
        this.destroy();
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        //this.scene.levelManager.addGold(this.reward);
        this.destroy();
    }
}


/*



*/