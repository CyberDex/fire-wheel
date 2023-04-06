import { GameBase } from "./GameBase";
import { Wheel } from "./Wheel";

export class Game extends GameBase {
    paused = false;
    activated = false;
    wheel!: Wheel;

    init(): Game {
        this.addWheel();

        return this;
    }

    private addWheel() { 
        this.wheel = new Wheel();
        this.addChild(this.wheel);
    }

    start() {
        
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        
    }
    
    update() { 
        if (this.paused) {
            return;
        }
    }
    
    resize(width: number, height: number) {
        // this.wheel?.resize(width, height);
    }
}