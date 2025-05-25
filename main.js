import { SaveManager } from './src/SaveManager.js';
import {Cursor} from './src/CursorManager.js';
import Bedroom from './scenes/Bedroom.js';
import StartMenu from './scenes/StartMenu.js';
import LoadGame from './scenes/LoadGame.js';
import Inventory from './scenes/InventoryOverlay.js';
//import {NavMeshPlugin} from './lib/phaser-navmesh-plugin.js';

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // load cursor sprite
        this.load.spritesheet('cursor', 'sprites/cursor.png', {frameWidth: 16, frameHeight: 16});

        // load player sprites
        this.load.spritesheet('player_idle', 'sprites/dr_idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_walk', 'sprites/dr_walk.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_crouch', 'sprites/characters/dr_crouch.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_talk', 'sprites/characters/dr_talk.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_stretch', 'sprites/characters/dr_stretch.png', { frameWidth: 64, frameHeight: 64 });

        // load common sounds
        this.load.audio('btn_click_snd', 'sounds/button_click.ogg');
        this.load.audio('collect_snd', 'sounds/characters/dr/grab.ogg');
        
        // load walk sound
        this.load.audio('walk_snd', 'sounds/characters/dr/steps.ogg');
        this.load.audio('grab_snd', 'sounds/characters/dr/grab.ogg');
        

    }

    create() {
        this.input.on('pointerdown', (pointer) => {
            console.log(`[Global] Click at x=${pointer.x}, y=${pointer.y}`);
        });

        let debug_mode = false
        let record_mode = false
        
        this.input.keyboard.on('keydown-E', () => {
            console.log('e pressed')
            if (this.scene.isActive('Inventory')) {
                this.scene.stop('Inventory');
            } else if (!this.scene.isActive('StartMenu')) {
                this.scene.launch('Inventory');
            }
        });

        this.input.keyboard.on('keydown-D', () => {
            if (this.input.keyboard.checkDown(this.input.keyboard.addKey('SHIFT'))) {
                debug_mode = !debug_mode
                console.log(`debug mode toggled ${debug_mode}`)
            }
        });

        this.input.keyboard.on('keydown-R', () => {
            if (debug_mode) {
                record_mode = !record_mode
                console.log(`record mode toggled ${record_mode}`)
            }
        });
        

        // Start the actual game
        this.scene.launch('Bedroom');

        // set up custom cursor
        Cursor.init(this, 'cursor', 0);
    }

    update(){
        this.scene.bringToTop('BootScene');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 180,
    backgroundColor: '#000',
    pixelArt: true,
    scene: [BootScene, StartMenu, Bedroom, LoadGame, Inventory],
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
