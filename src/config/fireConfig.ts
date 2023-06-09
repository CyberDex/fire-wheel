export type Quality = 'low' | 'medium' | 'high';
export type Shape = 'rectangular' | 'circular';

export function getQualityData(quality: Quality, type: Shape): {
    frequency: number,
    maxParticles: number
} {
    switch (`${quality}-${type}`) {
        case 'medium-rectangular':
            return {
                frequency: 0.0009,
                maxParticles: 7000,
            };
        case 'high-rectangular':
            return {
                frequency: 0.0004,
                maxParticles: 3000,
            };
        // case 'medium-circular':
        //     return {
        //         frequency: 0.00001,
        //         maxParticles: 2000,
        //     };
        // case 'high-circular':
        //     return {4
        //         frequency: 0.00009,
        //         maxParticles: 10000,
        //     };
        default:
            return {
                frequency: 0.0008,
                maxParticles: 1000,
            };
    }
}

export const fireConfig = (
    width: number,
    height: number,
    quality: Quality,
    shape: Shape = 'rectangular'
) => {
    return {
        "lifetime": {
            "min": 0.5,
            "max": 0.7
        },
        "frequency": getQualityData(quality, shape).frequency,
        "emitterLifetime": 0,
        "maxParticles": getQualityData(quality, shape).maxParticles,
        "addAtBack": false,
        "pos": {
            "x": 0,
            "y": 0
        },
        "behaviors": fireBehaviors(width, height, shape)
    }
};

export const fireBehaviors = (width: number, height: number, shape: Shape) => {
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
                "maxStart": 280
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
            "config": shapeConfig(shape, width, height)
        }
    ];
}

const shapeConfig = (shape: Shape, width: number, height?: number) => { 
    switch (shape) {
        case 'rectangular':
            return {
                type: 'rect',
                data: {
                    x: 0,
                    y: 0,
                    w: width,
                    h: height ?? 0,
                }
            }
        case 'circular':
            return {
                "type": "torus",
                "data": {
                    "x": width / 2,
                    "y": (width / 2) + width * 0.02,
                    "radius": width / 2,
                    "innerRadius": width / 2 + 10,
                    "affectRotation": false
                }
            }
            break;
    }
}

export const fireTextures = [
    "assets/particle.png",
    "assets/fireParticle.png",
    "assets/smoke.png",
];