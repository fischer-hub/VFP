import { Player } from '../src/Player.js';
import Collectable from '../src/Collectable.js';


export default class Bedroom extends Phaser.Scene {
    constructor() {
        super('Bedroom'); // <-- scene key
    }

    preload() {
        // Load any assets needed for this scene
        this.load.image('bgBedroom', 'sprites/bedroom/bedroom.png');
        this.load.image('laserpointer', 'sprites/bedroom/laserpointer.png');

        // load spritesheets
        this.load.spritesheet('vaccine', 'sprites/bedroom/vaccine.png', { frameWidth: 320, frameHeight: 180 });

    }

    create() {
        // Add a background or some content
        this.add.image(0, 0, 'bgBedroom').setOrigin(0);
        //this.add.image(225, 106, 'laserpointer').setOrigin(0);
        this.add.sprite(0, 0, 'vaccine').setOrigin(0);
        this.player = new Player(this, 160, 175)
        new Collectable(this, 'laserpointer', 225, 106, this.player);

        this.anims.create({
            key: 'vaccine',
            frames: this.anims.generateFrameNumbers('vaccine_anim', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
          });

        this.walkArea = new Phaser.Geom.Polygon([
            320, 180,
            236.44444444444443, 95.1111111111111,
            214.2222222222222, 96.59259259259258,
            231.4074074074074, 155.5185185185185,
            80.29629629629629, 155.92592592592592,
            80.88888888888889, 155.77777777777777,
            87.7037037037037, 145.1851851851852,
            90.07407407407406, 111.1111111111111,
            75.55555555555556, 109.33333333333333,
            0, 180
          ]);

        if (false){
          const graphics = this.add.graphics();
          graphics.lineStyle(2, 0x00ff00, 1);
          graphics.strokePoints(this.walkArea.points, true);
        }
    }

    update(time, delta) {
        // Update logic if needed
    }
}
