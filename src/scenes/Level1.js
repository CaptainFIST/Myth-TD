import TimeManager from '../managers/TimeManager.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    static mapData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
        [0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1],
        [0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    static decoData = [
<<<<<<< HEAD
    [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
=======
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
>>>>>>> experimental-EE
    ];

    static tileTypes = {
        0: 'grass',
        1: 'path'
    };

    static decoTypes = {
        2: 'tree'
    };

    preload() {
        this.load.image('grass', 'assets/tiles/level1/grass_new.png');
        this.load.image('path', 'assets/tiles/level1/dirt_path.png');
        this.load.image('tree', 'assets/decorations/tree1.png');
        this.load.image('UI', 'assets/UI/UI.png');
    }

<<<<<<< HEAD
    create() {
        this.scene.launch('MapManager', { level: this.constructor });

        // this.timeManager = new TimeManager();
        this.scene.launch('UIManager');

        // this.timerText = this.add.text(16, 16, 'Time: 0.00s', {
        //     fontSize: '18px',
        //     color: '#000000',
        //     fontStyle: 'bold',
        //     fontFamily: 'Arial, sans-serif'
        // }).setDepth(10);
    }
    // update(time, delta) {
    //     this.timeManager.update(delta);
    //     const elapsedTime = this.timeManager.getTime().toFixed(2);
    //     this.timerText.setText(`Time: ${elapsedTime}s`);
    // }



        

=======
    createButton(x, y, label, onClick) {
        const bg = this.add.rectangle(x, y, 160, 80, 0x000000)
            .setOrigin(0).setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true }).setDepth(20);
        const text = this.add.text(x + 80, y + 40, label, {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 3
        }).setOrigin(0.5).setDepth(21);
        bg.on('pointerover', () => bg.setFillStyle(0x222222));
        bg.on('pointerout', () => bg.setFillStyle(0x000000));
        return { bg, text };
    }

    create() {
        this.scene.launch('MapManager', { level: this.constructor });
        this.timeManager = new TimeManager();
        this.add.image(1280 / 2, 720 - 49, 'UI');

        this.timerText = this.add.text(16, 16, 'Time: 0.00s', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setDepth(10);
        
        const startY = 655;
        this.createButton(20, startY, 'Purchase Tower\n50 g', () => { this.isPlacingTower = true;});
        const rightStartX = this.scale.width - 360; 
        const buttonWidth = 160;
        const rightButtons = [
            { label: 'Merge', action: () => {}},
            { label: 'Inventory', action: () => {}}
        ];
        rightButtons.forEach((btn, i) => {
            this.createButton(rightStartX + i * (buttonWidth + 10), startY, btn.label, btn.action);
        });
    }

    update(time, delta) {
        this.timeManager.update(delta);
        const elapsedTime = this.timeManager.getTime().toFixed(2);
        this.timerText.setText(`Time: ${elapsedTime}s`);
    }
>>>>>>> experimental-EE
}