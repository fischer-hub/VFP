import AnimatedButton from '../src/AnimatedButton.js';

export default class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory', active: false });
    }

    preload() {
        this.load.image('game_slots', 'sprites/inventory.png'); // Your background image
        this.load.spritesheet('save_btn', 'sprites/save_btn.png', {frameWidth: 320, frameHeight: 180});

    }

    create() {
        this.bg = this.add.rectangle(0, 0, 320, 180, 0x000000, 0.5).setOrigin(0, 0);
        this.add.image(0, 0, 'game_slots').setOrigin(0,0);

        new AnimatedButton(this, 'save_btn',  () => { 
            SaveManager.save(gameState)
         });

        // Optional: press E to close as well
        this.input.keyboard.on('keydown-E', () => {
            this.scene.stop();
        });
    }
}
