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

        this.scene.add.existing(this);
        this.setDepth(10);
        this.setScale(2);
        this.play(`${this.name}_idle`);

        this.on('animationcomplete', (animation) => {
            if (animation.key === `${this.name}_attack`) {
                this.isAttacking = false;
                this.play(`${this.name}_idle`);
            }
        });
    }

    place(x, y) {
        const centerX = x + 32;
        const centerY = y + 32;

        // vertical shift for towers
        const verticalOffset = 20;
        this.x = centerX;
        this.y = centerY - verticalOffset;

        this.pedestal.setPosition(centerX, centerY);

        this.nextTic = this.scene.time.now + (this.attackSpeed * 1000);
    }

    update(time, delta) {
        if (time > this.nextTic && !this.isAttacking) {
            /* Enemy targeting
            const enemy = this.getClosestEnemy();
            if (enemy && distanceTo(enemy) < this.range) {
                this.fire(time);
            }
            */
        }
    }

    fire(time) {
        this.isAttacking = true;
        this.play(`${this.name}_attack`);

        this.nextTic = time + (this.attackSpeed * 1000);

        console.log(`${this.name} fired! Next shot in ${this.attackSpeed}s`);
    }

    destroy(fromScene) {
        if (this.pedestal) {
            this.pedestal.destroy();
        }
        super.destroy(fromScene);
    }
}