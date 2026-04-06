import PlayerManager from '../managers/PlayerManager.js';
import TimeManager from '../managers/TimeManager.js';

export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    create(data) {



        this.player = new PlayerManager(this);
        this.timeManager = new TimeManager();

        //this.displayHealth();
        this.testingPlayerMethods();
        //this.testingPlayerMethods();
        //this.player.incomeStart();
        this.c = 0;



        const level = data.level;
        const mapData = level.mapData;
        const decoData = level.decoData;
        const tileTypes = level.tileTypes;
        const decoTypes = level.decoTypes;

        const tileSize = 64;
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const tileKey = tileTypes[mapData[row][col]];
                const decoKey = decoTypes[decoData[row][col]];
                const x = col * tileSize;
                const y = row * tileSize;
                if (tileKey) {
                    this.add.image(x, y, tileKey).setOrigin(0);
                }
                if (decoKey) {
                    this.add.image(x, y, decoKey).setOrigin(0.5);
                }
            }
        }

        this.displayHealth();
        this.displayGold();
        this.displayTime();
        //this.testingPlayerMethods();
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

    displayHealth() {
        this.healthText = this.add.text(256, 16, `Health: ${this.player.playerHealth}`, {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setDepth(10);
    }

    displayGold() {
        this.goldText = this.add.text(360, 16, `Gold: ${this.player.gold}`, {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setDepth(10);
    }

    displayTime() {
                this.timerText = this.add.text(16, 16, 'Time: 0.00s', {
                    fontSize: '18px',
                    color: '#000000',
                    fontStyle: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }).setDepth(10);
    }

    update(time, delta) {
        this.timeManager.update(delta);
        const elapsedTime = this.timeManager.getTime().toFixed(2);

        if(elapsedTime % 2 == 0){
            this.player.income();
            console.log(`${++this.c} and ${elapsedTime}`);
        }
        
        this.timerText.setText(`Time: ${elapsedTime}s`);
        this.goldText.setText(`Gold: ${this.player.gold}`);
        this.healthText.setText(`Health: ${this.player.playerHealth}`);
    }

    //incomeStart() {
        // this.incomeTimer = this.TimeManager.getTime.addEvent({
        //     delay: this.incInterval,
        //     callback: this.income,
        //     callbackScope: this,
        //     loop: true
        // });
        //
        // this.incomeTimer = this.elapsed.addEvent({
        //     delay: this.incInterval,
        //     callback: this.income,
        //     callbackScope: this,
        //     loop: true
        // });


    //}

    



}