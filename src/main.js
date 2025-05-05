"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    width: 800,
    height: 600,
    scene: [Shooter],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);