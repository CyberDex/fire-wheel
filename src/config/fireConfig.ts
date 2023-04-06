export type Quality = 'low' | 'medium' | 'high';

export function getQualityData(quality: Quality): { frequency: number, maxParticles: number } {
    switch (quality) {
        case 'low':
            return {
                frequency: 0.0008,
                maxParticles: 1000,
            };
        case 'medium':
            return {
                frequency: 0.00001,
                maxParticles: 2000,
            };
        case 'high':
            return {
                frequency: 0.00009,
                maxParticles: 10000,
            };
    }
}

export const fireConfig = (
    width: number,
    height: number,
    quality: Quality
) => {
    return {
        "lifetime": {
            "min": 0.5,
            "max": 0.7
        },
        "frequency": getQualityData(quality).frequency,
        "emitterLifetime": 0,
        "maxParticles": getQualityData(quality).maxParticles,
        "addAtBack": false,
        "pos": {
            "x": 0,
            "y": 0
        },
        "behaviors": fireBehaviors(width, height)
    }
};

export const fireBehaviors = (width: number, height: number) => {
    return [
        {
            "type": "alpha",
            "config": {
                "alpha": {
                    "list": [
                        {
                            "time": 0,
                            "value": 0.62
                        },
                        {
                            "time": 1,
                            "value": 0
                        }
                    ]
                }
            }
        },
        {
            "type": "moveSpeedStatic",
            "config": {
                "min": 200,
                "max": 300
            }
        },
        {
            "type": "scale",
            "config": {
                "scale": {
                    "list": [
                        {
                            "time": 0,
                            "value": 0.25
                        },
                        {
                            "time": 1,
                            "value": 0.75
                        }
                    ]
                },
                "minMult": 1
            }
        },
        {
            "type": "color",
            "config": {
                "color": {
                    "list": [
                        {
                            "time": 0,
                            "value": "fff191"
                        },
                        {
                            "time": 1,
                            "value": "ff622c"
                        }
                    ]
                }
            }
        },
        {
            "type": "rotation",
            "config": {
                "accel": 0,
                "minSpeed": 50,
                "maxSpeed": 50,
                "minStart": 250,
                "maxStart": 290
            }
        },
        {
            "type": "textureRandom",
            "config": {
                "textures": fireTextures
            }
        },
        {
            "type": "spawnShape",
            "config": {
                type: 'rect',
                data: {
                    x: 0,
                    y: 0,
                    w: width,
                    h: height,
                }
            }
        }
    ];
}

export const fireTextures = [
    "assets/particle.png",
    "assets/fireParticle.png",
    "assets/smoke.png",
];