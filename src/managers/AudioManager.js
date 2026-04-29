export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.volume = 1.0;
        this.isMuted = false;
        this.audioConfig = {
            mainMenuMusic: { file: 'assets/audio/MainMenuMusic.mp3', loop: true, volume: 0.5 },
            levelMusic: { file: 'assets/audio/LevelMusic.mp3', loop: true, volume: 0.2 },
            healthLoss: { file: 'assets/audio/HealthLoss.mp3', loop: false, volume: 0.7 },
            monsterDeath: { file: 'assets/audio/MonsterDeath.mp3', loop: false, volume: 0.7 },
            towerAttack: { file: 'assets/audio/TowerAttack.mp3', loop: false, volume: 0.6 }
        };
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

    // Stop specific audio
    stopAudio(audioKey) {
        this.scene.sound.stop(audioKey);
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
        this.stopAll();
        this.playAudio('mainMenuMusic');
    }

    playLevelMusic() {
        this.stopAll();
        this.playAudio('levelMusic');
    }

    setVolume(value) {
        this.volume = Phaser.Math.Clamp(value, 0, 1);
        this.scene.sound.volume = this.isMuted ? 0 : this.volume;
        return this.volume;
    }

    getVolume() {
        return this.volume;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.scene.sound.volume = this.isMuted ? 0 : this.volume;
        return this.isMuted;
    }

    setMute(muted) {
        this.isMuted = muted;
        this.scene.sound.volume = this.isMuted ? 0 : this.volume;
        return this.isMuted;
    }

    isMutedState() {
        return this.isMuted;
    }
}