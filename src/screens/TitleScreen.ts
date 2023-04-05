import { AppScreen } from '../components/basic/AppScreen';
import { Windows } from '../config/windows';
import { game } from '../Game';
import { GameScreen } from './GameScreen';
import { gitHubURL } from '../config';
import { Button } from '../components/basic/Button';
import i18n from '../config/i18n';

/** Title screen. 
 * To be used to show when game is on pause or before the game starts.
*/
export class TitleScreen extends AppScreen { // extends AppScreen that extends Layout that extends PIXI.Container
    public static assetBundles = ['game']; // set section of assets to preload for this screen. Section is defined in assets.json. Handled by AssetLoader.
    
    override defaultWindow = Windows.pause; // default window to show

    constructor() {
        super('TitleScreen'); // Creates Layout with id 'TitleScreen'
        
        game.addBG(); 

        const startButton = new Button( // create a levels window navigational button
            i18n.titleScreen.menu.play, // button text
            () => {
                game.showScreen(GameScreen);
            }
        );

        const githubButton = new Button( // create a levels window navigational button
            i18n.titleScreen.menu.repo, // button text
            () => {
                (window as any).open(gitHubURL, '_blank').focus();
            }
        );

        this.addContent({ // add the buttons to the window layout system
            menu: { // menu is the id of the layout
                content: {
                    startButton: {
                        content: startButton,
                        styles: {
                            position: 'center',
                            paddingLeft: 90,
                            maxWidth: '100%'
                        }
                    },
                    githubButton: {
                        content: githubButton,
                        styles: {
                            position: 'centerBottom',
                            paddingLeft: 90,
                            maxWidth: '40%',
                            maxHeight: '10%',
                            marginBottom: 20
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
