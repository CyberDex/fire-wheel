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
                    name: 'fireGradient',
                    srcs: 'assets/fireGradient.png',
                },
                {
                    name: 'avatar-01',
                    srcs: 'assets/avatar-01.png',
                },
                {
                    name: 'avatar-02',
                    srcs: 'assets/avatar-02.png',
                },
                {
                    name: 'avatar-03',
                    srcs: 'assets/avatar-03.png',
                },
                {
                    name: 'avatar-04',
                    srcs: 'assets/avatar-04.png',
                },
                {
                    name: 'avatar-05',
                    srcs: 'assets/avatar-05.png',
                },
                {
                    name: 'bg',
                    srcs: 'assets/Examples/BG.png',
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
                    name:'SmallButton-substrate', 
                    srcs: 'assets/Window/SmallButton-substrate.png'
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
                    name:'ValueBG', 
                    srcs: 'assets/Progress/ValueBG.png'
                },
                {
                    name:'MediumSubstrate', 
                    srcs: 'assets/Window/MediumSubstrate.png'
                },
                {
                    name:'Substrate', 
                    srcs: 'assets/Window/Substrate.png'
                },
                {
                    name:'MenuWindow', 
                    srcs: 'assets/Window/MenuWindow.png'
                },
                {
                    name:'Ribbon', 
                    srcs: 'assets/Window/Ribbon.png'
                },
                {
                    name:'Window', 
                    srcs: 'assets/Window/Window.png'
                },
                {
                    name:'HomeIcon', 
                    srcs: 'assets/Icons/HomeIcon.png'
                },
                {
                    name:'CloseIcon', 
                    srcs: 'assets/Icons/CloseIcon.png'
                },
                {
                    name:'InfoIcon', 
                    srcs: 'assets/Icons/InfoIcon.png'
                },
                {
                    name:'SmallSubstrate', 
                    srcs: 'assets/Window/SmallSubstrate.png'
                },
            ],
        },
        {
            name: 'emoji',
            assets: [
                {
                    name: 'emoji',
                    srcs: 'assets/emoji.png',
                },
            ],
        },
        {
            name: 'fire',
            assets: [
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
            ],
        },
    ],
};
