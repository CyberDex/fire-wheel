import { Container } from "@pixi/display";
import { wheelConfig } from "../config/wheelConfig";
import { log } from "../utils/log";
import { Wheel } from "./Wheel";
import { GameState, State, StateController, StateData } from "./StateController";
import { getRandomInRange, getRandomItem } from "../utils/random";


export class Game extends Container {
    private weights: number[] = [];
    private stateController: StateController;

    paused = false;
    activated = false;
    wheel!: Wheel;

    constructor() {
        super();

        this.stateController = new StateController();
    }

    get state() { 
        return this.stateController;
    }

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
        this.state.onChange.connect((key: StateData, value: State[StateData]) => {
            if (key !== 'gameState') return;

            switch (value as GameState) {
                case 'spin':
                    const serverResponseTime = getRandomInRange(1000, 3000);
                
                    setTimeout(() => { 
                        this.state.result = getRandomItem(this.weights);
                    }, serverResponseTime)
                    break;
                case 'result':
                    // show win animation
                    break;
                case "idle":
                    // maybe unblock spin button here
                    break;                
            }
        });
    }
    
    update() { 
        if (this.paused) {
            return;
        }
    }
    
    resize(_width: number, _height: number) {
    }
}