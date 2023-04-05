import { Container } from "@pixi/display";
import { BitmapText, IBitmapTextStyle } from '@pixi/text-bitmap';
import { List } from "@pixi/ui";
import { Sprite } from "@pixi/sprite";

export type FancyTextOptions = {
    text: string,
    images?: string[],
    style?: Partial<IBitmapTextStyle>
}

export class FancyText extends Container {
    private list: List;

    constructor(options: FancyTextOptions) {
        super();

        this.list = new List({
            type: 'horizontal',
        });
        this.addChild(this.list);

        this.init(options);
    }

    init({ images, text, style }: FancyTextOptions) {
        const textData: {
            image?: string,
            text: string,
        }[] = []
        
        if (images) {
            let pointer = 0;
            
            images?.forEach((image,) => {
                const index = text.indexOf(image);

                if (index !== -1) {
                    textData.push({
                        image,
                        text: text.slice(pointer, index)
                    });

                    text = text.replace(image, '');
                }

                pointer = index;
            });

            if (pointer < text.length) {
                textData.push({ text: text.slice(pointer) });
            }
        }
        
        textData.forEach((data) => {
            const text = new BitmapText(data.text, style);
            this.list.addChild(text);

            if (data.image) {
                const sprite = Sprite.from(data.image);
                sprite.scale.set(text.height / sprite.height);
                this.list.addChild(sprite);
            }
        });
    }
}