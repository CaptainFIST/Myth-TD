export default class WaveManager {
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;

        this.wave = 0;
        this.maxWave = 10;

        this.waveData = [];
        this.path = null;
        this.spawnPoints = {}; // Maps spawn point ID to path
        this.waveText = null;
        this.isWaveActive = false;

        this.timers = [];
        this.loopEvent = null;

        this.cycleRunning = false;
        this.onGameCompleteCallback = null;

        // Internal time tracking for scaled time
        this.elapsedTime = 0;
        this.waveStartTime = 0;
        this.spawnedEnemies = [];
        this.nextWaveTime = 0;
        this.delayBetweenWaves = 0;
    }

    setWaveData(waveData, maxWave = 10) {
        this.waveData = waveData;
        this.maxWave = maxWave;
        console.log(`WaveManager: Set waveData with ${waveData.length} waves, maxWave=${maxWave}`);
    }

    initialize(waveText, path) {
        this.waveText = waveText;
        this.path = path;
    }

    // Initialize with spawn points (multiple paths)
    initializeWithSpawnPoints(waveText, spawnPoints) {
        this.waveText = waveText;
        this.spawnPoints = spawnPoints;
        // Keep path for backward compatibility (use first spawn point)
        const firstSpawnId = Object.keys(spawnPoints)[0];
        this.path = spawnPoints[firstSpawnId]?.worldPath || null;
        console.log("WaveManager initialized with spawn points:", Object.keys(spawnPoints));
    }

    setPath(path) {
        this.path = path;
    }

    setSpawnPoints(spawnPoints) {
        this.spawnPoints = spawnPoints;
    }

    setOnGameCompleteCallback(cb) {
        this.onGameCompleteCallback = cb;
    }

    reset() {
        this.wave = 0;
        this.isWaveActive = false;
        this.cycleRunning = false;
        this.clearTimers();
        this.elapsedTime = 0;
        this.waveStartTime = 0;
        this.spawnedEnemies = [];
        this.nextWaveTime = 0;

        this.loopEvent?.remove?.();
        this.loopEvent = null;
        this.updateWaveText();
    }

    updateWaveText() {
        this.waveText?.setText(`Wave: ${this.wave}`);
    }

    getWave() {
        return this.wave;
    }

    clearTimers() {
        this.timers.forEach(t => t?.remove?.());
        this.timers = [];
    }

    startWave() {
        if (this.isWaveActive) return;
        if (!this.path?.length && Object.keys(this.spawnPoints).length === 0) return;
        if (!this.waveData?.length) return;
        
        // Check if wave data exists before proceeding
        const waveConfig = this.waveData[this.wave];
        if (!waveConfig) {
            console.log(`No wave data for wave ${this.wave}. Total waves available: ${this.waveData.length}`);
            return;
        }
        
        console.log(`Starting wave ${this.wave}`);
        this.isWaveActive = true;
        this.waveStartTime = this.elapsedTime;
        this.spawnedEnemies = [];

        // Build spawn schedule
        let totalSpawns = 0;
        waveConfig.enemies.forEach(({ type, count, spawnPoint }) => {
            for (let i = 0; i < count; i++) {
                this.spawnedEnemies.push({
                    spawnTime: totalSpawns * 500, // milliseconds
                    type: type,
                    spawnPoint: spawnPoint ?? Object.keys(this.spawnPoints)[0] ?? 2, // Default to first spawn point or 2
                    spawned: false
                });
                totalSpawns++;
            }
        });

        // Set end wave time
        const waveEndTime = totalSpawns * 500 + 1000;
        this.waveEndTime = this.waveStartTime + waveEndTime;
    }

    endWave() {
        this.isWaveActive = false;
        this.wave++;  // Always move to next wave
        console.log(`Wave ended. Moving to wave ${this.wave}`);
    }

    startWaveCycle(scene, initialDelay, delayBetweenWaves) {
        if (!scene || !scene.time) return;
        if (this.cycleRunning) {
            return;
        }

        if (!this.path?.length && Object.keys(this.spawnPoints).length === 0) {
            console.warn("WaveManager: missing path or spawnPoints");
            return;
        }
        
        if (!this.waveData?.length) {
            console.warn("WaveManager: missing waveData");
            return;
        }

        this.cycleRunning = true;
        this.clearTimers();
        this.elapsedTime = 0;
        this.delayBetweenWaves = delayBetweenWaves;
        this.nextWaveTime = initialDelay;
    }

    update(scaledDelta) {
        // Always check for game completion even after wave cycle ends
        if (!this.isWaveActive && this.waveData[this.wave] === undefined && this.cycleRunning) {
            if (this.enemyManager.getAliveCount() === 0) {
                console.log("All enemies defeated! Game complete!");
                this.cycleRunning = false;
                this.onGameCompleteCallback?.();
                return; // Exit after triggering completion
            }
        }

        if (!this.cycleRunning) return;
        this.elapsedTime += scaledDelta;

        // Start initial wave or next wave
        if (this.elapsedTime >= this.nextWaveTime && !this.isWaveActive) {
            this.startWave();
            this.nextWaveTime = this.elapsedTime + this.delayBetweenWaves;
        }

        // Update active wave spawns
        if (this.isWaveActive) {
            this.spawnedEnemies.forEach(spawn => {
                if (!spawn.spawned && this.elapsedTime >= this.waveStartTime + spawn.spawnTime) {
                    // Get path for the spawn point
                    const spawnPointId = spawn.spawnPoint;
                    const path = this.spawnPoints[spawnPointId]?.worldPath || this.path;
                    
                    if (path?.length) {
                        this.enemyManager?.createEnemy?.(spawn.type, path);
                    } else {
                        console.warn(`No path found for spawn point ${spawnPointId}`);
                    }
                    spawn.spawned = true;
                }
            });

            // Check if wave should end
            if (this.elapsedTime >= this.waveEndTime) {
                this.endWave();
            }
        }
    }

    stop() {
        this.isWaveActive = false;
        this.cycleRunning = false;
        this.clearTimers();
        this.elapsedTime = 0;
        this.waveStartTime = 0;
        this.spawnedEnemies = [];
        this.nextWaveTime = 0;

        this.loopEvent?.remove?.();
        this.loopEvent = null;
        this.wave = 0;

        this.scene.time.removeAllEvents(); 
        this.updateWaveText();
    }

    hardReset() {
        this.stop();
        this.path = null;
        this.spawnPoints = {};
        this.waveData = [];
        this.waveText = null;
        this.scene = null;
        this.enemyManager = null;
    }
}