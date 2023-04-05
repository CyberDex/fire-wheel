export const fireWidthSmoke = (x: number, y: number, w: number, h: number) => ({
    "lifetime": {
        "min": 0.5,
        "max": 0.7
    },
    "frequency": 0.00008,
    "emitterLifetime": 0,
    "maxParticles": 10000,
    "addAtBack": false,
    "pos": {
        "x": 0,
        "y": 0
    },
    "behaviors": [
        {
            "type": "alpha",
            "config": {
                "alpha": {
                    "list": [
                        {
                            "value": 0.62,
                            "time": 0
                        },
                        {
                            "value": 0,
                            "time": 0.6
                        },
                        {
                            "value": 0,
                            "time": 0.7
                        },
                        {
                            "value": 0.8,
                            "time": 0.71
                        },
                        {
                            "value": 0,
                            "time": 1
                        }
                    ],
                    "isStepped": false
                }
            }
        },
        {
            "type": "moveSpeed",
            "config": {
                "speed": {
                    "list": [
                        {
                            "value": 500,
                            "time": 0
                        },
                        {
                            "value": 450,
                            "time": 0.7
                        },
                        {
                            "value": 450,
                            "time": 1
                        }
                    ],
                    "isStepped": true
                },
                "minMult": 1
            }
        },
        {
            "type": "scale",
            "config": {
                "scale": {
                    "list": [
                        {
                            "value": 0.25,
                            "time": 0
                        },
                        {
                            "value": 0.75,
                            "time": 1
                        }
                    ],
                    "isStepped": false
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
                            "value": "fff191",
                            "time": 0
                        },
                        {
                            "value": "ff622c",
                            "time": 0.6
                        },
                        {
                            "value": "333232",
                            "time": 0.7
                        },
                        {
                            "value": "333333",
                            "time": 1
                        }
                    ],
                    "isStepped": false
                }
            }
        },
        {
            "type": "rotation",
            "config": {
                "accel": 0,
                "minSpeed": 50,
                "maxSpeed": 50,
                "minStart": 265,
                "maxStart": 275
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
                    x,
                    y,
                    w,
                    h,
                }
            }
        }
    ]
});

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
        "behaviors": fireBehaviors(width)
    }
};

export const fireBehaviors = (width: number) => {
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
                "min": 500,
                "max": 500
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
                "minStart": 265,
                "maxStart": 275
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
                    h: 100,
                }
            }
        }
    ];
}

export const explode = () => {
    return {
        "alpha": {
            "start": 0.8,
            "end": 0.1
        },
        "scale": {
            "start": 1,
            "end": 0.3,
            "minimumScaleMultiplier": 1
        },
        "color": {
            "start": "#fb1010",
            "end": "#f5b830"
        },
        "speed": {
            "start": 200,
            "end": 100,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 0,
            "y": 0
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 0,
            "max": 360
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 0,
            "max": 0
        },
        "lifetime": {
            "min": 0.5,
            "max": 0.5
        },
        "blendMode": "normal",
        "frequency": 0.008,
        "emitterLifetime": 0.31,
        "maxParticles": 1000,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
            "x": 0,
            "y": 0,
            "r": 10
        }
    }
}

export const fireTextures = [
    "assets/particle.png",
    "assets/fireParticle.png",
    "assets/smoke.png",
];