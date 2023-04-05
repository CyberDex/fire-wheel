import { AppScreen } from '../components/basic/AppScreen';
import { SmallIconButton } from '../components/SmallIconButton';
import { game, SceneData } from '../Game';
import { TitleScreen } from './TitleScreen';
import { Windows } from '../config/windows';
import { InfoWindow } from '../components/windows/InfoWindow';
import { FireGame } from '../games/FireGame';
import { IGame } from '../games/IGame';
import { Text } from '@pixi/text';
import { Sprite } from '@pixi/sprite';
import { colors } from '../config/colors';
import { Position } from '@pixi/layout';
import { Button } from '../components/basic/Button';
import i18n from '../config/i18n';
import { gsap } from 'gsap';

export type GameTypes = 'fire';

export class GameScreen extends AppScreen { // GameScreen extends AppScreen, which is a Layout with a few additional features
    public static assetBundles = ['game']; // asset bundles that will be loaded before the screen is shown
    private gameType: GameTypes = 'fire'; // game type
    private game!: IGame; // game instance
    private resumeButton!: Button;
    private paused = false;

    constructor(options?: SceneData) { // constructor accepts an object with data that will be passed to the screen when it is shown
        super('GameScreen'); // Creates Layout with id 'GameScreen'

        game.addBG(); 

        this.game = new FireGame(this);
        this.game.init();
        
        this.addBackButton(); // add pause button component to the screen
        
        this.addResumeButton(); // add resume button component to the screen

        this.createWindows(options?.window); // create windows

        this.addInfo();

        this.addEvents();
    }

    /** Create windows. 
     * Windows are Layout based components that are shown on top of the screen.
    */
    private createWindows(
        activeWindow?: Windows // active window to show
        ) { 
        this.addWindow(Windows.info, new InfoWindow(this.views, `
                TODO: add description here
            `)); // create InfoWindow

            this.addInfoButton(); // add info button component to the screen

            this.showActiveWindow(activeWindow); // show active window
    }

    /** Add pause button component to the screen.
     * Pause button suits to pause the game and show the pause window and the title screen.
     */
    private addBackButton() {
        const button = new SmallIconButton('HomeIcon', () => { // create a button with a custom icon
            game.showScreen( // show TitleScreen with default window (pauseWindow) opened
                TitleScreen, // screen to show
                {
                    window: Windows.pause // show screen with PauseWindow opened
                }
            ); 

            game.bg.resetFilter();
            game.bg.pause();
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

    private addInfoButton() {
        const button = new SmallIconButton('InfoIcon', () => { // create a button with a custom icon
            this.views.show(Windows.info);
        });

        this.addContent({ // add content to the screen layout
            content: {
                content: button,
                styles: {
                    marginRight: -button.width / 2 + 20,
                    paddingTop: button.height / 2 + 20
                }
            },
            styles: { // set styles for the button block
                position: 'topRight', // position the button in the bottom right corner of the parent
                scale: 0.35, // scale button 0.5 times
                maxWidth: '14%', // set max width to 20% of the parent width so the layout witt scale down if the screen width is too small to fit it
                maxHeight: '20%', // set max height to 20% of the parent height so the layout witt scale down if the screen height is too small to fit it
            },
        });
    }

    private addInfoPanel(id: string, position: Position, value?: string) {
        const bg = Sprite.from('ValueBG');

        this.addContent({
            content: {
                id,
                content: value ?? ' ',
                styles: {
                    display: 'block',
                    marginTop: 20,
                    color: 'white',
                    fontSize: 30,
                    fontFamily: 'Days One',
                    textAlign: 'center',
                    stroke: colors.disabledStroke,
                    strokeThickness: 4,
                }
            },
            styles: { // set styles for the button block
                background: bg,                
                position, // position the button in the bottom right corner of the parent
                scale: 0.35, // scale button 0.5 times
                maxWidth: '30%', // set max width to 20% of the parent width so the layout witt scale down if the screen width is too small to fit it
                maxHeight: '20%', // set max height to 20% of the parent height so the layout witt scale down if the screen height is too small to fit it
                margin: 10, // move the button 10px down
                marginLeft: 0,
                width: bg.width,
                height: bg.height,
            },
        });
    }

    private updateInfo(panelID: string, value: string) {
        const panel = this.getChildByID(panelID)?.children[0] as Text;

        if (panel) { 
            panel.text = value;
        }
    }

    /** Method that is called one every game tick (see Game.ts) */
    onUpdate() {
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

    private addInfo() {
        this.game.onStateChange.connect((prop: string, val: number) => {
            if (prop === 'activeItemID') {
                const total = this.game.items?.length ?? 0;
                const progress = total - val - 1;
                this.updateInfo('progress', `${progress} / ${total}`);
            }
        });
        this.addInfoPanel('progress', 'centerTop');
    }

    private addEvents() { 
        window.onfocus = () => this.pause();
        window.onblur = () => this.paused = true;
    }

    private pause() {
        if (!this.paused) return;

        if (this.gameType === 'fire') return;

        this.game.pause();
        this.resumeButton.visible = true;
    }
}
