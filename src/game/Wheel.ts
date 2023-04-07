import { Graphics } from "@pixi/graphics";
import { gameConfig } from "../config/gameConfig";
import { Container } from "@pixi/display";
import { Fire } from "../components/Fire";
import { Text } from "@pixi/text";
import { Back, gsap } from "gsap";
import { getRandomInRange, getRandomItem } from "../utils/random";
import { Game } from "./Game";
import { sound } from "@pixi/sound";

export class Wheel extends Container {
    private wheel!: Graphics;
    private fire!: Fire;
    private idleAnimation!: gsap.core.Timeline;
    private pos = -1;

    constructor(private game: Game) {
        super();

        this.addBase();
        this.addPointer();

        this.addFire();
        this.idleSpin();
    }

    private addPointer() {
        const {
            radius,
            pointerColor,
            pointerSize,
            pointerFillColor
        } = gameConfig;

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
        } = gameConfig;
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

            const numberAngle = (i + 0.5) * angleIncrement;
            const number = new Text(credits[i].toString(), numbersStyle);

            number.anchor.set(0.5);
            
            number.x = radius + (innerRadius - numberPadding) * Math.cos(numberAngle + Math.PI / 2);
            number.y = radius + (innerRadius - numberPadding) * Math.sin(numberAngle + Math.PI / 2);
            
            number.angle = (numberAngle * 180) / Math.PI;

            this.addHandle(
                radius + (innerRadius + handlesSize / 2) * Math.cos(numberAngle + Math.PI / 2),
                radius + (innerRadius + handlesSize / 2) * Math.sin(numberAngle + Math.PI / 2)
            )

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
        
        this.wheel.pivot.set(gameConfig.radius);
        this.wheel.position.set(gameConfig.radius);
    }

    private addHandle(x: number, y: number) { 
        const {
            handlesSize,
            handlesColor,
            handlesFillColor,
        } = gameConfig;

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
        } = gameConfig;
        
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

    private get resultAngle() {
        const { angles } = gameConfig;
        
        const result = this.game.state.result;
        const has2zones = typeof angles[result][0] !== 'number';
    
        const resultAngleRange = has2zones
            ? getRandomItem(angles[result])
            : angles[result];

        const resultAngle = getRandomInRange(resultAngleRange[0], resultAngleRange[1]);
        
        return resultAngle;
    }

    idleSpin(targetAngle = 360) {
        this.idleAnimation = gsap.timeline();
        
        // speed in degrees per second
        const duration = 1 / gameConfig.idleSpeed * targetAngle; // seconds to make 1 rotation

        this.idleAnimation.to(this.wheel, {
            duration,
            angle: `+=${targetAngle}`, 
            ease: 'linear',
            repeat: -1,
            onUpdate: () => {
                this.click();
            }
        });
    }

    showResult() { 
        const { rotationsForReveal, resultRevealDuration } = gameConfig;

        const curAngle = this.wheel.angle;
        const rotations = (360 * rotationsForReveal);
        let resultAngle = this.resultAngle + rotations;

        if (curAngle < resultAngle - 360) { 
            resultAngle += rotations;
        }

        this.idleAnimation.kill();
        this.pos = 0;
        
        this.wheel.angle = 0;

        gsap.to(this.wheel, {
            duration: resultRevealDuration,
            angle: resultAngle,
            ease: Back.easeOut.config(0.2),
            onComplete: () => { 
                this.game.state.gameState = 'idle';
                this.pos = 0;
            },
            onUpdate: () => {
                this.click();
            }
        });
    }

    private click() { 
        const pos = Math.round(this.wheel.angle % 360 / (360 / 8));
        
        if (pos === 0 || this.pos === pos) {
            return;
        }
        
        this.pos = pos;

        if (sound.find('wheel-click').isPlaying) {
            return;4
        }

        sound.play('wheel-click');
    }
}