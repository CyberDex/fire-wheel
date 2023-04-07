import { ResolverManifest } from "@pixi/assets";

export const assetsManifest: ResolverManifest = {
    bundles: [
        {
            name: 'preload',
            assets: [
                {
                    name: 'spinner',
                    srcs: 'assets/spinner.png',
                },
                {
                    name: 'pixi-logo',
                    srcs: 'assets/pixi-logo.png',
                },
            ],
        },
        {
            name: 'game',
            assets: [
                {
                    name: 'fire-storm',
                    srcs: 'assets/sounds/fire-storm.mp3',
                },
                {
                    name: 'credits-rollup',
                    srcs: 'assets/sounds/credits-rollup.wav',
                },
                {
                    name: 'wheel-click',
                    srcs: 'assets/sounds/wheel-click.wav',
                },
                {
                    name: 'wheel-landing',
                    srcs: 'assets/sounds/wheel-landing.wav',
                },
                {
                    name: 'bg',
                    srcs: 'assets/bg.jpg',
                },
                {
                    name: 'fire',
                    srcs: 'assets/fireParticle.png',
                },
                {
                    name: 'particle',
                    srcs: 'assets/particle.png',
                },
                {
                    name: 'smoke',
                    srcs: 'assets/smoke.png',
                },
                {
                    name:'SmallButton-disabled', 
                    srcs: 'assets/Buttons/SmallButton-disabled.png'
                },
                {
                    name:'SmallButton-hover', 
                    srcs: 'assets/Buttons/SmallButton-hover.png'
                },
                {
                    name:'SmallButton', 
                    srcs: 'assets/Buttons/SmallButton.png'
                },
                {
                    name:'Button-pressed', 
                    srcs: 'assets/Buttons/Button-pressed.png'
                },
                {
                    name:'SmallButton-pressed', 
                    srcs: 'assets/Buttons/SmallButton-pressed.png'
                },
                {
                    name:'Button-hover', 
                    srcs: 'assets/Buttons/Button-hover.png'
                },
                {
                    name:'Button-disabled', 
                    srcs: 'assets/Buttons/Button-disabled.png'
                },
                {
                    name:'Button', 
                    srcs: 'assets/Buttons/Button.png'
                },
                {
                    name:'HomeIcon', 
                    srcs: 'assets/Icons/HomeIcon.png'
                },
            ],
        }
    ],
};
