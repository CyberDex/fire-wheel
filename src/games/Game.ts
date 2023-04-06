import { wheelConfig } from "../config/wheelConfig";
import { log } from "../utils/log";
import { getRandomItem } from "../utils/random";
import { GameBase } from "./GameBase";
import { Wheel } from "./Wheel";

type GameState = 'idle' | 'spin';

export class Game extends GameBase {
    private weights: number[] = [];

    paused = false;
    activated = false;
    wheel!: Wheel;

    init(): Game {
        this.initWeights();

        this.addWheel();

        this.addEvents();

        return this;
    }

    private initWeights() { 
        const { weights, credits } = wheelConfig;

        credits.forEach((credit, index) => { 
            for (let i = 0; i < weights[index]; i++) {
                this.weights.push(credit);
            }
        });
        
    }

    private addWheel() { 
        this.wheel = new Wheel(this);
        this.addChild(this.wheel);
    }

    private addEvents() { 
        this.onStateChange.connect((key, value) => { 

            log(`${key} => ${value}`);

            switch (key) {
                case 'state':
                    this.onStateUpdate(value as any);
                    break;  
            }
        });
    }

    private onStateUpdate(state: GameState) { 
        switch (state) {
            case 'idle':
                
                break;
            case 'spin':
                this.state.set('result', getRandomItem(this.weights))
                break;
            default:
                break;
        }
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
    
    resize(_width: number, _height: number) {
    }
}