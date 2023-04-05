import { FancyButton } from "@pixi/ui";

/** Config is applied to a FancyButton, so it can be used without setting a config. */
export class SmallIconButton extends FancyButton {
    constructor(
        icon: string, // icon for the button
        onclick: () => void, // callback for the button press
        ) {
        super({ // create the FancyButton component
            defaultView: `SmallButton-disabled`, // this is a key to the texture atlas for default button state view
            hoverView: `SmallButton-hover`, // this is a key to the texture atlas for hover button state view
            pressedView: `SmallButton-pressed`, // this is a key to the texture atlas for pressed button state view
            disabledView: `SmallButton-disabled`, // this is a key to the texture atlas for disabled button state view
            icon, // this is a key to the texture atlas for icon
            iconOffset: { // offset for the icon
                y: -10, // move icon up
            },
            animations: { // animations config for button states
                hover: { // animation for hover state
                    props: { // props to animate
                        scale: { x: 1.03, y: 1.03 }, // scale up button on hover
                        y: 0 // reset button y position on hover
                    },
                    duration: 100 // animation duration
                },
                pressed: { // animation for pressed state
                    props: { // props to animate
                        scale: { x: 0.9, y: 0.9 }, // scale down button on press
                        y: 10 // move button down on press
                    },
                    duration: 100 // animation duration
                }
            }
        });

        this.onPress.connect(onclick); // connect button press event to the provided callback
        
        this.anchor.set(0.5); // set button anchor to the center, this is needed for the button to scale correctly when animated
    }
};