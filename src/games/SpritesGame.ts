import { AppScreen } from "../components/basic/AppScreen";
import { IGame } from "./IGame";
import config from "../config/spritesGameConfig";
import { Sprite } from "@pixi/sprite";
import { getRandomItem, getRandomInRange } from "../utils/random";
import { Container } from "@pixi/display";
import { Elastic, gsap } from "gsap";
import { initEmojis } from "../utils/preload";
import { GameBase } from "./GameBase";

// TODO: add matter.js
export class SpritesGame extends GameBase implements IGame { 
    private stack1: Container = new Container();
    private stack2: Container = new Container();
    
    items: Container[] = [];
    innerView!: Container;
    paused = false;
    activated = false;

    constructor(scene: AppScreen) {
        super({
            activeItemID: 1,
            activeStack: 2,
        });
        scene.addChild(this);
    }

    async init() {
        await initEmojis();

        this.createContent(config.spritesCount);

        this.start();
    }

    private async createContent(count: number) {
        this.innerView = new Container();
        this.addChild(this.innerView);

        this.innerView.addChild(this.stack2, this.stack1);

        this.innerView.sortableChildren = true;
        this.stack1.sortableChildren = true;
        this.stack2.sortableChildren = true;

        const pos = config.width / 2;

        this.stack1.x = pos + config.stack1Offset;
        this.stack1.y = pos + config.stack1Offset;

        this.stack2.x = pos + config.stack2Offset;
        this.stack2.y = pos + config.stack2Offset;

        const start = performance.now();

        for (let i = 0; i < count; i++) {
            const type = getRandomInRange(1, config.spritesAmount);
            const sprite = Sprite.from(`emoji${type}`);

            sprite.cullable = true;
            sprite.anchor.set(0.5);
            sprite.angle = getRandomInRange(1, config.stackRotationScatter);

            sprite.x = Math.random() * config.stackScatter;
            sprite.y = Math.random() * config.stackScatter;

            this.passiveStack.addChild(sprite);
            this.items.push(sprite);
        }

        const end = performance.now();

        console.log(`${count} sprites created in ${end - start} ms`);
    }

    private get activeStack(): Container {
        return this.state.get('activeStack') === 1 ? this.stack1 : this.stack2;
    }

    private get passiveStack(): Container {
        return this.state.get('activeStack') === 1 ? this.stack2 : this.stack1;
    }


    private async shoot() { 
        if (this.paused) return;

        const itemID = this.state.get('activeItemID');
        const activeItem = this.items[itemID];

        this.activated = true;
        
        this.moveItem(activeItem).then(() => {
            if (itemID === 0) { 
                this.reshuffle();
            }
        });

        this.shake(this.passiveStack, 1);
        this.shake(this.activeStack, -1);

        if (itemID > 0) { 
            setTimeout(() => this.shoot(), config.repeatDelay * 1000);
        }
    }

    private reshuffle() {       
        this.items.reverse();

        this.swapStacks();
    }

    private swapStacks() {
        gsap.to(
            this.activeStack,
            {
                x: this.passiveStack.x,
                y: this.passiveStack.y,
                onComplete: () => this.restart()
            },
        );

        this.passiveStack.x = this.activeStack.x;
        this.passiveStack.y = this.activeStack.y;
    }

    private restart() {
        this.state.set('activeStack', this.state.get('activeStack') === 1 ? 2 : 1);
                    
        this.activeStack.zIndex = 0;
        this.passiveStack.zIndex = 1;

        this.start();
    }

    private moveItem(item: Container): Promise<void> { 
        return new Promise((resolve) => {
            const posX = item.x;
            const posY = item.y;

            const angle = 
                getRandomInRange(1, config.stackRotationScatter) 
                * getRandomItem([1, -1])
                * 4;

            item.zIndex = -this.state.get('activeItemID');

            gsap.to(item, {
                x: this.stackDistance.x + posX, 
                y: this.stackDistance.y + posY,
                angle,
                duration: config.duration,
                onComplete: () => {
                    this.activeStack.addChild(item);

                    item.x = posX;
                    item.y = posY;

                    resolve();
                },
                ease: Elastic.easeOut
            });

            this.state.set('activeItemID', this.state.get('activeItemID') - 1);
        })
    }

    private shake(stack: Container, direction: number) {
        let shake = getRandomInRange(4, 20) * direction;

        gsap.fromTo(
            stack,
            {
                x: stack.x - shake,
                y: stack.y - shake,
                ease: Elastic.easeOut,
                duration: config.duration / 4,
            },
            {
                duration: config.duration / 4,
                x: stack.x,
                y: stack.y,
                ease: Elastic.easeOut
            },
        );
    }

    private get stackDistance(): {x: number, y: number} {
        if (!this.activeStack || !this.passiveStack) return { x: 0, y: 0 };

        return ({
            x: this.activeStack.x - this.passiveStack.x,
            y: this.activeStack.y - this.passiveStack.y,
        });
    }

    start() {     
        this.state.set('activeItemID', this.items.length - 1);   
        this.shoot();
    }
    
    pause() {
        this.paused = true;
    }

    resume() { 
        this.paused = false;
        this.shoot();
    }

    resize(width: number, height: number): void {
        this.x = (width - config.width) / 2;
        this.y = (height - config.height) / 2;
    }
}