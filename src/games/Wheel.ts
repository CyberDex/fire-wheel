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

export class Wheel extends Container {
    private wheel!: Graphics;
    private fire!: Fire;
    private idleAnimation!: gsap.core.Timeline;
    private idleTimeout!: NodeJS.Timeout;

    constructor(private game: Game) {
        super();

        this.addBase();
        this.addPointer();
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

                    this.showResult();
                    break;
                case "idle":
                    this.idleTimeout = setTimeout(() => {
                        if (this.game.state.gameState === 'idle') {
                            this.idleSpin();
                        }
                    }, wheelConfig.delayOnResult * 1000);
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
        log('idleSpinSlow');
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

    showResult() { 
        const { rotationsForReveal, spinSpeed } = wheelConfig;

        const curAngle = this.wheel.angle;
        let resultAngle = this.resultAngle + (360 * rotationsForReveal);

        if (resultAngle < curAngle) { 
            resultAngle += 360;
        }

        this.idleAnimation.kill();
        const duration = 1 / spinSpeed * resultAngle; // seconds to make 1 rotation

        gsap.to(this.wheel, {
            duration: duration,
            angle: resultAngle,
            ease: Back.easeOut.config(0.2),
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