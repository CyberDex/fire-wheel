import { Graphics } from "@pixi/graphics";
import { wheelConfig } from "../config/wheelConfig";
import { Container } from "@pixi/display";
import { Fire } from "../components/Fire";
import { pixiApp } from "../main";
import { Text } from "@pixi/text";
import { Back, gsap } from "gsap";
import { Sprite } from "@pixi/sprite";
import { getRandomInRange } from "../utils/random";

export class Wheel extends Container {
    private wheel!: Graphics;
    private fire!: Fire;

    constructor() {
        super();

        this.addBase();
        this.addFire();
    }

    private addBase() { 
        let {
            numberPadding,
            numbersStyle, credits,
            radius,
            wheelColor,
            handlersColor,
            lineColor,
            borderColor,
            borderSize,
            handlersSize,
            centerSize,
            centerColor,
            handlersFillColor,
            centerFillColor
        } = wheelConfig;
        const sectorsCount = credits.length;
        const angleIncrement = (2 * Math.PI) / sectorsCount;

        this.wheel = new Graphics()
            .beginFill(borderColor)
            .drawCircle(radius, radius, radius);

        this.wheel.interactive = true;
        this.wheel.cursor = 'pointer';
        
        this.wheel.on('pointerdown', () => { 
            this.spin(getRandomInRange(360, 360 * 2));
        });

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

            const circle = new Graphics()
                .beginFill(handlersColor)
                .drawCircle(
                    radius + (innerRadius + handlersSize / 2) * Math.cos(angle), 
                    radius + (innerRadius + handlersSize / 2) * Math.sin(angle),
                    handlersSize
                )
                .beginFill(handlersFillColor)
                .drawCircle(
                    radius + (innerRadius + handlersSize / 2) * Math.cos(angle), 
                    radius + (innerRadius + handlersSize / 2) * Math.sin(angle),
                    handlersSize * 0.8
                );
            this.wheel.addChild(circle);

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

    spin(angle: number) {
        if (gsap.isTweening(this.wheel)) return;

        const {
            spinDurationMin,
            spinDurationMax,
            rotationsPerSpinMin,
            rotationsPerSpinMax,
        } = wheelConfig;

        const duration = getRandomInRange(spinDurationMin, spinDurationMax);
        const rotations = getRandomInRange(rotationsPerSpinMin, rotationsPerSpinMax);
        const targetAngle = angle * rotations;
        
        console.log({
            angle,
            duration,
            rotations,
            targetAngle,
        });

        gsap.to(this.wheel, {
            duration,
            angle: `+=${targetAngle}`,
            ease: Back.easeOut.config(0.1),
        });
    }
}