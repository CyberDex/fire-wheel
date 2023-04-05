import { AppScreen } from "../components/basic/AppScreen";
import { IGame } from "./IGame";
import { GameBase } from "./GameBase";
import { Quality, fireConfig, getQualityData } from "../config/fireGameConfig";
import { Assets } from "@pixi/assets";
import { TilingSprite } from "@pixi/sprite-tiling";
import { Texture } from "@pixi/core";
import { app } from "../main"
import { gsap } from "gsap";
import { Emitter } from '@pixi/particle-emitter';
import { game } from "../Game";

export class FireGame extends GameBase implements IGame {
    private tintTexture!: Texture;
    private fireEmitter!: Emitter;
    private elapsed: number = 0;
    private tint!: TilingSprite;
    private quality: Quality = 'low';
    private safeQuality!: Quality;
    private widthCache!: number;
    private fps: {
        low: number;
        high: number;
    } = {
        low: 0,
        high: 0,
    };

    paused = false;
    activated = false;
    
    constructor(scene: AppScreen) {
        super({});
        scene.addChild(this);
    }

    async init() {
        await Assets.loadBundle('fire');

        this.addViews();

        this.start();
    }

    private addViews() { 
        this.tintTexture = Texture.from('fireGradient');

        this.tint = new TilingSprite(this.tintTexture, 1, window.innerHeight);
        this.tint.width = window.innerWidth;
        this.tint.height = window.innerHeight;
        this.tint.x = 0;
        this.tint.y = -window.innerHeight;
        this.tint.visible = false;

        this.tint.tileScale.set(window.innerHeight / this.tintTexture.height);
        
        this.addChildAt(this.tint, 0);
    }

    private bern() { 
        if (this.fireEmitter) {
            this.fireEmitter.destroy();
            this.tint.visible = false;

            game.bg.resetFilter();
        }

        this.widthCache = window.innerWidth;

        this.fireEmitter = new Emitter(
            this,
            fireConfig(this.widthCache, this.quality)
        );

        this.tint.visible = true;
        this.tint.alpha = 0;

        let velocity = 0;
        let kernelSize = 0;

        game.bg.swing(2, 2, 2);

        const interval = setInterval(() => {
            if (velocity < 40) {
                velocity++;
            } else {
                clearInterval(interval);
            }

            if (kernelSize < 15) {
                kernelSize++;
            }
            
            game.bg.filter.velocity.set(velocity);
            game.bg.filter.kernelSize = kernelSize;
        }, 100);

        gsap.to(this.tint, {
            alpha: 1,
            duration: 2,
        });

        this.elapsed = Date.now();
        this.fireEmitter.emit = true;
    }

    private qualityDown() {
        if (this.quality === 'low') { 
            return;
        } else if (this.quality === 'medium') {
            this.quality = 'low';
        } else if (this.quality === 'high') {
            this.quality = 'medium';
        }

        console.log('quality', this.quality);

        this.safeQuality = this.quality;

        this.fps.low = 0;

        this.updateQuality();
    }

    private qualityUp() {
        if (this.quality === 'high') { 
            return;
        } else if (this.quality === 'low') {
            this.quality = 'medium';
        } else if (this.quality === 'medium') {
            this.quality = 'high';
        }

        this.fps.high = 0;

        this.updateQuality();
    }

    private updateQuality() {
        console.log('quality', this.quality);

        this.fireEmitter.frequency = getQualityData(this.quality).frequency;
        this.fireEmitter.maxParticles = getQualityData(this.quality).maxParticles;
    }

    // TODO: improve quality adjust, use more frequency & maxParticles states
    private adjustQuality() {
        // console.log({
        //     fps: app.ticker.FPS,
        //     data: this.fps,
        //     quality: this.quality
        // });
        
        if (this.quality !== 'low' && app.ticker.FPS < 60) { 
            this.fps.low++;

            if (this.fps.low > 10) {
                this.qualityDown();
            }
        }

        if (this.safeQuality) { 
            return;
        }

        if (this.quality !== 'high') {
            if (app.ticker.FPS && app.ticker.FPS >= 60) {
                this.fps.high++;

                if (this.fps.high > 300) {
                    this.qualityUp();
                }
            }
        }
    }

    start() {
        this.bern();
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.bern();
    }
    
    update() { 
        const now = Date.now();
        
        if (this.fireEmitter) {
            this.fireEmitter?.update((now - this.elapsed) * 0.001);

            this.adjustQuality();

            this.elapsed = now;
        }
    }
    
    resize(_width: number, height: number): void {
        this.x = 0;
        this.y = height;

        if (this.tint) {
            this.tint.width = window.innerWidth;
            this.tint.height = window.innerHeight;
            this.tint.x = 0;
            this.tint.y = -window.innerHeight;

            this.tint.tileScale.set(window.innerHeight / this.tintTexture.height);
        }

        if (this.fireEmitter && this.widthCache < window.innerWidth) {
            this.bern();
        }
    }
}