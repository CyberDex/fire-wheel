import { Container } from "@pixi/display";
import { wheelConfig } from "../config/wheelConfig";
import { Wheel } from "./Wheel";
import { ResultNumber, State, StateController, StateData } from "./StateController";
import { updateNumber } from "../utils/cuonters";
import { Text } from "@pixi/text";
import i18n from "../config/i18n";
import { Cheats } from "../components/Cheats";
import { log } from "../utils/log";

export class Game extends Container {
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

        this.addWheel();

        this.addBalanceText();
        this.addCheats();

        return this;
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
    
    private addCheats() { 
        const cheats = new Cheats(['auto', ...new Set(wheelConfig.credits)], (data) => {
            if (data.val === 'auto') {
                this.stateController.cheatResult = null;
            }

            this.stateController.cheatResult = Number(data.val) as ResultNumber;
        });

        cheats.x = -wheelConfig.radius / 2 - 30;
        cheats.y = this.height / 2 - cheats.height / 1.5;

        this.addChild(cheats);
    }

    update() { 
        if (this.paused) {
            return;
        }
    }
    
    resize(_width: number, _height: number) {
    }
}