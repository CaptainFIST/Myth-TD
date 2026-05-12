export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.volume = 0.5;
        this.isMuted = false;
        this.currentlyPlayingMusic = null; // Track which music is playing
        // Initialize scene's sound volume to default
        this.scene.sound.volume = 0.5;
        this.audioConfig = {
            mainMenuMusic: { file: 'assets/audio/MainMenuMusic.mp3', loop: true, volume: 1.0 },
            levelMusic: { file: 'assets/audio/LevelMusic.mp3', loop: true, volume: 1.0 },
            winMusic: { file: 'assets/audio/Win.mp3', loop: false, volume: 1.0 },
            loseMusic: { file: 'assets/audio/Lose.mp3', loop: false, volume: 1.0 },
            healthLoss: { file: 'assets/audio/HealthLoss.mp3', loop: false, volume: 0.7 },
            monsterDeath: { file: 'assets/audio/MonsterDeath.mp3', loop: false, volume: 0.7 },
            towerAttack: { file: 'assets/audio/TowerAttack.mp3', loop: false, volume: 0.6 },
            buttonPress: { file: 'assets/audio/ButtonPress.mp3', loop: false, volume: 0.5 }
        };
        this.winMusicLoopCount = 0;
        this.loseMusicLoopCount = 0;
        this.winMusicSound = null;
        this.loseMusicSound = null;
    }

    preloadAudio() {
        Object.entries(this.audioConfig).forEach(([key, config]) => {
            this.scene.load.audio(key, config.file);
        });
    }

    // Play a specific audio track
    playAudio(audioKey) {
        const config = this.audioConfig[audioKey];
        if (!config) {
            console.warn(`Audio key "${audioKey}" not found in AudioManager`);
            return;
        }

        // Apply both config volume and manager volume level, respecting mute state
        const finalVolume = config.volume * this.volume * (this.isMuted ? 0 : 1);
        
        console.log(`🔊 Playing audio: ${audioKey}`, { loop: config.loop, finalVolume, muted: this.isMuted });
        this.scene.sound.play(audioKey, {
            loop: config.loop,
            volume: finalVolume
        });
    }

    // Stop all audio
    stopAll() {
        this.scene.sound.stopAll();
    }

    playHealthLoss() {
        this.playAudio('healthLoss');
    }

    playMonsterDeath() {
        this.playAudio('monsterDeath');
    }

    playTowerAttack() {
        this.playAudio('towerAttack');
    }

    playMainMenuMusic() {
        if (this.currentlyPlayingMusic !== 'mainMenuMusic') {
            this.stopAll();
            this.playAudio('mainMenuMusic');
            this.currentlyPlayingMusic = 'mainMenuMusic';
        }
    }

    playLevelMusic() {
        // Always stop and restart level music to ensure it plays (fixes replay issues)
        this.stopAll();
        this.playAudio('levelMusic');
        this.currentlyPlayingMusic = 'levelMusic';
    }

    playWinMusic() {
        // Only stop and restart if different music is playing
        if (this.currentlyPlayingMusic !== 'winMusic') {
            this.stopAll();
            const config = this.audioConfig['winMusic'];
            const finalVolume = config.volume * this.volume * (this.isMuted ? 0 : 1);
            
            try {
                this.scene.sound.play('winMusic', {
                    loop: false,
                    volume: finalVolume
                });
                console.log('🔊 Win music playing');
            } catch (error) {
                console.error('🔊 Failed to play winMusic:', error);
            }
            
            this.currentlyPlayingMusic = 'winMusic';
        }
    }

    playLoseMusic() {
        // Only stop and restart if different music is playing
        if (this.currentlyPlayingMusic !== 'loseMusic') {
            this.stopAll();
            const config = this.audioConfig['loseMusic'];
            const finalVolume = config.volume * this.volume * (this.isMuted ? 0 : 1);
            
            try {
                this.scene.sound.play('loseMusic', {
                    loop: false,
                    volume: finalVolume
                });
                console.log('🔊 Lose music playing');
            } catch (error) {
                console.error('🔊 Failed to play loseMusic:', error);
            }
            
            this.currentlyPlayingMusic = 'loseMusic';
        }
    }

    playButtonPress() {
        this.playAudio('buttonPress');
    }

    setVolume(value) {
        this.volume = Phaser.Math.Clamp(value, 0, 1);
        this.applyVolumeToScene();
        return this.volume;
    }

    getVolume() {
        return this.volume;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.applyVolumeToScene();
        return this.isMuted;
    }

    setMute(muted) {
        this.isMuted = muted;
        this.applyVolumeToScene();
        return this.isMuted;
    }

    applyVolumeToScene() {
        this.scene.sound.volume = this.isMuted ? 0 : this.volume;
    }

    isMutedState() {
        return this.isMuted;
    }
}