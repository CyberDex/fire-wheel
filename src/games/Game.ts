import { Container } from "@pixi/display";
import { wheelConfig } from "../config/wheelConfig";
import { log } from "../utils/log";
import { Wheel } from "./Wheel";
import { GameState, State, StateController, StateData } from "./StateController";
import { getRandomInRange, getRandomItem } from "../utils/random";
import { updateNumber } from "../utils/cuonters";
import { Text } from "@pixi/text";
import i18n from "../config/i18n";


export class Game extends Container {
    private weights: number[] = [];
    private stateController: StateController;
    private balanceText!: Text;

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

        this.addBalanceText();

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

    private addBalanceText() {
        const title = new Text(i18n.game.balance, {
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: 'Days One',
            stroke: 0xff622c,
            strokeThickness: 3,
            wordWrap: false,
            align: 'center',
        });

        title.anchor.set(0.5);
        title.x = wheelConfig.radius;

        this.balanceText = new Text('', {
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: 'Days One',
            stroke: 0xff622c,
            strokeThickness: 3,
            wordWrap: false,
            align: 'center',
        });

        this.balanceText.anchor.set(0.5);
        this.balanceText.x = wheelConfig.radius;
        this.balanceText.y = wheelConfig.balanceTextOffset;

        title.y = this.balanceText.y - this.balanceText.height / 2 - title.height / 2;

        this.addChild(this.balanceText, title);

        this.state.onChange.connect((key: StateData, value: State[StateData]) => {
            if (key !== 'balance') return;

            updateNumber(this.balanceText, value);
        });
        
        updateNumber(this.balanceText, this.state.balance);        
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