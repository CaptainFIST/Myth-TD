
export default class TimeManager {    
    constructor() {
        this.time = 0;                  // Elapsed game time in seconds
        this.scale = 1;                 // Time scale multiplier (1 = normal speed)
        this.paused = false;            // Whether game is paused
    }

    // Called every frame to advance game time
    update(delta) {
        if(this.paused) return;         
        this.time += (delta / 1000) * this.scale;
    }

    getTime() {
        return this.time;
    }

    resetTime() {
        this.time = 0;
    }

    getScale() {
        return this.scale;
    }

    pause() {
        this.paused = true;
    }

    resume(){
        this.paused = false;
    }

    isPaused() {
        return this.paused;
    }

    togglePause() {
        this.paused = !this.paused;
    }
}