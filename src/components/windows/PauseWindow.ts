import { Sprite } from "@pixi/sprite";
import i18n from "../../config/i18n";
import { Button } from "../basic/Button";
import { Window as BasicWindow } from "../basic/Window";
import { game } from '../../Game';
import { GameScreen, GameTypes } from '../../screens/GameScreen';
import { LayoutOptions } from "@pixi/layout";
import { gitHubURL } from "../../config";

/** Game menu component. */
export class PauseWindow extends BasicWindow {
    constructor() { // pass the ViewController to the constructor to be able to control the views
        // give config differences to the Window base component
        super({ // Window constructor accepts an object with all the config
            title: i18n.titleScreen.menu.title, // menu title text
            styles: { // styles is an object with all the styles that will be applied to the window
                background: Sprite.from('MenuWindow'), // menu window background
                maxHeight: '80%', // set max height to 80% of parent, so it will scale down to fit the screen height on canvas resize
                maxWidth: '95%', // set max width to 95% of parent, so it will scale down to fit the screen width on canvas resize
            },
            ribbonStyles: { // ribbonStyles is an object with all the styles that will be applied to the ribbon layout
                marginTop: -27, // move the ribbon 27px up from the top of the parent
                scale: 0.7 // scale the ribbon sprite to 70% of it's original size
            }
        });
    }

    /** Create content of the component. Automatically called by extended class (see  Window.ts). */
    override createContent() { 
        const menuButtons: {
            [name: string]: LayoutOptions;
        } = {}; // create an array to store menu buttons

        const items: { [name: string]: string } = i18n.titleScreen.menu.items;

        for (const gameType in items) {
            const text = items[gameType]; // get the text for the button from the i18n file
            
            menuButtons[gameType] = { // levels is the id of the button
                content: new Button( // create a levels window navigational button
                        text, // button text
                        () => this.selectMenuItem(gameType as GameTypes), // button click callback
                    ), // content is the button component
                styles: { // styles is an object with all the styles that will be applied to the button
                    marginTop: 100, // move the button 10px down from the neighbour buttons
                }
            };
        }

        this.addContent({ // add the buttons to the window layout system
            menu: { // menu is the id of the layout
                content: menuButtons, // content is an array of all the components that will be added to the layoutSystem
                styles: { // styles is an object with all the styles that will be applied Sto the layout
                    position: 'centerTop', // center the layout in the middle of the parent
                    marginTop: 120, // move the layout 120px down from the top of the parent
                    width: '66%', // set width to 66% of parent, so children will be able to use 66% of the screen width
                }
            }
        });
    }

    /** Select menu item. */
    private selectMenuItem(gameType: GameTypes | 'repo') {
        switch (gameType) {
            case 'repo':
                (window as any).open(gitHubURL, '_blank').focus();
                break;
            default:
                game.showScreen(GameScreen, {  // show the game screen
                    type: gameType, // pass the level type to the game screen
                })
        }
    }
}