export default class WaveManager {
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;

        // Wave state
        this.wave = 1;
        this.maxWave = 10;
        this.isWaveActive = false;

        // UI + path data
        this.waveText = null;
        this.path = null;

        // Win callback hook
        this.onGameCompleteCallback = null;
    }

    initialize(waveText, path) {
        // Connect UI + enemy path
        this.waveText = waveText;
        this.path = path;
    }

    setPath(path) {
        this.path = path;
    }

    setOnGameCompleteCallback(callback) {
        this.onGameCompleteCallback = callback;
    }

    startWave(enemyCount) {
        if (this.isWaveActive || this.wave > this.maxWave) return;
        if (!this.path?.length) return console.log("Path not ready");

        console.log(`Starting wave ${this.wave}`);
        this.isWaveActive = true;

        // Spawn enemies over time
        for (let i = 0; i < enemyCount; i++) {
            this.scene.time.delayedCall(i * 500, () => {
                this.enemyManager.createEnemy(0, this.path);
            });
        }

        // End wave after last enemy spawns
        this.scene.time.delayedCall(enemyCount * 500 + 1000, () => {
            this.endWave();
        });
    }

    endWave() {
        console.log(`Wave ${this.wave} ended`);

        // Progress wave or finish game
        if (this.wave < this.maxWave) this.wave++;
        else this.checkGameCompletion();

        this.isWaveActive = false;
    }

    checkGameCompletion() {
        const check = () => {
            if (this.enemyManager.getAliveCount() === 0) {
                console.log("All waves complete!");

                this.onGameCompleteCallback?.();
            } else {
                this.scene.time.delayedCall(500, check);
            }
        };
        check();
    }

    getWave() {
        return this.wave;
    }

    getMaxWave() {
        return this.maxWave;
    }

    isWaveInProgress() {
        return this.isWaveActive;
    }

    updateWaveText() {
        this.waveText?.setText(`Wave: ${this.wave}`);
    }

    startWaveCycle(scene, initialEnemyCount, delayBeforeFirst, delayBetweenWaves, numberOfWaves) {
        scene.time.delayedCall(delayBeforeFirst, () => {
            this.startWave(initialEnemyCount);

            scene.time.addEvent({
                delay: delayBetweenWaves,
                repeat: numberOfWaves,
                callback: () => {
                    // Prevent overlapping waves
                    if (!this.isWaveActive) {
                        this.startWave(initialEnemyCount + 5);
                    }
                }
            });
        });
    }
}