import { Signal } from "typed-signals";
import { log } from "../utils/log";
import { getRandomItem } from "../utils/random";
import { gameConfig } from "../config/gameConfig";

export type StateData = 'balance' | 'result' | 'gameState' | 'cheatResult';
export type GameState = 'idle' | 'result';
export type ResultNumber = 200 | 400 | 1000 | 2000 | 5000;

export type State = {
    [key in StateData]: any;
};

export class StateController {
    private state: State;
    private weights: number[] = [];
    
    onChange: Signal<(key: StateData, value: State[StateData]) => void>;

    constructor() { 
        this.state = {
            balance: 1000,
            result: 0,
            gameState: 'idle',
            cheatResult: 0,
        };

        this.initWeights();
        
        this.onChange = new Signal();
    }

    private initWeights() { 
        const { weights, credits } = gameConfig;

        credits.forEach((credit, index) => { 
            for (let i = 0; i < weights[index]; i++) {
                this.weights.push(credit);
            }
        });
    }

    private set(key: StateData, value: State[StateData]) {
        if (this.state[key] === value) { 
            return;
        }
        
        log({
            [key]: value
        });

        this.state[key] = value;
        this.onChange.emit(key, value);
    }
    
    get gameState(): GameState {
        return this.state.gameState;
    }

    set gameState(value: GameState) {
        if (value === 'result' && !!this.cheatResult) {
            this.result = Number(this.state.cheatResult) as ResultNumber;
        } else if (value === 'result') {
            this.result = getRandomItem(this.weights);
        }

        if (value === 'idle') {
            this.balance += this.result;
        }

        this.set('gameState', value);
    }
    
    get result(): ResultNumber { 
        return this.state.result;
    }

    set result(value: ResultNumber) {
        this.set('result', value);
    }

    get balance(): number {
        return this.state.balance;
    }

    set balance(value: number) {
        this.set('balance', value);
    }

    set cheatResult(value: ResultNumber | null) {
        this.set('cheatResult', value);
    }

    get cheatResult(): ResultNumber | null {
        return this.state.cheatResult;
    }
}