import SaveManager from '../managers/SaveManager.js';
import AudioManager from '../managers/AudioManager.js';

export default class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({key: 'SettingsMenu'});
    }

    preload() {
        // Initialize AudioManager for this scene
        if (!this.audioManager) {
            this.audioManager = new AudioManager(this);
            this.audioManager.preloadAudio();
            
            // Load saved audio settings
            const volume = SaveManager.getVolumeForSlot();
            const isMuted = SaveManager.getMuteForSlot();
            this.audioManager.setVolume(volume);
            this.audioManager.setMute(isMuted);
        }
    }

    // Build the settings UI with audio controls
    create() {
        const { width, height } = this.scale;
        this.bgGraphics = this.add.graphics();
        this.circles = [];  
        
        // Create animated circles similar to main menu
        for (let i = 0; i < 20; i++) {
            this.circles.push({
                x: Phaser.Math.Between(0, width),
                y: Phaser.Math.Between(0, height),
                radius: Phaser.Math.Between(20, 60),
                alpha: Phaser.Math.FloatBetween(0.05, 0.15),
                speed: Phaser.Math.FloatBetween(0.1, 0.4)
            });
        } 
        
        this.add.text(width / 2, height / 4 - 80, 'SETTINGS', {
            fontSize: '68px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 8,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        const audioY = height / 2 - 60;
        this.add.text(width / 2 - 500, audioY - 50, 'AUDIO SETTINGS', {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);

        // Master Volume Slider - connected to AudioManager
        this.masterVolCont = this.createVolumeControl(width / 2 - 450, audioY, 'MASTER VOLUME',
         this.audioManager.getVolume(),
         (val) => {
            console.log('Setting master volume to: ', val);
            this.audioManager.setVolume(val);
            SaveManager.setVolumeForSlot(val);
         }
         );
        
        // Sound Volume Slider
        this.soundVolCont = this.createVolumeControl(width / 2 - 450, audioY + 50, 'SOUND VOLUME', 
        this.audioManager.getVolume(),
        (val) => {
            console.log('Setting sound volume to: ', val);
            this.audioManager.setVolume(val);
            SaveManager.setVolumeForSlot(val);
        }
        );
        
        // Music Volume Slider
        this.musicVolCont = this.createVolumeControl(width / 2 - 450, audioY + 100, 'MUSIC VOLUME', 
        this.audioManager.getVolume(),
        (val) => {
            console.log('Setting music volume to: ', val);
            this.audioManager.setVolume(val);
            SaveManager.setVolumeForSlot(val);
        }
        );

        // Mute toggle button
        const muteY = audioY + 160;
        const isMuted = this.audioManager.isMutedState();
        this.muteBtn = this.add.text(width / 2 - 450, muteY, `MUTE: ${isMuted ? 'ON' : 'OFF'}`, {
            fontSize: '20px',
            color: isMuted ? '#ff6b6b' : '#64d5ff',
            fontStyle: 'bold',
            backgroundColor: isMuted ? '#4a2a2a' : '#1a3a3e',
            padding: { x: 15, y: 10 },
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0).setInteractive({ useHandCursor: true });

        this.muteBtn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            this.audioManager.toggleMute();
            const newMuteState = this.audioManager.isMutedState();
            this.muteBtn.setText(`MUTE: ${newMuteState ? 'ON' : 'OFF'}`);
            this.muteBtn.setStyle({
                color: newMuteState ? '#ff6b6b' : '#64d5ff',
                backgroundColor: newMuteState ? '#4a2a2a' : '#1a3a3e'
            });
            SaveManager.setMuteForSlot(newMuteState);
        });

        const deleteBtn = this.add.text(width / 2, height - 120, 'DELETE CURRENT SLOT DATA', {
            fontSize: '28px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        deleteBtn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            SaveManager.resetSlot(`${SaveManager.get().activeSlot}`);
        });

        const backBtn = this.add.text(width / 2, height - 40, 'BACK TO MENU', {
            fontSize: '32px',
            color: '#64d5ff',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            this.scene.start('MainMenu');
        });

        // Save audio settings when leaving the scene
        this.events.on('shutdown', () => {
            if (this.audioManager) {
                SaveManager.setVolumeForSlot(this.audioManager.getVolume());
                SaveManager.setMuteForSlot(this.audioManager.isMutedState());
            }
        });
    }

    // Helper function to create a volume slider with label and value display
    createVolumeControl(x, y, label,  initialValue, callback) { 
        this.add.text(x, y, label, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);

        // Slider background bar
        const barWidth = 200;
        const barHeight = 20;
        const barX = x + 200;
        const bar = this.add.rectangle(barX, y + 9, barWidth, barHeight, 0x333333)
            .setOrigin(0, 0.5).setStrokeStyle(2, 0x64d5ff, 1);

        const fill = this.add.rectangle(barX, y + 9, barWidth * initialValue, barHeight, 0x64d5ff).setOrigin(0, 0.5);

        // Volume percentage display
        const valueText = this.add.text(barX + barWidth + 20, y, Math.round(initialValue * 100) + '%', {
            fontSize: '16px',
            color: '#64d5ff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);
        bar.setInteractive({ useHandCursor: true });
        bar.on('pointerdown', (pointer) => {
            this.updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback);
        });

        // Update while dragging
        bar.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback);
            }
        });
        return { fill, valueText };
    }

    // Adjust volume slider based on mouse position
    updateVolumeSlider(pointer, bar, fill, barX, barWidth, valueText, callback) {
        const relativeX = pointer.x - barX;
        const clampedX = Math.max(0, Math.min(barWidth, relativeX));
        const volumePercent = clampedX / barWidth;  // Convert to 0-1 range

        fill.setSize(clampedX, fill.height);
        valueText.setText(Math.round(volumePercent * 100) + '%');
        
        if (callback) {
            callback(volumePercent);
        }
    }
}