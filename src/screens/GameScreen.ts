import { AppScreen } from '../components/AppScreen';
import { SmallIconButton } from '../components/SmallIconButton';
import { app } from '../App';
import { TitleScreen } from './TitleScreen';
import { Game } from '../game/Game';
import { Fire } from '../components/Fire';
import { Texture } from '@pixi/core';
import { TilingSprite } from '@pixi/sprite-tiling';
import { gameConfig } from '../config/gameConfig';
import { sound } from '@pixi/sound';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';

export class GameScreen extends AppScreen {
    public static assetBundles = ['game'];
    private game!: Game;
    private mutedIcon!: Sprite;

    constructor() {
        super('GameScreen');

        app.addBG(); 
        this.addGame();
        this.addBottomFire();
        this.addBackButton();
        this.addMuteButton();

        this.updateSound();
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
        
        base.width = 2000;
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
            this.game.stop();
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

    private addMuteButton() {
        const muteIcon = new Container();
        muteIcon.addChild(
            Sprite.from('MusicIcon'),
            this.mutedIcon = Sprite.from('CloseIcon')
        );

        this.mutedIcon.scale.set(0.7);
        this.mutedIcon.x = 10;
        this.mutedIcon.y = 10;

        this.mutedIcon.tint = 0xFF0000;

        const muteButton = new SmallIconButton(muteIcon, () => { // create a button with a custom icon
            localStorage.getItem('muted') === 'true' ? localStorage.setItem('muted', 'false') : localStorage.setItem('muted', 'true');

            this.updateSound();
        }, {
            x: 3,
            y: -10
        });
        
        this.addContent({ // add content to the screen layout
            content: {
                content: muteButton,
                styles: {
                    paddingLeft: muteButton.width / 2 + 20,
                    paddingTop: muteButton.height / 2 + 20
                }
            },
            styles: { // set styles for the button block
                position: 'rightTop', // position the button in the bottom right corner of the parent
                scale: 0.35, // scale button 0.5 times
                maxWidth: '33%', // set max width to 20% of the parent width so the layout witt scale down if the screen width is too small to fit it
                maxHeight: '20%', // set max height to 20% of the parent height so the layout witt scale down if the screen height is too small to fit it
                marginRight: -20,
            },
        });
    }

    private updateSound() { 
        if (localStorage.getItem('muted') === 'true') {
            sound.muteAll();
            this.mutedIcon.visible = true;
        } else {
            sound.unmuteAll();
            this.mutedIcon.visible = false;
        }
    }
}
