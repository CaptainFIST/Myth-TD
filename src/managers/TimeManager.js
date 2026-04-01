export default class TimeManager extends Phaser.Scene {
    constructor() {
        super({ key: 'TimeManager' });
        this.time = 0; 
        this.scale = 1; 
        this.paused = false;
    }

    update(delta){
        if(this.paused) return;
        this.time += (delta / 1000) * this.scale;
    }

    getTime() {
        return this.time;
    }

    resetTime() {
        this.time = 0;
    }

    getScale(){
        this.scale = this.scale;
    }

    pause() {
        this.paused = true;
    }

    resume(){
        this.paused = false;
    }


}