export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, stats) {
        super(scene, 0, 0, stats[0], 0);

        this.scene = scene;
        this.name = stats[0];
        this.damage = stats[1];
        this.range = stats[2];
        this.attackSpeed = stats[3];

        this.nextTic = 0;

        this.scene.add.existing(this);

        this.setDepth(10);
        this.play(`${this.name}_idle`);
    }

    place(x, y) {
        this.x = x + 32;
        this.y = y + 32;
    }

    update(time, delta) {
        if (time > this.nextTic) {
            this.fire(time);
        }
    }

    fire(time) {
        // Only trigger attack if the animation exists 
        // and we aren't already playing it
        if (this.anims.currentAnim.key !== `${this.name}_attack`) {
            this.play(`${this.name}_attack`);

            this.once('animationcomplete', () => {
                this.play(`${this.name}_idle`);
            });
        }

        this.nextTic = time + (this.attackSpeed * 1000);
    }
}