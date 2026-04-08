import PlayerManager from '../managers/PlayerManager.js';

export default class UIManager extends Phaser.Scene {
    constructor() {
        super({ key: 'UIManager' });
    }

    preload() {
        this.load.image('UI', 'assets/UI/UI.png');
        this.load.image('UIHP', 'assets/UI/UIHP.png');
    }

    create() {
        // ui positioning
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const uiXPos = gameWidth / 2;
        const uiYPos = gameHeight - 49;
        this.add.image(uiXPos, uiYPos, 'UI');

        // hp bauble
        this.hpMax = 20;
        this.hpFrameX = 0 + 49;
        this.hpFrameY = uiYPos -6;
        const hpFrame = this.add.image(this.hpFrameX, this.hpFrameY, 'UIHP');
        hpFrame.setDepth(2);
        this.hpRadius = 78 / 2;

        // hp blood fill
        this.hpFill = this.add.graphics();
        this.hpFill.setDepth(1);

        this.hpCircleMask = this.add.graphics();
        this.hpCircleMask.fillStyle(0xffffff);
        this.hpCircleMask.fillCircle(this.hpFrameX, this.hpFrameY, this.hpRadius);
        this.hpCircleMask.setVisible(false);

        // hp fill logic
        const mask = this.hpCircleMask.createGeometryMask();
        this.hpFill.setMask(mask);


        // player data
        this.player = new PlayerManager();
        this.testingPlayerMethods();
        //this.testingPlayerMethods();

        const playerHP = this.player.playerHealth;
        const playerGold = this.player.gold;

        this.healthText = this.add.text(this.hpFrameX, this.hpFrameY, `${playerHP} / ${this.hpMax}`, {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setDepth(3);

        this.updateHealthCircle(playerHP);
    }

    updateHealthCircle(currentHP) {
        // init values and coordinates
        const centerX = this.hpFrameX; 
        const centerY = this.hpFrameY;

        // % scaling of mask
        let healthPercent = currentHP / this.hpMax;
        healthPercent = Phaser.Math.Clamp(healthPercent, 0, 1);

        // clear mask
        this.hpFill.clear();
        
        // fill hp
        this.hpFill.fillStyle(0xCD1C18, 1);
        const totalHeight = this.hpRadius * 2;
        const fillHeight = totalHeight * healthPercent;

        // hp "liquid" object (rectangle)
        this.hpFill.fillRect(
            centerX - this.hpRadius,                 // X (left edge)
            (centerY + this.hpRadius) - fillHeight,  // Y (top of the liquid)
            totalHeight,                        // Width (covers the whole orb)
            fillHeight                          // Height (the liquid itself)
        );

        // "glowing" liquid edge
        // Only draw the line if health is between 1% and 99%
        if (healthPercent > 0.01 && healthPercent < 0.99) {
            this.hpFill.lineStyle(2, 0xff0000, 1); 
            const lineY = (centerY + this.hpRadius) - fillHeight;
        
            // This math calculates the width of the circle at the current liquid height
            // so the red line doesn't poke out of the sides
            const dy = Math.abs(lineY - centerY);
            const lineWidth = Math.sqrt(Math.pow(this.hpRadius, 2) - Math.pow(dy, 2)) * 2;
        
            this.hpFill.lineBetween(centerX - (lineWidth/2), lineY, centerX + (lineWidth/2), lineY);
        }

        this.healthText.setText(`${currentHP} / ${this.hpMax}`);
    }

    testingPlayerMethods() {
        console.log(`player health is ${this.player.playerHealth}`);
        console.log(`Player gold is ${this.player.gold}`);
        console.log(`Is health zero: ${this.player.isHealthZero()}`);

        console.log(`Testing functions:`);
        this.player.updateGold(50);
        console.log(`Player gold is ${this.player.gold}`);
        this.player.updateHealth(10);
        console.log(`player health is ${this.player.playerHealth}`);
        console.log(`Is health zero: ${this.player.isHealthZero()}`);
    }
}