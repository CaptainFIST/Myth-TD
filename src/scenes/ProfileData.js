import SaveManager from '../managers/SaveManager.js';
import  {ACHIEVEMENTS} from '../managers/Achievements.js';
import AudioManager from '../managers/AudioManager.js';

export default class ProfileData extends Phaser.Scene {
    constructor() {
        super({key: 'ProfileData'});
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
        
        // Initialize AudioManager for this scene
        if (!this.audioManager) {
            this.audioManager = new AudioManager(this);
            // Restore audio settings from saved slot
            const volume = SaveManager.getVolumeForSlot();
            const isMuted = SaveManager.getMuteForSlot();
            this.audioManager.setVolume(volume);
            this.audioManager.setMute(isMuted);
        }
        
        const slotData = SaveManager.getSlot();
        this.stats = slotData.stats;
        this.unlockAchieve = slotData.achievements;
        
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
        
        this.add.text(width / 2, height / 4 - 80, 'ACHIEVEMENTS & STATS', {
            fontSize: '68px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 8,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        const audioY = height / 2 - 60;
        this.add.text(width / 2 - 50, audioY - 50, 'STATS', {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0, 0);
        console.log(SaveManager.getSlot());


        
        const eStats = [
            `Total Gold: ${this.stats.totalGold}`,
            `Gold Spent: ${this.stats.goldSpent}`,
            `Perfect Clears: ${this.stats.perfectClears}`,
            `Level Clears: ${this.stats.levelClears}`,
            `Level Fails: ${this.stats.levelFails}`,
            `Enemies Killed: ${this.stats.enemiesKilled}`,
            `Towers Placed: ${this.stats.towersPlaced}`,
            `Merges Done: ${this.stats.mergesDone}`,
        ];
        
        eStats.forEach((text, i) => {
        const t = this.add.text(width / 2 - 500, (audioY + 100) + i * 40, text, {
            fontSize: '28px',
            color: '#64d5ff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        });
        });
    const keys = Object.keys(ACHIEVEMENTS);

    keys.forEach((id, i) => {
        const data = ACHIEVEMENTS[id];
        const isUnlocked = !!this.unlockAchieve[id];

        const x = (width / 2 + 50) + (i % 4) * 200;
        const y = (audioY) + Math.floor(i / 4) * 120;

        const bg = this.add.rectangle(x, y, 180, 100,
            isUnlocked ? 0x2ecc71 : 0x555555
        ).setOrigin(0);

        const name = this.add.text(x + 10, y + 10, data.name, {
            fontSize: '16px',
            color: '#ffffff'
        });

        const status = this.add.text(x + 10, y + 50,
            isUnlocked ? 'Unlocked' : 'Locked',
            { fontSize: '14px', color: '#cccccc' }
        );
    });
        
        // Save slot button
        let sData = SaveManager.get();
        const slotBtnY = height - 120;
        const slotBox = this.add.rectangle(width / 2 - 200, slotBtnY, 250, -60, 0x0f1534, 0.7)
            .setStrokeStyle(3, 0x000000).setOrigin(0.5);
        slotBox.setDepth(1);
        
        const slotBtn = this.add.text(width / 2 - 200, slotBtnY, `SAVE\n${sData.activeSlot}`, {
            fontSize: '20px',
            color: '#06b6d4',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        slotBtn.on('pointerover', () => slotBtn.setStyle({ fill: '#7c3aed' }));
        slotBtn.on('pointerout', () => slotBtn.setStyle({ fill: '#06b6d4' }));
        slotBtn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            // Guard against rapid switching to prevent audio corruption
            if (this.slotSwitching) return;
            this.slotSwitching = true;
            
            const slots = ['Slot_1', 'Slot_2', 'Slot_3'];
            const currentIndex = slots.indexOf(sData.activeSlot);
            const nextSlot = slots[(currentIndex + 1) % slots.length];
            
            // Save current audio settings before switching (regardless of volume value)
            if (this.audioManager) {
                SaveManager.setVolumeForSlot(this.audioManager.getVolume());
                SaveManager.setMuteForSlot(this.audioManager.isMutedState());
            }
            
            SaveManager.setActiveSlot(nextSlot);
            
            // Load audio settings from new slot
            if (this.audioManager) {
                const volume = SaveManager.getVolumeForSlot();
                const isMuted = SaveManager.getMuteForSlot();
                this.audioManager.setVolume(volume);
                this.audioManager.setMute(isMuted);
            }
            
            slotBtn.setText(`SAVE\n${nextSlot}`);
            sData.activeSlot = nextSlot;
            
            // Allow next switch after a brief delay
            this.time.delayedCall(200, () => {
                this.slotSwitching = false;
            });
        });
        slotBtn.setDepth(2);
        
        const backBtn = this.add.text(width / 2 + 200, slotBtnY, 'BACK TO MENU', {
            fontSize: '32px',
            color: '#64d5ff',
            fontStyle: 'bold',
            align: 'center',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            this.scene.stop();                      
            this.scene.start('MainMenu'); 
        });
    }

    shutdown() {
        // Save audio settings when leaving this scene
        if (this.audioManager) {
            SaveManager.setVolumeForSlot(this.audioManager.getVolume());
            SaveManager.setMuteForSlot(this.audioManager.isMutedState());
        }
    }
}