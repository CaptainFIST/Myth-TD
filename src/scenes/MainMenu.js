import AudioManager from '../managers/AudioManager.js';
import SaveManager from '../managers/SaveManager.js';
import AchievementManager from '../managers/AchievementManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import StatsManager from '../managers/StatsManager.js';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu'});
    }
    
    preload() {
        this.load.image('gameTitle','assets/Titles/gameTitle.png');
        this.load.image('subtitleImage','assets/Titles/subtitleImage.png');
        this.audioManager = new AudioManager(this);
        this.audioManager.preloadAudio();
    }

    // Build the main menu UI
    create() {
        this.audioManager.playMainMenuMusic();
        const sData = SaveManager.get();
        console.log(sData.activeSlot);
        console.log(sData);

        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0d1128).setOrigin(0.5);
        this.add.image(width / 2, 180, 'gameTitle').setScale(1.8);
        this.add.image(width / 2, 420, 'subtitleImage').setScale(1.5);
        
        this.createBackground();

        // Audio controls in top right
        this.createAudioControls(width, height);

        // Define button layout and actions
        const buttonData = [
            {text: 'PLAY', icon: '▶', action: () => this.scene.start('LevelSelect')},
            {text: 'TUTORIAL', icon: '📚', action: () => this.scene.start('Tutorial') },
            {text: 'PROFILE', icon: '🏆', action: () => this.scene.start('ProfileData')}, // No action - placeholder
            {text: 'SETTINGS', icon: '⚙', action: () => this.scene.start('SettingsMenu')},
            {text: `Save ${sData.activeSlot}`, icon: '✕', 
                action: () => {
                    SaveManager.setActiveSlot('Slot_2');
                    console.log(sData.activeSlot);
                }  
            }
        ];
        const startY = 520;
        const leftx = 280;
        const spacing = 110;
        
        // Create each button
        buttonData.forEach((btn, index) => {
            const ypos = startY + index * spacing;
            const box = this.add.rectangle(leftx, ypos, 380, 80, 0x0f1534, 0.7)
                .setStrokeStyle(3, 0x000000).setOrigin(0.5);
            box.setDepth(1);
            
            const button = this.add.text(leftx, ypos, `${btn.icon} ${btn.text}`, {
                fontSize: '34px',
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
            button.setDepth(2);
        }); 
    }

    // Create animated floating circles background
    createBackground() {
        const { width, height } = this.scale;
        this.bgGraphics = this.add.graphics();
        this.circles = [];

        // Create circles with random properties
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

    // Create audio controls (volume slider and mute button) in top right
    createAudioControls(width, height) {
        const controlY = 40;
        const sliderX = width - 230;
        const sliderWidth = 150;
        const muteButtonX = sliderX + sliderWidth / 2 + 60; // Position to the right of slider

        // Mute button
        const muteButton = this.add.text(muteButtonX, controlY + 12, this.audioManager.isMuted ? '🔇' : '🔊', {
            fontSize: '32px',
            color: '#06b6d4',
            fontStyle: 'bold'
        })
        .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(100);

        muteButton.on('pointerdown', () => {
            this.audioManager.toggleMute();
            muteButton.setText(this.audioManager.isMuted ? '🔇' : '🔊');
        });

        muteButton.on('pointerover', () => muteButton.setStyle({ fill: '#7c3aed' }));
        muteButton.on('pointerout', () => muteButton.setStyle({ fill: '#06b6d4' }));

        // Volume slider background
        const sliderHeight = 8;

        const sliderBg = this.add.rectangle(sliderX, controlY + 10, sliderWidth, sliderHeight, 0x333333)
            .setOrigin(0.5).setStrokeStyle(2, 0x06b6d4).setDepth(100);
        const handleX = sliderX - (sliderWidth / 2) + (this.audioManager.getVolume() * sliderWidth);
        const sliderHandle = this.add.circle(handleX, controlY + 10, 10, 0x06b6d4)
            .setInteractive({ useHandCursor: true }).setDepth(101);

        // Update volume when dragging slider
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown && sliderHandle.active) {
                const newX = Phaser.Math.Clamp(pointer.x, sliderX - sliderWidth / 2, sliderX + sliderWidth / 2);
                sliderHandle.setX(newX);
                
                const newVolume = (newX - (sliderX - sliderWidth / 2)) / sliderWidth;
                this.audioManager.setVolume(newVolume);
            }
        });

        // Allow clicking on the slider background to move handle
        sliderBg.setInteractive({ useHandCursor: true });
        sliderBg.on('pointerdown', (pointer) => {
            const newX = Phaser.Math.Clamp(pointer.x, sliderX - sliderWidth / 2, sliderX + sliderWidth / 2);
            sliderHandle.setX(newX);
            const newVolume = (newX - (sliderX - sliderWidth / 2)) / sliderWidth;
            this.audioManager.setVolume(newVolume);
        });

        this.volumeText = this.add.text(sliderX, controlY - 20, '100%', {
            fontSize: '14px',
            color: '#06b6d4',
            fontStyle: 'bold',
            align: 'center'
        })
        .setOrigin(0.5).setDepth(100);

        // Update volume text and handle color
        this.updateVolumeDisplay = () => {
            const volume = Math.round(this.audioManager.getVolume() * 100);
            this.volumeText.setText(`${volume}%`);
            
            if (this.audioManager.isMuted) {
                sliderHandle.setFillStyle(0x666666);
                sliderBg.setStrokeStyle(2, 0x666666);
            } else {
                sliderHandle.setFillStyle(0x06b6d4);
                sliderBg.setStrokeStyle(2, 0x06b6d4);
            }
        };

        this.updateVolumeDisplay();
    }

    // Animate background circles floating upward
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

        if (this.updateVolumeDisplay) {
            this.updateVolumeDisplay();
        }
    }
    
    shutdown() {
        this.audioManager.stopAudio('mainMenuMusic');
    }
}