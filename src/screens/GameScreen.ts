import { AppScreen } from '../components/AppScreen';
import { SmallIconButton } from '../components/SmallIconButton';
import { app } from '../App';
import { TitleScreen } from './TitleScreen';
import { Game } from '../games/Game';
import { Button } from '../components/Button';
import i18n from '../config/i18n';
import { gsap } from 'gsap';
import { Fire } from '../components/Fire';
import { Texture } from '@pixi/core';
import { TilingSprite } from '@pixi/sprite-tiling';

export class GameScreen extends AppScreen { // GameScreen extends AppScreen, which is a Layout with a few additional features
    public static assetBundles = ['game']; // asset bundles that will be loaded before the screen is shown
    private game!: Game; // game instance
    private resumeButton!: Button;
    private paused = false;
    private fire!: Fire;

    constructor() { // constructor accepts an object with data that will be passed to the screen when it is shown
        super('GameScreen'); // Creates Layout with id 'GameScreen'

        app.addBG(); 

        this.addBottomFire();

        this.addBackButton(); // add pause button component to the screen
        
        this.addResumeButton(); // add resume button component to the screen

        this.addEvents();
    }

    private addBottomFire() { 
        const base = new TilingSprite(Texture.EMPTY);
        
        base.width = app.width;
        base.height = 50;
        
        this.fire = new Fire(base);

        this.addContent({
            content: base,
            styles: {
                position: 'bottom',
                marginBottom: -30
            }
        });

        return base;
    }

    private addBackButton() {
        const button = new SmallIconButton('HomeIcon', () => { // create a button with a custom icon
            app.bg.stopSwing();
            app.showScreen(TitleScreen); 
        });

        this.addContent({ // add content to the screen layout
            content: {
                content: button,
                styles: {
                    paddingLeft: button.width / 2 + 20,
                    paddingTop: button.height / 2 + 20
                }
            },
            styles: { // set styles for the button block
                position: 'top', // position the button in the bottom right corner of the parent
                scale: 0.35, // scale button 0.5 times
                maxWidth: '33%', // set max width to 20% of the parent width so the layout witt scale down if the screen width is too small to fit it
                maxHeight: '20%', // set max height to 20% of the parent height so the layout witt scale down if the screen height is too small to fit it
            },
        });
    }

    private addResumeButton() {
        this.resumeButton = new Button(
            i18n.gameScreen.resume,
            () => {
                gsap.to(this.resumeButton, {
                    alpha: 0,
                    duration: 0.5,
                    onComplete: () => { 
                        this.resumeButton.visible = false;
                        this.resumeButton.scale.set(1);
                        this.resumeButton.alpha = 1;
                    }
                });

                this.game.resume();
            },
            {
                fontSize: 60,
                scale: 2
            }
        );
        this.resumeButton.visible = false;

        this.addContent({ // add content to the screen layout
            content: {
                content: this.resumeButton,
                styles: {
                    paddingLeft: 85,
                }
            },
            styles: { // set styles for the button block
                position: 'center', // position the button in the bottom right corner of the parent
                maxWidth: '40%', // set max width to 20% of the parent width so the layout witt scale down if the screen width is too small to fit it
                maxHeight: '40%', // set max height to 20% of the parent height so the layout witt scale down if the screen height is too small to fit it
            },
        });
    }

    onUpdate() {
        if (this.paused) {
            return;
        }

        this.fire.update();

        if (this.game?.update) {
            this.game.update();
        }
    }

    override resize(width: number, height: number) {
        super.resize(width, height);
        
        if (this.game?.resize) {
            this.game.resize(width, height);
        }
    };

    private addEvents() { 
        window.onfocus = () => this.pause();
        window.onblur = () => this.paused = true;
    }

    private pause() {
        if (!this.paused) return;

        this.game.pause();
        this.resumeButton.visible = true;
    }
}
