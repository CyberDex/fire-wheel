import { AppScreen } from "../components/AppScreen";
import { GameBase } from "./GameBase";

export class Game extends GameBase {
    paused = false;
    activated = false;
    
    constructor(scene: AppScreen) {
        super({});
        scene.addChild(this);
    }

    async init() {
        this.start();
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
 
    }
    
    resize(_width: number, _height: number) {

    }
}