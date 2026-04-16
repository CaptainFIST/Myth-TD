export default class LoseScreen extends Phaser.Scene {
    constructor() {
        super({key: 'LoseScreen'});
        // fallback in case no data passed
        // this.level = 1;
        // this.levelType = 'MainScene'; // Track which level just lost
    }

    // init(data) {
    //     // data passed via scene.launch or scene.start
    //     if (data && typeof data.level === 'number') {
    //         this.level = data.level;
    //     }
    // }

    create(data) {
    

         const { width, height } = this.scale;

         // Background with gradient effect
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a0000).setDepth(-1);
        this.add.rectangle(width / 2, height / 2, width, height, 0x2d0000).setDepth(-1).setAlpha(0.5);

    //     // Overlay (interactive so clicks don't fall through to underlying scene)
    //     const overlayRect = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
    //         .setDepth(2999)
    //         .setAlpha(0.85)
    //         .setInteractive();
    //     // prevent any clicks on the overlay from doing anything else
    //     overlayRect.on('pointerdown', () => {});

    //     // Decide level type based on the number provided during launch.
    //     // This is more reliable than querying scene.isActive() because the
    //     // originating scene may already have been stopped by the time this
    //     // create() method runs.
    //     switch (this.level) {
    //         case 2:
    //             this.levelType = 'Level2Scene';
    //             break;
    //         case 3:
    //             this.levelType = 'Level3Scene';
    //             break;
    //         case 4:
    //             this.levelType = 'Level4Scene';
    //             break;
    //         default:
    //             this.levelType = 'MainScene';
    //             break;
    //     }

         // Loss message with animation
        const title = this.add.text(width / 2, height / 2 - 150, 'DEFEAT', {
            fontSize: '96px',
            fill: '#ff4444',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#ff0000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(3000);

        this.tweens.add({
            targets: title,
            y: height / 2 - 140,
            duration: 600,
            ease: 'Elastic.easeOut',
            useFrames: false
        });


         // Subtitle
        this.add.text(width / 2, height / 2 - 70, 'Your castle has fallen...', {
            fontSize: '32px',
            fill: '#ff6666',
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5).setDepth(3000);

    //     // Retry button
    //     this.createButton(width / 2 - 180, height / 2 + 140, 'RETRY', '#ef4444', () => {
    //         // Phaser's scene.start will automatically shut down the current
    //         // (LoseScene) and any existing instance of the target level.
    //         let levelName;
    //         switch (this.levelType) {
    //             case 'Level2Scene':
    //                 levelName = 'Level2Scene';
    //                 break;
    //             case 'Level3Scene':
    //                 levelName = 'Level3Scene';
    //                 break;
    //             case 'Level4Scene':
    //                 levelName = 'Level4Scene';
    //                 break;
    //             default:
    //                 levelName = 'MainScene';
    //                 break;
    //         }
    //         this.scene.start(levelName);
    //     });

    this.levelNumber = data.sceneL.level || 0;

    this.createButton(width / 2 - 180, height / 2 + 140, 'RETRY', '#ef4444', () => {
        switch(this.levelNumber) {
            case 1: 
                this.scene.start('Level1');
                break;
            case 2:
                this.scene.start('Level2');
                break;
            default:
                break;
        }
    } );
    

    //     // Return to menu button
    //     this.createButton(width / 2 + 180, height / 2 + 140, 'MENU', '#6366f1', () => {
    //         // stop whichever level was active (safe even if already stopped)
    //         if (this.levelType === 'Level2Scene') {
    //             this.scene.stop('Level2Scene');
    //         } else if (this.levelType === 'Level3Scene') {
    //             this.scene.stop('Level3Scene');
    //         } else if (this.levelType === 'Level4Scene') {
    //             this.scene.stop('Level4Scene');
    //         } else {
    //             this.scene.stop('MainScene');
    //         }
    //         this.scene.start('MenuScene');
    //     });

        this.createButton(width / 2 + 180, height / 2 + 140, 'MENU', '#6366f1', () => {
            this.scene.start('MainMenu');
        } );
    
     }

    createButton(x, y, text, color, callback) {
        const buttonBg = this.add.rectangle(x, y, 300, 70, color).setDepth(3000)
            .setStrokeStyle(2, '#ffffff');
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            letterSpacing: 1
        }).setOrigin(0.5).setDepth(3001);

        buttonBg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                buttonBg.setScale(1.08);
                buttonText.setScale(1.08);
            })
            .on('pointerout', () => {
                buttonBg.setScale(1);
                buttonText.setScale(1);
            })
            .on('pointerdown', callback);
    }
}
