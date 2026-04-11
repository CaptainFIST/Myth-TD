export default class PlayerManager {
    constructor(scene) {
        this.scene = scene;

        //this.level = level;
        //Player Manager stats
        
        this.gold = 150;
        this.playerHealth = 20;
        
        //Gold Stats
        this.goldPerSec = 2;
        this.incInterval = 1000;
        //this.incomeStart();
        if(scene != null)
        {
            console.log(this.scene);
            //this.incomeStart();
        }
        



    }

    incomeStart() {
        // this.incomeTimer = this.TimeManager.getTime.addEvent({
        //     delay: this.incInterval,
        //     callback: this.income,
        //     callbackScope: this,
        //     loop: true
        // });
        
        // this.incomeTimer = this.elapsed.addEvent({
        //     delay: this.incInterval,
        //     callback: this.income,
        //     callbackScope: this,
        //     loop: true
        // });

        // this.incomeTimer = this.time.addEvent({
        //     delay: 1000, 
        //     loop: true,
        //     callback: () => {
        //         income();
        //     }
        //});


    }

    income() {
        this.gold += this.goldPerSec;

        console.log(`🌾 Farm income: +${this.goldPerSec} gold (Total: ${this.gold})`);
    }

    updateHealth(damage) {
        this.playerHealth = Math.max(0, this.playerHealth - damage);
    }

    isHealthZero() {
        return this.playerHealth === 0;    
    }

    updateGold(change) {
        
        if(change > 0)
        {
            this.gold -= change;
            console.log(`${change} gold added`);
        }
        else if(change < 0)
        {
            if(Math.abs(change) <= this.gold)
            {
                this.gold += change;
                console.log(`${change} used`);
            }
        }
    }


    displayHealth() {
        healthText = add.text(256, 16, `Health: ${this.playerHealth}`, {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setDepth(10);
    }


    // resetStats() {
    //     this.inventory = [];
    //     this.gold = 0;
    //     this.playerHealth = 20;
    //     console.log('✓ Stats reset!');
    // }

    
    


    createFloatingText(x, y, text, color) {
        const floatingText = this.scene.add.text(x, y, text, {
            fontSize: '28px',
            fill: color,
            fontStyle: 'bold',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5).setDepth(2000);

        const shadowOffset = 4;
        const shadow = this.scene.add.text(x + shadowOffset, y + shadowOffset, text, {
            fontSize: '28px',
            fill: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial',
            alpha: 0.3
        }).setOrigin(0.5).setDepth(1999);

        this.scene.tweens.add({
            targets: [floatingText, shadow],
            y: y - 80,
            alpha: 0,
            duration: 1200,
            ease: 'Quad.easeOut',
                       useFrames: false,
            onComplete: () => {
                floatingText.destroy();
                shadow.destroy();
            }
        });
    } 
}