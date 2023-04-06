import { Graphics } from "@pixi/graphics";
import { wheelConfig } from "../config/wheelConfig";
import { Container } from "@pixi/display";
import { Fire } from "../components/Fire";
import { pixiApp } from "../main";

export class Wheel extends Container {
    private wheel: Graphics;
    private fire: Fire;

    constructor() {
        super();

        this.wheel = new Graphics()
            .beginFill(wheelConfig.color)
            .drawCircle(wheelConfig.radius, wheelConfig.radius, wheelConfig.radius);

        this.addChild(this.wheel);
        
        this.fire = new Fire(this.wheel, 'circular');

        pixiApp.ticker.add(() => this.fire.update());
    }
}