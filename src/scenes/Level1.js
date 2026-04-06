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
    }

    create() {
        this.scene.launch('MapManager', { level: this.constructor });
<<<<<<< HEAD
        // this.timeManager = new TimeManager();

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
        this.scene.launch('UIManager');
        this.timeManager = new TimeManager();

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
        this.timerText.setText(`Time: ${elapsedTime}s`);
    }
>>>>>>> experimental-JR
}