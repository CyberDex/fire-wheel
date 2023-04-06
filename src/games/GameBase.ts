import { Container } from "@pixi/display";
import { Signal } from 'typed-signals';

export type State = {
    [key: string]: number
};

export class GameBase extends Container {
    private _state: State = {};

    onStateChange: Signal<(key: string, value: number) => void>;

    constructor(state: State) {
        super();
        
        this._state = state;

        this.onStateChange = new Signal();
    }

    get state() { 
        return {
            get: (key: any) => this._state[key],
            set: (key: any, value: any) => {
                this._state[key] = value;

                this.onStateChange.emit(key, value);
            },
            getAll: () => this._state
        }
    }
}