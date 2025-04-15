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

    }

    update(time, delta) {
        // Update logic if needed
    }
}
