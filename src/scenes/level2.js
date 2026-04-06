import TimeManager from '../managers/TimeManager.js';
export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }
    
    static mapData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    static decoData = [
    [0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
    [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0]
  ];

    static tileTypes = {
        0: 'snow',
        1: 'path'
    };
    static decoTypes = {
        2: 'rock'
    };
    
    preload() {
        this.load.image('snow', 'assets/tiles/level2/snow.png');
        this.load.image('path', 'assets/tiles/level2/snow_path.png');
        this.load.image('rock', 'assets/decorations/level2/snowy_rock.png');
        this.load.image('UI', 'assets/UI/UI.png');

    }
    create() {
        this.scene.launch('MapManager', { level: this.constructor });
<<<<<<< HEAD
        // this.timeManager = new TimeManager();
        
        //         this.timerText = this.add.text(16, 16, 'Time: 0.00s', {
        //             fontSize: '18px',
        //             color: '#000000',
        //             fontStyle: 'bold',
        //             fontFamily: 'Arial, sans-serif'
        //         }).setDepth(10);
    }

    // update(time, delta) {
    //     this.timeManager.update(delta);
    //     const elapsedTime = this.timeManager.getTime().toFixed(2);
    //     this.timerText.setText(`Time: ${elapsedTime}s`);
    // }

=======
        this.timeManager = new TimeManager();
        this.add.image(1280/2, 720-49, 'UI');
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
>>>>>>> experimental-EE
}