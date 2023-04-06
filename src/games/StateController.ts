import { Signal } from "typed-signals";
import { log } from "../utils/log";

export type StateData = 'balance' | 'result' | 'gameState' | 'bet';
export type GameState = 'idle' | 'spin' | 'result';
export type ResultNumber = 200 | 400 | 1000 | 2000 | 5000;

export type State = {
    [key in StateData]: any;
};

export class StateController {
    private state: State;
    
    onChange: Signal<(key: StateData, value: State[StateData]) => void>;

    constructor() { 
        this.state = {
            balance: 1000,
            result: 0,
            gameState: 'idle',
            bet: 10,
        };
        
        this.onChange = new Signal();
    }

    private set(key: StateData, value: State[StateData]) {
        log({
            sate: `${key} => ${value}`
        });

        this.state[key] = value;
        this.onChange.emit(key, value);
    }
    
    get result(): ResultNumber { 
        return this.state.result;
    }

    set result(value: ResultNumber) {
        this.set('result', value);

        if (value > 0) { 
            this.gameState = 'result';
        }
    }

    get balance(): number {
        return this.state.balance;
    }

    set balance(value: number) {
        this.set('balance', value);
    }

    get gameState(): GameState {
        return this.state.gameState;
    }

    set gameState(value: GameState) {
        this.set('gameState', value);

        if (value === 'spin') {
            this.balance -= this.bet;
        }

        if (value === 'idle') {
            this.balance += this.result;
        }
    }
    
    set bet(value: number) {
        this.set('bet', value);
    }

    get bet(): number {
        return this.state.bet;
    }
}