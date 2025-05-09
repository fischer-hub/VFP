import { Player } from '../src/Player.js';

export default class Bedroom extends Phaser.Scene {
    constructor() {
        super('Bedroom'); // <-- scene key
    }

    preload() {
        // Load any assets needed for this scene
        this.load.image('bgBedroom', 'sprites/bedroom/bedroom.png');
    }

    create() {
        // Add a background or some content
        this.add.image(0, 0, 'bgBedroom').setOrigin(0);
        this.player = new Player(this, 100, 100)

        this.walkArea = new Phaser.Geom.Polygon([
            118, 68,
            33, 170,
            312, 178,
            206, 65,
            196, 65,
            229, 146,
            92, 160,
            118, 86,
            103, 84
          ]);
          const graphics = this.add.graphics();
          graphics.lineStyle(2, 0x00ff00, 1);
          graphics.strokePoints(this.walkArea.points, true);
    }

    update(time, delta) {
        // Update logic if needed
    }
}
