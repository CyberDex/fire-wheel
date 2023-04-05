import { AppScreen } from '../components/basic/AppScreen';
import { PauseWindow } from '../components/windows/PauseWindow';
import { Windows } from '../config/windows';
import { game, SceneData } from '../Game';

/** Title screen. 
 * To be used to show when game is on pause or before the game starts.
*/
export class TitleScreen extends AppScreen { // extends AppScreen that extends Layout that extends PIXI.Container
    public static assetBundles = ['game']; // set section of assets to preload for this screen. Section is defined in assets.json. Handled by AssetLoader.
    
    override defaultWindow = Windows.pause; // default window to show

    constructor(options?: SceneData) {
        super('TitleScreen'); // Creates Layout with id 'TitleScreen'
        
        game.addBG(); 

        this.createWindows(options?.window); // create windows
    }

    /** Create windows. 
     * Windows are Layout based components that are shown on top of the screen.
    */
    private createWindows(
        activeWindow?: Windows // active window to show
        ) { 
        this.addWindow(Windows.pause, new PauseWindow()); // create PauseWindow

        this.showActiveWindow(activeWindow); // show active window
    }
}
