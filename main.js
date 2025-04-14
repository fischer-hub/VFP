
import { SaveManager } from './src/SaveManager.js';
import Bedroom from './scenes/Bedroom.js';
import StartMenu from './scenes/StartMenu.js';
import LoadGame from './scenes/LoadGame.js';

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.input.on('pointerdown', (pointer) => {
            console.log(`[Global] Click at x=${pointer.x}, y=${pointer.y}`);
        });

        // Start the actual game
        this.scene.start('StartMenu');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 180,
    backgroundColor: '#000',
    pixelArt: true,
    scene: [BootScene, StartMenu, Bedroom, LoadGame],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Minimum size
        min: {
            width: 320,
            height: 180
        },
        // Maximum size
        //max: {
        //    width: 1600,
        //    height: 1200
        //},

        zoom: 1,  // Size of game canvas = game size * zoom
    }
};

const gameState = SaveManager.loadLatest();

new Phaser.Game(config);
