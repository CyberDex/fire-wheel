import { AppScreen } from '../components/AppScreen';
import { SmallIconButton } from '../components/SmallIconButton';
import { app } from '../App';
import { TitleScreen } from './TitleScreen';
import { Game } from '../games/Game';
import { Fire } from '../components/Fire';
import { Texture } from '@pixi/core';
import { TilingSprite } from '@pixi/sprite-tiling';
import { wheelConfig } from '../config/wheelConfig';
import { startBalance } from '../config';
import { Text } from '@pixi/text';

export class GameScreen extends AppScreen {
    public static assetBundles = ['game'];
    private game!: Game;
    private fire!: Fire;
    private balanceText!: Text;

    constructor() {
        super('GameScreen');

        app.addBG(); 

        this.addGame();
        
        this.addBottomFire();

        this.addBackButton();

        this.addBalance(startBalance);
    }

    private addGame() { 
        this.game = new Game({
            balance: 1000,
        }).init();

        this.game.onStateChange.connect((key, value) => { 
            if (key === 'balance') {
                this.updateBalance(value);
            }
        });

        this.addContent({
            content: this.game,
            styles: {
                position: 'center',
                width: wheelConfig.radius * 2,
                height: wheelConfig.radius * 2,
                maxWidth: '80%',
                maxHeight: '80%',
            }
        });
    }

    private addBottomFire() { 
        const base = new TilingSprite(Texture.EMPTY);
        
        base.width = 1920;
        base.height = 50;
        
        this.fire = new Fire(base);

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

    private addBalance(balance: number) { 
        this.balanceText = new Text(balance.toString());

        this.addContent({
            content: this.balanceText,
            styles: {
                margin: 20,
                position: 'topRight',
                maxWidth: '33%',
                fill: 0xFFFFFF,
                fontSize: 32,
                fontFamily: 'Days One',
                stroke: 0xff622c,
                strokeThickness: 3,
            }
        });
    }

    private updateBalance(balance: number) { 
        this.balanceText.text = balance.toString();
    }

    onUpdate() {
        this.fire?.update();

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
}
