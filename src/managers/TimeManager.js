export default class TimeManager {    
    constructor() {
        this.time = 0;

        // Time multiplier (1 = normal speed, 2 = double speed, etc.)
        this.scale = 1;

        // Pause state flag
        this.paused = false;
    }

    update(delta) {
        if (this.paused) return;
        this.time += (delta / 1000) * this.scale;
    }

    getTime() {
        return this.time;
    }

    resetTime() {
        // Reset elapsed time back to zero
        this.time = 0;
    }

    getScale() {
        return this.scale;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    isPaused() {
        return this.paused;
    }

    togglePause() {
        // Switch between paused and unpaused state
        this.paused = !this.paused;
    }

    setScale(newScale) {
        this.scale = newScale;
    }

    cycleSpeed() {
        // Cycles through speeds: 1 -> 2 -> 4 -> 8 -> 1
        const speeds = [1, 2, 4, 8];
        const currentIndex = speeds.indexOf(this.scale);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.scale = speeds[nextIndex];
        return this.scale;
    }

    getScaledDelta(rawDelta) {
        // Returns delta scaled by current speed multiplier
        return rawDelta * this.scale;
    }
}