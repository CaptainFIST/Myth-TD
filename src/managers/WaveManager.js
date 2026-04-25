export default class WaveManager {
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;

        this.wave = 1;
        this.maxWave = 10;

        this.waveData = [];
        this.path = null;
        this.waveText = null;
        this.isWaveActive = false;

        this.timers = [];
        this.loopEvent = null;

        this.cycleRunning = false;
        this.onGameCompleteCallback = null;
    }

    setWaveData(waveData, maxWave = 10) {
        this.waveData = waveData;
        this.maxWave = maxWave;
    }

    initialize(waveText, path) {
        this.waveText = waveText;
        this.path = path;
    }

    setPath(path) {
        this.path = path;
    }

    setOnGameCompleteCallback(cb) {
        this.onGameCompleteCallback = cb;
    }

    reset() {
        this.wave = 1;
        this.isWaveActive = false;
        this.cycleRunning = false;
        this.clearTimers();

        this.loopEvent?.remove?.();
        this.loopEvent = null;
        this.updateWaveText();
    }

    clearTimers() {
        this.timers.forEach(t => t?.remove?.());
        this.timers = [];
    }

    startWave() {
        if (this.isWaveActive) return;
        if (!this.path?.length) return;
        if (!this.waveData?.length) return;
        if (this.wave > this.maxWave) return;
        this.isWaveActive = true;

        const waveConfig = this.waveData[this.wave - 1];
        if (!waveConfig) return console.error("Wave missing:", this.wave);

        let totalSpawns = 0;
        waveConfig.enemies.forEach(({ type, count }) => {
            for (let i = 0; i < count; i++) {
                const t = this.scene.time.delayedCall(totalSpawns * 500, () => {
                    this.enemyManager?.createEnemy?.(type, this.path);
                });
                this.timers.push(t);
                totalSpawns++;
            }
        });

        const endTimer = this.scene.time.delayedCall(
            totalSpawns * 500 + 1000,
            () => this.endWave()
        );
        this.timers.push(endTimer);
    }

    endWave() {
        this.isWaveActive = false;

        if (this.wave < this.maxWave) {
            this.wave++;
        } else {
            this.checkGameCompletion();
        }
    }

    checkGameCompletion() {
        const check = () => {
            if (this.enemyManager.getAliveCount() === 0) {
                this.onGameCompleteCallback?.();
            } else {
                const t = this.scene.time.delayedCall(500, check);
                this.timers.push(t);
            }
        };
        check();
    }

    updateWaveText() {
        this.waveText?.setText(`Wave: ${this.wave}`);
    }

    getWave() {
        return this.wave;
    }

    startWaveCycle(scene, initialDelay, delayBetweenWaves) {
        if (!scene || !scene.time) return;
        if (this.cycleRunning) {
            return;
        }

        if (!this.path?.length || !this.waveData?.length) {
            console.warn("WaveManager: missing path or waveData");
            return;
        }

        this.cycleRunning = true;
        this.clearTimers();

        const first = scene.time.delayedCall(initialDelay, () => {
            this.startWave();
        });
        this.timers.push(first);

        // loop controller
        this.loopEvent = scene.time.addEvent({
            delay: delayBetweenWaves,
            loop: true,
            callback: () => {
                if (this.isWaveActive) return;
                if (this.wave > this.maxWave) {
                    this.stop();
                    return;
                }
                this.startWave();
            }
        });
    }

    stop() {
        this.isWaveActive = false;
        this.cycleRunning = false;
        this.clearTimers();

        this.loopEvent?.remove?.();
        this.loopEvent = null;
        this.wave = 1;

        this.scene.time.removeAllEvents(); 
        this.updateWaveText();
    }

    hardReset() {
        this.stop();
        this.path = null;
        this.waveData = [];
        this.waveText = null;
        this.scene = null;
        this.enemyManager = null;
    }
}