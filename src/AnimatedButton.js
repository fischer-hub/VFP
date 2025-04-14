export default class AnimatedButton extends Phaser.GameObjects.Sprite {
    constructor(scene, spriteKey, callback) {
        super(scene, 0, 0, spriteKey);

        const hitbox = this.getNonTransparentBounds(scene, spriteKey)

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this); // optional, if you want overlap checks
        this.setInteractive(hitbox, Phaser.Geom.Rectangle.Contains);
        this.setOrigin(0,0);

        // Store data
        this.spriteKey = spriteKey;
        this.sound = scene.sound.add('btn_click_snd');
        this.callback = callback;

        // Create animations uniquely scoped to this spriteKey
        this.createAnimations(scene);

        // Play default frame
        this.play(`${spriteKey}_rest`);

        // Setup interactions
        //this.on('pointerover', () => this.play(`${spriteKey}_hover`));
        //this.on('pointerout', () => this.play(`${spriteKey}_rest`));
        this.on('pointerdown', () => {
            this.play(`${spriteKey}_click`);
            if (this.sound) this.sound.play();
            if (this.callback) scene.time.delayedCall(800, () => { this.callback();} );
        });
    }

    createAnimations(scene) {
        // Avoid creating duplicate animations for the same spriteKey
        if (scene.anims.exists(`${this.spriteKey}_rest`)) return;

        scene.anims.create({
            key: `${this.spriteKey}_rest`,
            frames: scene.anims.generateFrameNumbers(this.spriteKey, { start: 0, end: 0 }),
            frameRate: 0
        });

        /* scene.anims.create({
            key: `${this.spriteKey}_hover`,
            frames: scene.anims.generateFrameNumbers(this.spriteKey, { start: 1, end: 1 }),
            frameRate: 0
        }); */

        scene.anims.create({
            key: `${this.spriteKey}_click`,
            frames: scene.anims.generateFrameNumbers(this.spriteKey, { start: 1, end: 0 }),
            frameRate: 3
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
