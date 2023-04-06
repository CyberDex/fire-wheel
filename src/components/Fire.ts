import { Quality, fireConfig, getQualityData } from "../config/fireConfig";
import { pixiApp } from "../main"
import { Emitter } from '@pixi/particle-emitter';
import { app } from "../App";
import { Container } from "@pixi/display";

export class Fire {
    private fireEmitter!: Emitter;
    private elapsed: number = 0;
    private quality: Quality = 'low';
    private safeQuality!: Quality | null;
    private fps: {
        low: number;
        high: number;
    } = {
            low: 0,
            high: 0,
        };
    
    constructor(target?: Container) { 
        if (target) {
            this.init(target);
        }
    }
    
    init(target: Container) {
        this.safeQuality = null;

        if (this.fireEmitter) {
            this.fireEmitter.destroy();
        }

        this.fireEmitter = new Emitter(
            target,
            fireConfig(target.width, target.height, this.quality)
        );

        app.bg.swing(1.5, 10, 2);

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
        
        if (this.quality !== 'low' && pixiApp.ticker.FPS < 60) {
            this.fps.low++;

            if (this.fps.low > 10) {
                this.qualityDown();
            }
        }

        if (this.safeQuality) {
            return;
        }

        if (this.quality !== 'high') {
            if (pixiApp.ticker.FPS && pixiApp.ticker.FPS >= 60) {
                this.fps.high++;

                if (this.fps.high > 300) {
                    this.qualityUp();
                }
            }
        }
    }

    update() {
        const now = Date.now();
        
        if (this.fireEmitter) {
            this.fireEmitter?.update((now - this.elapsed) * 0.001);

            this.adjustQuality();

            this.elapsed = now;
        }
    }
}