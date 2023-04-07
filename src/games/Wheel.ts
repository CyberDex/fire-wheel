import { Graphics } from "@pixi/graphics";
import { wheelConfig } from "../config/wheelConfig";
import { Container } from "@pixi/display";
import { Fire } from "../components/Fire";
import { pixiApp } from "../main";
import { Text } from "@pixi/text";
import { Back, gsap } from "gsap";
import { getRandomInRange, getRandomItem } from "../utils/random";
import { Game } from "./Game";
import { GameState, ResultNumber, State, StateData } from "./StateController";
import i18n from "../config/i18n";
import { FancyButton } from "@pixi/ui";

export class Wheel extends Container {
    private wheel!: Graphics;
    private fire!: Fire;
    private idleAnimation!: gsap.core.Timeline;
    private idleTimeout!: NodeJS.Timeout;
    private spinButton!: FancyButton;
    private winMessage!: Text;

    constructor(private game: Game) {
        super();

        this.addBase();
        this.addPointer();
        this.addSpinButton();
        this.addWinMessage();
        this.addFire();
        this.addEvents();
        this.idleSpin();
    }

    private addPointer() {
        const {
            radius,
            pointerColor,
            pointerSize,
            pointerFillColor
        } = wheelConfig;

        const pointer = new Graphics()
            .beginFill(pointerColor)
            .moveTo(0, 0)
            .lineTo(pointerSize, 0)
            .lineTo(pointerSize / 2, pointerSize)
            .closePath();

        const fillPointerSize = pointerSize * 0.8;
        const fillOffset = pointerSize - fillPointerSize;
        
        pointer
            .beginFill(pointerFillColor)
            .moveTo(fillOffset, fillOffset / 2)
            .lineTo(fillPointerSize, fillOffset / 2)
            .lineTo((fillPointerSize + fillOffset) / 2, fillPointerSize)
            .closePath();
        
        pointer.x = radius - pointerSize / 2;
        pointer.y = -pointerSize * 0.8;
        
        this.addChild(pointer);
    }

    private addBase() { 
        let {
            numberPadding,
            numbersStyle,
            credits,
            radius,
            wheelColor,
            lineColor,
            borderColor,
            borderSize,
            centerSize,
            centerColor,
            handlesSize,
            centerFillColor
        } = wheelConfig;
        const sectorsCount = credits.length;
        const angleIncrement = (2 * Math.PI) / sectorsCount;

        this.wheel = new Graphics()
            .beginFill(borderColor)
            .drawCircle(radius, radius, radius);

        const innerRadius = radius - borderSize;
        
        this.wheel
            .beginFill(wheelColor)
            .drawCircle(radius, radius, innerRadius);
        
        this.addChild(this.wheel);

        for (let i = 0; i < sectorsCount; i++) {
            const angle = i * angleIncrement;
            this.wheel.lineStyle(2, lineColor);
            this.wheel.moveTo(radius, radius);

            this.wheel.lineTo(
                radius + innerRadius * Math.cos(angle),
                radius + innerRadius * Math.sin(angle),
            );

            this.addHandle(
                radius + (innerRadius + handlesSize / 2) * Math.cos(angle),
                radius + (innerRadius + handlesSize / 2) * Math.sin(angle)
            )

            const numberAngle = (i + 0.5) * angleIncrement;
            const number = new Text(credits[i].toString(), numbersStyle);

            number.anchor.set(0.5);
            
            number.x = radius + (innerRadius - numberPadding) * Math.cos(numberAngle + Math.PI / 2);
            number.y = radius + (innerRadius - numberPadding) * Math.sin(numberAngle + Math.PI / 2);
            
            number.angle = (numberAngle * 180) / Math.PI;

            this.wheel.addChild(number);
        }

        const center = new Graphics()
            .beginFill(centerColor)
            .drawCircle(
                radius, 
                radius,
                centerSize
        )
            .beginFill(centerFillColor)
            .drawCircle(
                radius, 
                radius,
                centerSize * 0.8
            );

        this.wheel.addChild(center);
        
        this.wheel.pivot.set(wheelConfig.radius);
        this.wheel.position.set(wheelConfig.radius);

        pixiApp.ticker.add(() => {
            this.fire.update();
        });
    }

    private addHandle(x: number, y: number) { 
        const {
            handlesSize,
            handlesColor,
            handlesFillColor,
        } = wheelConfig;

        this.wheel.addChild(
            new Graphics()
            .beginFill(handlesColor)
            .drawCircle(x, y, handlesSize)
            .beginFill(handlesFillColor)
            .drawCircle(x,y, handlesSize * 0.8)
        );
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
        } = wheelConfig.spinButton;
                    
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

        this.spinButton.onPress.connect(() => { 
            this.game.state.gameState = 'result';
        });

        this.addChild(this.spinButton);
    }

    private addWinMessage() {
        const {
            style,
            offsetX,
            offsetY,
        } = wheelConfig.winMessage;

        this.winMessage = new Text(i18n.game.result, style);
        this.winMessage.anchor.set(0.5);
        this.winMessage.x = offsetX;
        this.winMessage.y = offsetY;
        this.winMessage.alpha = 0;

        this.addChild(this.winMessage);
    }
    
    private showWinMessage() { 
        this.winMessage.alpha = 0;

        this.winMessage.text = i18n.game.result.replace('{X}', this.game.state.result.toString());

        gsap.to(this.winMessage, {
            alpha: 1,
        });

        gsap.to(this.winMessage, {
            alpha: 0,
            delay: wheelConfig.resultRevealDuration + 1,
        });
    }

    private addFire() { 
        let {
            radius,
        } = wheelConfig;
        
        this.fire = new Fire();

        this.fire.init({
            parent: this,
            type: 'circular',
            size: {
                width: radius * 2,
                height: radius * 2,
            }
        });
    }

    private addEvents() { 
        this.game.state.onChange.connect((key: StateData, value: State[StateData]) => {
            if (key !== 'gameState') return;

            switch (value as GameState) {
                case 'result':
                    if (this.idleTimeout) {
                        clearTimeout(this.idleTimeout);
                    }
                    
                    gsap.to(this.spinButton, {
                        alpha: 0,
                        onComplete: () => {
                            this.spinButton.enabled = false;
                        }
                    });

                    this.showResult();
                    break;
                case "idle":
                    this.idleTimeout = setTimeout(() => {
                        if (this.game.state.gameState === 'idle') {
                            this.idleSpin();
                        }
                    }, wheelConfig.delayOnResult * 1000);

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
        if (this.game.state.gameState === 'idle') {            
            this.game.state.gameState = 'result';
        }
    }

    idleSpin(targetAngle = 360) {
        this.idleAnimation = gsap.timeline();
        
        // speed in degrees per second
        const duration = 1 / wheelConfig.idleSpeed * targetAngle; // seconds to make 1 rotation

        this.idleAnimation.to(this.wheel, {
            duration,
            angle: `+=${targetAngle}`, 
            ease: 'linear',
            repeat: -1,
        });
    }

    private get resultAngle() {
        const { angles } = wheelConfig;
        
        const result = this.game.state.result as ResultNumber;
        const has2zones = typeof angles[result][0] !== 'number';
    
        const resultAngleRange = has2zones
            ? getRandomItem(angles[result])
            : angles[result];

        const resultAngle = getRandomInRange(resultAngleRange[0], resultAngleRange[1]);
        
        return resultAngle;
    }

    showResult() { 
        const { rotationsForReveal, resultRevealDuration } = wheelConfig;

        const curAngle = this.wheel.angle;
        const rotations = (360 * rotationsForReveal);
        let resultAngle = this.resultAngle + rotations;

        if (curAngle < resultAngle - 360) { 
            resultAngle += rotations;
        }

        this.idleAnimation.kill();
        
        this.wheel.angle = 0;

        gsap.to(this.wheel, {
            duration: resultRevealDuration,
            angle: resultAngle,
            ease: Back.easeOut.config(0.2),
            onComplete: () => { 
                this.game.state.gameState = 'idle';
            }
        });
    }
}