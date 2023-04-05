import i18n from "../../config/i18n";
import { Window } from "../basic/Window";
import { ViewController } from "../../controllers/ViewController";
import { CloseButton } from '../CloseButton';
import { Button } from "../basic/Button";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { colors } from '../../config/colors';
import { ScrollBox } from "@pixi/ui";

/** Layout based component for the info window. */
export class InfoWindow extends Window { // extends Window class to get all the window functionality
    constructor(private views: ViewController, text: string) { // pass the ViewController to the constructor to be able to control the views
        // give config differences to the Window base component(Layout)
        super({ // Window constructor accepts an object with all the config
            title: i18n.titleScreen.info.title, // text title of the window
            styles: { // styles is an object with all the styles that will be applied to the window(Layout)
                maxWidth: '80%', // set max width to 80% of parent, so it will scale down to fit the screen width on canvas resize
                marginTop: -30, // set margin top to -30px, as there it a button on the bottom, this will make it fit the screen height
                marginBottom: 350, // set margin bottom to 350px, as there it a button on the bottom, this will make it fit the screen height
            }
        });

        this.addText(text); // add text to the window
    }

    /** Create content of the component. Automatically called by extended class(see Window.ts). */
    override createContent() { // override the createContent method from the Window class
        this.addCloseButton(); // add close button to the window

        this.addButton( // add accept button to the window
            i18n.titleScreen.info.accept, // button text
            () => { // button callback
                this.views.goBack(); // go back to the previous view
            });
    }

    /** Creates a button in bottomCenter of the window */
    private addButton(
        title: string, // button text
        callback: () => void, // button callback
        ) {
        const button = new Button(title, () => callback(), {
            fontSize: 60
        }); // create a button with the given text and callback

        this.addContent({ // add the button to the layout system of the Window
            content: button, // layout content is a 'Button' instance that extends `Layout`
            styles: { // styles is an object with all the styles that will be applied to the layout
                position: `bottomCenter`, // set position to bottomCenter of the parent size
                marginBottom: -80, // set bottom offset from the parent height
                width: 360, // set width so children position/sizes will be operated basing on it
                marginRight: 80, // set offset from the parent right side
            }
        });
    }

    /** Creates a close button in topRight of the window */
    private addCloseButton() {
        const closeButton = new CloseButton(() => { // create a close button with the given callback
            this.views.goBack(); // go back to the previous view
        });

        this.addContent({ // add the button to the layout system of the Window
            content: closeButton,
            styles: { // styles is an object with all the styles that will be applied to the layout
                position: 'right', // set position to right of the parent size
                marginTop: 50, // move the button 65px down from the top of the parent layout
                marginRight: -80, // move the button 70px left from the right of the parent layout
                width: closeButton.width, // set width so children position/sizes will be operated basing on it
            }
        });
    }

    /** Creates scrollable text blok and adds it to the window layout. */
    private addText(text: string) {
        const textBG = Sprite.from('SmallSubstrate'); // create a sprite from the texture with id 'SmallSubstrate'
        textBG.scale.set(1.2); // scale the sprite us a bit

        this.addContent({ // add the text to the layout system of the Window
            text: { // 'text' is the id of the layer
                content: new ScrollBox({ // layout content is a 'ScrollBox' instance that extends `Container`
                    width: textBG.width - 40, // width of the scroll box
                    height: textBG.height - 50, // height of the scroll box
                    radius: 100, // radius of the scroll box corners (mask will be applied to hide the content outside the box)
                    elementsMargin: 20, // margin between the elements (in this case it is only one element so it will be it's margins from the box)
                    type: 'vertical', // type of the scroll box, can be 'vertical' or 'horizontal'
                    padding: 25, // padding of the scroll box, will be applied to the content offset from the box
                    items: [ // array of the items that will be added to the scroll box, positioned basing on their sizes and margins one after another to be scrolled
                        new Text(text, { // create a `Text` instance with the given text
                            fill: colors.text,  // set text color
                            fontSize: 24, // set text size
                            fontFamily: 'Days One', // set text font
                            stroke: colors.hoverStroke, // set text stroke color
                            strokeThickness: 3, // set text stroke thickness
                            wordWrap: true, // set text word wrap
                            wordWrapWidth: textBG.width - 100, // set text word wrap width
                        })
                    ],
                }),
                styles: { // styles is an object with all the styles that will be applied to the layout
                    position: 'center', // set position to center of the parent size
                    width: textBG.width, // set width so children position/sizes will be operated basing on it (it this sase it is a sprite size)
                    height: textBG.height, // set height so children position/sizes will be operated basing on it (it this sase it is a sprite size)
                    padding: 25, // set padding so children position/sizes will be operated basing on it
                    overflow: 'hidden', // set overflow to hidden, so the content will be clipped by the parent size
                    background: textBG // set background of the layout to be a sprite instance
                }
            }
        });
    }
}