export const challenges: {
    [key: string]: string;
} = {
    sprites: `    Create 144 sprites (NOT graphics object), that are stacked on each other like cards in a deck, (so object above covers bottom one, but not completely).

    Every second 1 object from top of stack goes to other stack - animation of moving should be 2 seconds long. So at the end of whole process you should have reversed stack. Display number of fps in left top corner and make sure, that this demo runs well on mobile devices.`,
    
    
    emoji: `
        Create a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or prices with money icon). 

        It should come up every 2 seconds a random text with images in random configuration(image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size.`,

    fire: `
        Particles - make a demo that shows an awesome fire effect.
        
        Please keep number of images low (max 10 sprites on screen at once). Feel free to use existing libraries how you would use them in a real project.`,
}