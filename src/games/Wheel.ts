import { Graphics } from "@pixi/graphics";
import { wheelConfig } from "../config/wheelConfig";
import { Container } from "@pixi/display";
import { Fire } from "../components/Fire";
import { pixiApp } from "../main";
import { Text } from "@pixi/text";
import { Back, gsap } from "gsap";
import { getRandomInRange } from "../utils/random";
import { Game } from "./Game";
import { log } from "../utils/log";
import { GameState, ResultNumber, State, StateData } from "./StateController";
import { Slider } from "@pixi/ui";

export class Wheel extends Container {
    private wheel!: Graphics;
    private fire!: Fire;
    private idleAnimationSlow: gsap.core.Timeline;
    private resultAnimation: gsap.core.Timeline;
    private startSpinAngle = 0;
    private spinsMadeBeforeResult = 0;
    private startAngle = 0;
    private idleTimeout!: NodeJS.Timeout;

    constructor(private game: Game) {
        super();

        this.addBase();
        this.addPointer();
        // this.addArm();
        this.addFire();

        this.resultAnimation = gsap.timeline();

        this.addEvents();

        this.startAngle = 0; //getRandomInRange(0, 360);
        this.wheel.angle = this.startAngle;

        this.idleSpinSlow();
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

        this.wheel.interactive = true;
        this.wheel.cursor = 'pointer';
        
        this.wheel.on('pointerdown', () => this.startSpin());

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

    private addArm() { 
        const { 
            meshColor,
            borderColor,
            backgroundColor,
            min,
            max,
            value,
            width,
            height,
            radius,
            border,
            handleBorder,
        } = wheelConfig.arm;

        const bg = new Graphics()
            .beginFill(borderColor)
            .drawRoundedRect(0, 0, width, height, radius)
            .beginFill(backgroundColor)
            .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

        const slider = new Graphics()
            .beginFill(borderColor)
            .drawCircle(0, 0, 20 + handleBorder)
            .beginFill(meshColor)
            .drawCircle(0, 0, 20)
            .endFill();

        // Component usage
        const singleSlider = new Slider({
            bg,
            slider,
            min,
            max,
            value,
        });
        
        singleSlider.onUpdate.connect((value: number) => { 
            this.wheel.angle = 360 / 100 * value;
            log({
                angle: this.wheel.angle,
            })
        });

        this.addChild(singleSlider);
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
                case 'spin':
                    if (this.idleTimeout) {
                        clearTimeout( this.idleTimeout)
                    }

                    this.idleSpinFast();
                    this.startSpinAngle = this.wheel.angle;
                    break;
                case 'result':
                    // do nothing, this is handled in idleSpinFast
                    break;
                case "idle":
                    this.idleTimeout = setTimeout(() => {
                        if (this.game.state.gameState === 'idle') {
                            this.idleSpinSlow();
                        }
                    }, wheelConfig.delayOnResult * 1000);
                    break;                
            }
        });
    }

    startSpin() {
        if (this.game.state.gameState === 'idle') {            
            this.game.state.gameState = 'spin';
        }
    }

    idleSpinSlow(targetAngle = 360) {
        log('idleSpinSlow');
        this.idleAnimationSlow = gsap.timeline();
        
        // speed in degrees per second
        const duration = 1 / wheelConfig.idleSpeedSlow * targetAngle; // seconds to make 1 rotation

        this.idleAnimationSlow.to(this.wheel, {
            duration,
            angle: `+=${targetAngle}`, 
            ease: 'linear',
            repeat: -1,
        });
    }

    idleSpinFast(targetAngle = 360) {
        this.spinsMadeBeforeResult++;
        this.idleAnimationSlow?.kill();
        
        // speed in degrees per second
        const duration = 1 / wheelConfig.idleSpeedFast * targetAngle; // seconds to make 1 rotation

        const animation = gsap.to(this.wheel, {
            duration,
            angle: `+=${targetAngle}`, 
            ease: 'linear',
            onComplete: () => {
                const { gameState } = this.game.state;
                if (gameState === 'spin') {
                    this.idleSpinFast();
                } else if (gameState === 'result') {
                    animation.kill();
                    this.wheel.angle = this.startSpinAngle;
                    this.showResult();
                }
            }
        });
    }

    showResult() { 
        // const {
        //     rotationsForReveal,
        //     idleSpeedFast,
        //     credits
        // } = wheelConfig;

        const curAngle0 = this.wheel.angle - this.startAngle - this.startSpinAngle;

        const curAngle = this.wheel.angle;
        let resultAngle = this.resultAngle;

        if (resultAngle < curAngle) { 
            resultAngle += 360;
        }

        // const resultAngle =
        //     this.wheel.angle > this.resultAngle - (360 / credits.length)
        //         ? this.resultAngle + 360
        //         : this.resultAngle;

        log({
            curAngle0,
            result: this.game.state.result,
            curAngle,
            resultAngle
        })
        
        // const resultAngleSpeedModificator = this.resultAngle / 360;

        this.resultAnimation.to(this.wheel, {
            duration: 1,//rotationsForReveal + (idleSpeedFast * resultAngleSpeedModificator),
            angle: resultAngle,
            ease: Back.easeOut.config(0.1),
            onComplete: () => { 
                this.game.state.gameState = 'idle';
            }
        });
    }

    private get resultAngle() { 
        const { angles } = wheelConfig;
        
        const result = this.game.state.result as ResultNumber;

        let resultAngleRange: [number, number] = [0, 0];

        if (Array.isArray(angles[result][0])) { 
            const randomOf2 = getRandomInRange(0, 1);
            resultAngleRange = angles[result][randomOf2] as [number, number];
        } else {
            resultAngleRange = angles[result][0] as [number, number];
        }

        const resultAngleFrom = resultAngleRange[0];
        const resultAngleTo = resultAngleRange[1];

        const resultAngle = getRandomInRange(resultAngleFrom, resultAngleTo);
        
        return resultAngle;
    }
}