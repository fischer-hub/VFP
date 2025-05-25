import {Cursor} from './CursorManager.js';

export default class Collectable extends Phaser.GameObjects.Sprite {
    constructor(scene, spriteKey, x, y, player) {
        super(scene, x, y, spriteKey);

        const hitbox = this.getNonTransparentBounds(scene, spriteKey)
        console.log(hitbox)

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this); // optional, if you want overlap checks
        this.setInteractive(hitbox, Phaser.Geom.Rectangle.Contains);
        this.setOrigin(0,0);

        // Store data
        this.spriteKey = spriteKey;
        this.sound = scene.sound.add('collect_snd');

        // Play default frame
        //this.play(`${spriteKey}`);

        // Setup interactions
        this.on('pointerover', () => Cursor.grab());
        this.on('pointerout', () => Cursor.reset());
        this.on('pointerdown', () => {

        player.isMoving = true
        player.moveTo(x, y, player.crouch())
        if(player.no_collision){
            //player.crouch()
            if (this.sound) this.sound.play();
            scene.time.delayedCall(900, () => { this.visible = false; });
        }
        player.isMoving = false
    });
    }

    getNonTransparentBounds(scene, spriteKey, frameIndex = 0) {
        const frame = scene.textures.getFrame(spriteKey, frameIndex);
        const sourceImage = scene.textures.get(spriteKey).getSourceImage();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = frame.width;
        canvas.height = frame.height;

        ctx.drawImage(sourceImage, frame.cutX, frame.cutY, frame.width, frame.height, 0, 0, frame.width, frame.height);
        const imageData = ctx.getImageData(0, 0, frame.width, frame.height).data;

        let minX = frame.width, minY = frame.height, maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < frame.height; y++) {
            for (let x = 0; x < frame.width; x++) {
                const idx = (y * frame.width + x) * 4;
                const alpha = imageData[idx + 3];
                if (alpha > 0) {
                    found = true;
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (!found) return new Phaser.Geom.Rectangle(0, 0, frame.width, frame.height);

        return new Phaser.Geom.Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
    }
}
