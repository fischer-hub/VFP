import AnimatedButton from '../src/AnimatedButton.js';

export default class StartMenu extends Phaser.Scene {
    constructor() {
        super('StartMenu');
    }

    preload() {
        this.load.image('bg', 'sprites/start_screen/bg.png'); // Your background image

        // load start menu buttons
        this.load.spritesheet('newgame_btn', 'sprites/start_screen/new_game.png', {frameWidth: 320, frameHeight: 180});
        this.load.spritesheet('resume_btn', 'sprites/start_screen/start_button.png', {frameWidth: 320, frameHeight: 180});
        this.load.spritesheet('update_btn', 'sprites/start_screen/update_button.png', {frameWidth: 320, frameHeight: 180});
        this.load.audio('btn_click_snd', 'sounds/button_click.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0,0);

        new AnimatedButton(this, 'resume_btn',  () => { this.scene.start('LoadGame') });
        new AnimatedButton(this, 'newgame_btn', () => { this.scene.start('Bedroom')  });
        new AnimatedButton(this, 'update_btn',  () => { console.log('update game') });

    }

}