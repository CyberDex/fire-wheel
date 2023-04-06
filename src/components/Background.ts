import { Sprite } from '@pixi/sprite';
import { Layout } from '@pixi/layout';
import { PixiLogo } from './PixiLogo';
import { gsap } from 'gsap';
import { MotionBlurFilter } from '@pixi/filter-motion-blur';

/* Layout based component for the background.
 * This is where all the layers of the background should be added and controlled. 
 * For example to add a parallax effect, you would add a new layers here and control their positions.
 */
export class Background extends Layout {
    filter: MotionBlurFilter;
    bgSprite: Sprite;
    animation: gsap.core.Timeline;

    private filterApplied = false;

    constructor() {
        const bg = Sprite.from('bg');

        super({
            id: 'gameBackground', // id is used to identify the Layout in the system
            content: { // content is an object with all the layers of the background
                bg: { // bg is the id of the layer
                    content: bg, // content is the PIXI sprite that will be added to the layer
                    styles: { // styles is an object with all the styles that will be applied to the layer
                        position: 'center', // center Layout in the middle of parent
                        minHeight: '100%', // set max height to 100% of parent, so it will scale down to fit the screen height
                        minWidth: '100%', // set min width to 100% of parent, so it will scale up to fit the screen width
                    }
                },
                pixiLogo: PixiLogo() // Layout based component for the pixi logo
            },
            styles: {
                width: '100%', // set width to 100% of parent, so children will be able to use 100% of the screen width
                height: '100%' // set height to 100% of parent, so children will be able to use 100% of the screen height
            }
        });

        this.bgSprite = bg;

        this.filter = new MotionBlurFilter();
        this.filters = [this.filter];

        this.animation = gsap.timeline();
    }

    swing(power: number, duration: number = 0.5, delay: number = 0) {
        this.filterApplied = true;
        
        if (this.animation.paused()) {
            setTimeout(() => this.animation.resume(), delay * 1000);
            return;
        }
        
        this.animation.to(this, 0.1, {x:`+=${power}`, yoyo:true, repeat:-1, duration, delay});
        this.animation.to(this, 0.1, { x: `-=${power}`, yoyo: true, repeat: -1, duration });    }

    stopSwing() {
        this.resetFilter();
        this.animation.pause();
    }

    resetFilter() {
        this.filterApplied = false;
        this.filter.velocity.set(0);
        this.filter.kernelSize = 0;
    }
    
    update(): void {
        if (!this.filterApplied) {
            return;
        }

        if (this.filter.velocity.x < 40) {
            this.filter.velocity.x += 0.1;
        }

        if (this.filter.kernelSize < 15) {
            this.filter.kernelSize += 0.1;
        }
    }

}