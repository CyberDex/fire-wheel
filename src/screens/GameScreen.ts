import { AppScreen } from '../components/AppScreen';
import { SmallIconButton } from '../components/SmallIconButton';
import { app } from '../App';
import { TitleScreen } from './TitleScreen';
import { Game } from '../game/Game';
import { Fire } from '../components/Fire';
import { Texture } from '@pixi/core';
import { TilingSprite } from '@pixi/sprite-tiling';
import { gameConfig } from '../config/gameConfig';

export class GameScreen extends AppScreen {
    public static assetBundles = ['game'];
    private game!: Game;

    constructor() {
        super('GameScreen');

        app.addBG(); 

        this.addGame();
        
        this.addBottomFire();

        this.addBackButton();
    }

    private addGame() { 
        this.game = new Game().init();

        this.addContent({
            content: this.game,
            styles: {
                position: 'center',
                width: gameConfig.radius * 2,
                height: gameConfig.radius * 2,
                maxWidth: '60%',
                maxHeight: '60%',
            }
        });
    }

    private addBottomFire() { 
        const base = new TilingSprite(Texture.EMPTY);
        
        base.width = 1920;
        base.height = 50;
        
        new Fire(base);

        this.addContent({
            content: base,
            styles: {
                position: 'bottomCenter',
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
}
