export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu'});
    }
    
    preload() {
        this.load.image('gameTitle','assets/Titles/gameTitle.png');
        this.load.image('subtitleImage','assets/Titles/subtitleimage.png');
    }

    create() {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0d1128).setOrigin(0.5);
        this.add.image(width / 2, 120, 'gameTitle');
        this.add.image(width / 2, 280, 'subtitleImage');
        this.createBackground();

        const buttonData = [
            {text: 'PLAY', icon: '▶', action: () => this.scene.start('LevelSelect')},
            {text: 'TUTORIAL', icon: '📚', action: () => this.scene.start('Tutorial') },
            {text: 'ACHIEVEMENTS', icon: '🏆'},
            {text: 'SETTINGS', icon: '⚙', action: () => this.scene.start('SettingsMenu')},
<<<<<<< HEAD
            {text: 'EXIT', icon: '✕', action: () => window.close()}
=======
            {text: 'EXIT', icon: '✕'}
>>>>>>> main
        ];
        const startY = 350;
        const leftx = 200;
        const spacing = 80;
        
        buttonData.forEach((btn, index) => {
            const ypos = startY + index * spacing;
            const button = this.add.text(leftx, ypos, `${btn.icon} ${btn.text}`, {
                fontSize: '20px',
                color: '#06b6d4',
                fontStyle: 'bold',
                align: 'left',
                fontFamily: 'Arial, sans-serif'
            }).setOrigin(0.5).setInteractive({useHandCursor: true});

            button.on('pointerover', () => button.setStyle({fill: "#7c3aed"}));
            button.on('pointerout', () => button.setStyle({fill: '#06b6d4'}));
            if (btn.action) {
                button.on('pointerdown', btn.action);
            }
            const box = this.add.rectangle(leftx, ypos, 280, 60, 0x0f1534, 0.7).setStrokeStyle(3, 0x000000).setOrigin(0.5);
            box.setDepth(1);
            button.setDepth(2);
        }); 

        //this.createAudioUI();
    }

    createBackground() {
        const { width, height } = this.scale;
        this.bgGraphics = this.add.graphics();
        this.circles = [];

        for (let i = 0; i < 20; i++) {
            this.circles.push({
                x: Phaser.Math.Between(0, width),
                y: Phaser.Math.Between(0, height),
                radius: Phaser.Math.Between(20, 60),
                alpha: Phaser.Math.FloatBetween(0.05, 0.15),
                speed: Phaser.Math.FloatBetween(0.1, 0.4)
            });
        }
    }

<<<<<<< HEAD
    /*
=======
>>>>>>> main
    createAudioUI() {
        const { width } = this.scale;
        const iconX = width - 160;
        const iconY = 50;

        this.add.circle(iconX, iconY, 20, 0x7c3aed);
        this.add.text(iconX, iconY, '🔊', { fontSize: '18px' }).setOrigin(0.5);
        const sliderX = width - 150; 
        const sliderY = 50;

        this.add.rectangle(sliderX + 70, sliderY, 100, 6, 0x333333);  
        this.add.rectangle(sliderX + 20, sliderY, 40, 6, 0x7c3aed).setOrigin(0, 0.5); 
        this.add.circle(sliderX + 60, sliderY, 8, 0x7c3aed);       
    }
    */

    update() {
        this.bgGraphics.clear();
        this.bgGraphics.fillStyle(0x66ccff, 0.05);

        this.circles.forEach(c => {
            c.y -= c.speed;
            if (c.y + c.radius < 0) {
                c.y = this.scale.height + c.radius;
            }
            this.bgGraphics.fillCircle(c.x, c.y, c.radius);
        });
    }
}