export default class WaveManager {
    constructor(scene, enemyManager) {
        this.scene = scene;                 
        this.enemyManager = enemyManager;   
        
        this.wave = 1;                      // Current wave number
        this.maxWave = 5;                   // Total number of waves
        this.isWaveActive = false;          
        this.waveText = null;               
        this.path = null;                   
        this.onGameCompleteCallback = null; 
    }

    // Set up wave display and path for enemy movement
    initialize(waveText, path) {
        this.waveText = waveText;           // Store reference to wave display text
        this.path = path;                   // Store reference to enemy path
    }

    setPath(path) {
        this.path = path;
    }

    setOnGameCompleteCallback(callback) {
        this.onGameCompleteCallback = callback;
    }

    // Begin spawning enemies for current wave
    startWave(enemyCount) {
        if (this.isWaveActive) return;

        if (this.wave > this.maxWave) {
            return;
        }

        if (!this.path || this.path.length === 0) {
            console.log("Cannot start wave, path not ready");
            return;
        }

        console.log(`Starting wave ${this.wave}`);
        this.isWaveActive = true;

        // Spawn enemies at intervals (500ms apart)
        for (let i = 0; i < enemyCount; i++) {
            this.scene.time.delayedCall(i * 500, () => {
                this.enemyManager.createEnemy(0, this.path);  // 0 = Oni enemy type
            });
        }

        this.scene.time.delayedCall(enemyCount * 500 + 1000, () => {
            this.endWave();
        });
    }

    // Clean up current wave and prepare next one
    endWave() {
        console.log(`Wave ${this.wave} ended`);

        if (this.wave !== this.maxWave) {
            this.wave++;
        } else {
            this.checkGameCompletion();
        }
        this.isWaveActive = false;
    }

    // Verify all enemies are defeated before triggering win condition
    checkGameCompletion() {
        const checkEnemies = () => {
            if (this.enemyManager.getAliveCount() === 0) {
                console.log("All waves complete and all enemies defeated!");
                if (this.onGameCompleteCallback) {
                    this.onGameCompleteCallback();  // Trigger win condition
                }
            } else {
                this.scene.time.delayedCall(500, checkEnemies);
            }
        };
        checkEnemies();
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
        if (this.waveText) {
            this.waveText.setText(`Wave: ${this.wave}`);
        }
    }

    // Automatically start waves at regular intervals
    startWaveCycle(scene, initialEnemyCount, delayBeforeFirst, delayBetweenWaves, numberOfWaves) {
        scene.time.delayedCall(delayBeforeFirst, () => {
            this.startWave(initialEnemyCount);
            scene.time.addEvent({
                delay: delayBetweenWaves,
                repeat: numberOfWaves,
                callback: () => {
                    this.startWave(initialEnemyCount + 2);
                }
            });
        });
    }
}