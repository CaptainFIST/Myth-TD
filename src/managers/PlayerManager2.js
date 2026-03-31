export default class PlayerManage {
    constructor(scene, x, y, config = {}, audioManager = null) {
        this.scene = scene;
        
        

        

        //Player Manager stats
        this.inventory = [];
        this.gold = 0;
        this.playerHealth = 20;

        //Gold Stats
        this.goldPerSec = 5;
        this.incInterval = 2000;
        this.incomeStart();


    }

    incomeStart() {
        this.incomeTimer = this.scene.time.addEvent({
            delay: this.incInterval,
            callback: this.income,
            callbackScope: this,
            loop: true
        });
    }

    income() {
        this.gold += this.goldPerSec;
        if (this.scene.debug) {
            console.log(`🌾 Farm income: +${this.goldPerSec} gold (Total: ${this.scene.gold})`);
        }
        
    }

    updateHealth(damage) {
        

        if(this.playerHealth != 0)
        {
            if(damage >= this.playerHealth)
            {
                this.playerHealth -= damage;
                console.log(`Player took ${damage} damage!`);
            }
            else
            {
                this.playerHealth -= this.playerHealth;
                console.log(`Player took ${this.playerHealth} damage!`);
            }
        }
    }

    isHealthZero() {
        
        return this.playerHealth == 0 ? true : false;
    }

    updateGold(change) {
        

        if(change > 0)
        {
            this.gold += change;
        }
        else if(change < 0)
        {
            if(Math.abs(change) <= this.gold)
            {
                this.gold -= change;
            }
            
        }
    }


    resetStats() {
        this.inventory = [];
        this.gold = 0;
        this.playerHealth = 20;
        console.log('✓ Progress reset!');
    }

    

    

    

        

    

    

    

    

    

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