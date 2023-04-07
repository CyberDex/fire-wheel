import { AppScreen } from '../components/AppScreen';
import { app } from '../App';
import { GameScreen } from './GameScreen';
import { gitHubURL } from '../config';
import { Button } from '../components/Button';
import i18n from '../config/i18n';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { Fire } from '../components/Fire';

/** Title screen. 
 * To be used to show when game is on pause or before the game starts.
*/
export class TitleScreen extends AppScreen { // extends AppScreen that extends Layout that extends PIXI.Container
    public static assetBundles = ['game']; // set section of assets to preload for this screen. Section is defined in assets.json. Handled by AssetLoader.
    private titleText!: Text;

    constructor() {
        super('TitleScreen'); // Creates Layout with id 'TitleScreen'
        
        app.addBG(); 

        const startButton = new Button( // create a levels window navigational button
            i18n.titleScreen.menu.play, // button text
            () => {
                app.showScreen(GameScreen);
            },
            {
                fontSize: 60,
                scale: 2
            }
        );

        const githubButton = new Button( // create a levels window navigational button
            i18n.titleScreen.menu.repo, // button text
            () => {
                (window as any).open(gitHubURL, '_blank').focus();
            }
        );

        const textContainer = new Container();
        this.titleText = new Text(i18n.titleScreen.title, {
            fontSize: 80,
            fontFamily: 'Days One',
            stroke: 0xff622c,
            strokeThickness: 3,
            align: 'center',
        });
        textContainer.addChild(this.titleText);

        const fireContainer = new Container();
        this.addChild(fireContainer);

        new Fire().init({
            parent: fireContainer,
            type: 'circular',
            size: {
                width: this.titleText.width,
                height: this.titleText.height
            }
        });

        this.addContent({ // add the buttons to the window layout system
            menu: { // menu is the id of the layout
                content: {
                    title: {
                        content: {
                            fire: {
                                content: fireContainer,
                                styles: {
                                    width: this.titleText.width,
                                    height: this.titleText.height,
                                    position: 'centerTop',
                                    maxHeight: '50%',
                                    maxWidth: '100%',   
                                }
                            },
                            titleText: {
                                content: textContainer, 
                                styles: {
                                    position: 'centerTop',
                                    maxHeight: '50%',
                                    maxWidth: '100%',
                                }
                            },
                            startButton: {
                                content: startButton,
                                styles: {
                                    position: 'centerBottom',
                                    paddingTop: 80,
                                    paddingLeft: 90,
                                    maxHeight: '50%',
                                    maxWidth: '90%',
                                }
                            }
                        },
                        styles: {
                            position: 'center',
                            width: '50%',
                            height: '50%',
                            maxWidth: '80%',
                            maxHeight: '80%',
                        }
                    },
                    githubButton: {
                        content: githubButton,
                        styles: {
                            position: 'centerBottom',
                            paddingLeft: 90,
                            maxWidth: '40%',
                            maxHeight: '10%',
                            paddingBottom: 20
                        }
                    }
                },
                styles: { // styles is an object with all the styles that will be applied Sto the layout
                    position: 'bottom', // center the layout in the middle of the parent
                    width: '100%',
                    height: '100%',
                }
            }
        });
    }
}
