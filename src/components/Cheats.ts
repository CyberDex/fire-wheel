import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { sound } from "@pixi/sound";
import { Text } from "@pixi/text";
import { CheckBox, RadioGroup } from "@pixi/ui";

export class Cheats extends Container {
    constructor(elements: (number | string)[], onChange: (data: { id: number; val: string }) => void) {
        super();
    
        const bgColor = 0xff622c;
        const fillColor = 0xFFFFFF;
        const width = 50;
        const height = 50;
        const padding = 5;
        const radius = 25;
    
        const items: CheckBox[] = [];

        const title = new Text('Result:', {
            fill: 0xFFFFFF,
            fontSize: 32,
            fontFamily: 'Days One',
            stroke: 0xff622c,
            strokeThickness: 3,
        });

        title.anchor.set(0, 0.5);
        title.y = -title.height;

        this.addChild(title);

        elements.sort((a, b) => {
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
        });

        elements.forEach((text) => {
            items.push(
                new CheckBox({
                    text: text.toString(),
                    style: {
                        unchecked: this.drawRadio({
                            color: bgColor,
                            width,
                            height,
                            padding,
                            radius,
                        }),
                        checked: this.drawRadio({
                            color: bgColor,
                            fillColor,
                            width,
                            height,
                            padding,
                            radius,
                        }),
                        text: {
                            fill: 0xFFFFFF,
                            fontSize: 22,
                            fontFamily: 'Days One',
                            stroke: 0xff622c,
                            strokeThickness: 3,
                        },
                    },
                }),
            );
        });

        // Component usage
        const radioGroup = new RadioGroup({
            selectedItem: 0,
            items,
            type: 'vertical',
            elementsMargin: 10,
        });

        radioGroup.onChange.connect((selectedItemID: number, selectedVal: string) => {
            sound.play('button');
            onChange({ id: selectedItemID, val: selectedVal });
        });

        this.addChild(radioGroup.innerView);
    }
    
    private drawRadio({ color, fillColor, width, height, radius, padding }: GraphicsType)
    {
        const graphics = new Graphics().beginFill(color);

        const isCircle = width === height && radius >= width / 2;

        if (isCircle)
        {
            graphics.drawCircle(width / 2, width / 2, width / 2);
        }
        else
        {
            graphics.drawRoundedRect(0, 0, width, height, radius);
        }

        if (fillColor !== undefined)
        {
            graphics.beginFill(fillColor);

            const center = width / 2;

            if (isCircle)
            {
                graphics.drawCircle(center, center, center - padding);
            }
            else
            {
                graphics.drawRoundedRect(
                    padding,
                    padding,
                    width - (padding * 2),
                    height - (padding * 2),
                    radius,
                );
            }
        }

        return graphics;
    }
    
}

type GraphicsType = {
    color: number;
    fillColor?: number;
    width: number;
    height: number;
    radius: number;
    padding: number;
};