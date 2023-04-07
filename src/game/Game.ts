import { Container } from "@pixi/display";
import { gameConfig } from "../config/gameConfig";
import { Wheel } from "./Wheel";
import { GameState, ResultNumber, State, StateController, StateData } from "./StateController";
import { updateNumber } from "../utils/cuonters";
import { Text } from "@pixi/text";
import i18n from "../config/i18n";
import { Cheats } from "../components/Cheats";
import { Graphics } from "@pixi/graphics";
import { FancyButton } from "@pixi/ui";
import { gsap } from "gsap";
import { sound } from "@pixi/sound";

export class Game extends Container {
    private stateController: StateController;
    private balanceText!: Text;
    private spinButton!: FancyButton;
    private idleTimeout!: NodeJS.Timeout;
    private winMessage!: Text;

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
        this.addSpinButton();
        this.addCheats();
        this.addWinMessage();

        this.addEvents()

        if (!sound.find('fire-storm').isPlaying) {
            sound.play('fire-storm', { loop: true, volume: 0.3 });
        }

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
        title.x = gameConfig.radius;

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
        this.balanceText.x = gameConfig.radius;
        this.balanceText.y = gameConfig.balanceTextOffset;

        title.y = this.balanceText.y - this.balanceText.height / 2 - title.height / 2;

        this.addChild(this.balanceText, title);

        this.state.onChange.connect((key: StateData, value: State[StateData]) => {
            if (key !== 'balance') return;

            updateNumber(this.balanceText, value);
        });
        
        updateNumber(this.balanceText, this.state.balance);        
    }
    
    private addSpinButton() { 
        const {
            size,
            color,
            fillColor,
            offsetX,
            offsetY,
            style,
            borderColor,
            border,
            additionalTextStyle
        } = gameConfig.spinButton;
                    
        const spinButton = new Graphics()
            .beginFill(borderColor)
            .drawCircle(0, 0, size)
            .beginFill(color)
            .drawCircle(0, 0, size - border)
            .beginFill(fillColor)
            .drawCircle(0, 0, size * 0.8);
        
        const text = new Text(i18n.game.spin, style);
        text.anchor.set(0.5);
        text.y = -10;
        spinButton.addChild(text);
        
        const additionalText = new Text(i18n.game.additional, additionalTextStyle);
        additionalText.anchor.set(0.5, 0);
        additionalText.y = 10;
        spinButton.addChild(additionalText);

        const graphicsOffsetX = spinButton.width / 2;
        const graphicsOffsetY = spinButton.height / 2;
                        
        this.spinButton = new FancyButton({
            defaultView: spinButton,
            animations: {
                default: {
                    props: {
                        scale: { x: 1, y: 1 },
                        x: graphicsOffsetX,
                        y: graphicsOffsetY
                    },
                    duration: 100
                },
                hover: {
                    props: {
                        scale: { x: 1.03, y: 1.03 },
                        x: graphicsOffsetX,
                        y: graphicsOffsetY
                    },
                    duration: 100
                },
                pressed: {
                    props: {
                        scale: { x: 0.9, y: 0.9 },
                        x: graphicsOffsetX,
                        y: graphicsOffsetY
                    },
                    duration: 100
                }
            },
        });

        this.spinButton.x = offsetX;
        this.spinButton.y = offsetY;

        this.spinButton.onPress.connect(() => this.startSpin());

        this.addChild(this.spinButton);
    }

    private addWinMessage() {
        const {
            style,
            offsetX,
            offsetY,
        } = gameConfig.winMessage;

        this.winMessage = new Text(i18n.game.result, style);
        this.winMessage.anchor.set(0.5);
        this.winMessage.x = offsetX;
        this.winMessage.y = offsetY;
        this.winMessage.alpha = 0;

        this.addChild(this.winMessage);
    }

    private showWinMessage() {
        this.winMessage.alpha = 0;
        this.winMessage.text = i18n.game.result.replace('{X}', this.state.result.toString());
                
        sound.play('wheel-landing', { volume: 1.2 });

        const {
            showWinMessageDuration,
            resultRevealDuration
        } = gameConfig;

        gsap.killTweensOf(this.winMessage);

        gsap.to(this.winMessage, {
            duration: showWinMessageDuration, 
            alpha: 1,
            width: this.winMessage.width * 1.2,
            height: this.winMessage.height * 1.2,
        });

        gsap.to(this.winMessage, {
            delay: showWinMessageDuration,
            duration: showWinMessageDuration,
            width: this.winMessage.width,
            height: this.winMessage.height,
        });

        gsap.to(this.winMessage, {
            alpha: 0,
            delay: resultRevealDuration + showWinMessageDuration,
        });
    }
    
    private addCheats() { 
        const cheats = new Cheats(['auto', ...new Set(gameConfig.credits)], (data) => {
            if (data.val === 'auto') {
                this.stateController.cheatResult = null;
            }

            this.stateController.cheatResult = Number(data.val) as ResultNumber;
        });

        cheats.x = -gameConfig.radius / 2 - 30;
        cheats.y = this.height / 2 - cheats.height / 1.5;

        this.addChild(cheats);
    }

    private addEvents() { 
        this.state.onChange.connect((key: StateData, value: State[StateData]) => {
            if (key !== 'gameState') return;

            switch (value as GameState) {
                case 'result':
                    this.resetIdleSpin();
                    
                    gsap.to(this.spinButton, {
                        alpha: 0,
                        onComplete: () => {
                            this.spinButton.enabled = false;
                        }
                    });

                    this.wheel.showResult();
                    break;
                case "idle":
                    this.initIdleSpin();

                    this.spinButton.enabled = true;
                    gsap.to(this.spinButton, {
                        alpha: 1,
                    });

                    this.showWinMessage();
                    break;                
            }
        });
    }

    startSpin() {
        if (this.state.gameState === 'idle') {            
            this.state.gameState = 'result';
        }
    }

    resetIdleSpin() { 
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
    }

    initIdleSpin() {
        this.idleTimeout = setTimeout(() => {
            if (this.state.gameState === 'idle') {
                this.wheel.idleSpin();
            }
        }, gameConfig.delayOnResult * 1000);
    }

    stop() {
        this.wheel.stop();
    }
    
}