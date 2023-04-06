import { Quality, Shape, fireConfig, getQualityData } from "../config/fireConfig";
import { pixiApp } from "../main"
import { Emitter } from '@pixi/particle-emitter';
import { app } from "../App";
import { Container } from "@pixi/display";
import { log } from "../utils/log";

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

    constructor(parent?: Container, private type: Shape = 'rectangular') { 
        if (parent) {
            this.init({
                parent,
                type,
                size: {
                    width: parent.width,
                    height: parent.height,
                }
            });
        }
    }
    
    init({ parent, type, size }: {
        parent: Container,
        type: Shape,
        size: {
            width: number;
            height: number;
        }
    }): Fire {
        this.safeQuality = null;

        if (this.fireEmitter) {
            this.fireEmitter.destroy();
        }

        this.fireEmitter = new Emitter(
            parent,
            fireConfig(size.width, size.height, this.quality, type)
        );

        app.bg.swing(1.5, 10, 2);

        this.elapsed = Date.now();
        this.fireEmitter.emit = true;

        return this;
    }

    private qualityDown() {
        if (this.quality === 'low') {
            return;
        } else if (this.quality === 'medium') {
            this.quality = 'low';
        } else if (this.quality === 'high') {
            this.quality = 'medium';
        }

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
        log({
            quality: this.quality,
        });

        this.fireEmitter.frequency = getQualityData(this.quality, this.type).frequency;
        this.fireEmitter.maxParticles = getQualityData(this.quality, this.type).maxParticles;
    }

    // TODO: improve quality adjust, use more frequency & maxParticles states
    private adjustQuality() {
        // console.log({
        //     fps: pixiApp.ticker.FPS,
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