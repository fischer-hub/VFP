import AnimatedButton from '../src/AnimatedButton.js';

export default class LoadGame extends Phaser.Scene {
    constructor() {
        super('LoadGame');
    }

    preload() {
        this.load.image('bg', 'sprites/start_screen/bg.png'); // Your background image
        this.load.image('game_slots', 'sprites/inventory.png'); // Your background image

        // load start menu buttons
        this.load.spritesheet('back_btn', 'sprites/back_btn.png', {frameWidth: 320, frameHeight: 180});
        this.load.audio('btn_click_snd', 'sounds/button_click.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0,0);
        this.add.image(0, 0, 'game_slots').setOrigin(0,0);

        new AnimatedButton(this, 'back_btn', () => {this.scene.start('StartMenu')});

    }

}