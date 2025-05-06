// Player.js
export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'player_idle', 0);
      scene.add.existing(this);
  
      this.scene = scene;
      this.setOrigin(0.5, 1);
      this.setDepth(10);
      this.isMoving = false;
  
      this.createAnimations();
      this.play('idle');
      this.walk_snd = this.scene.sound.add('walk_snd')


      scene.input.on('pointerdown', () => {
        const pointer = scene.input.activePointer;
        this.moveTo(pointer.worldX, pointer.worldY);
    });
    }
  
    createAnimations() {
      const anims = this.scene.anims;
  
      if (!anims.get('idle')) {
        anims.create({
          key: 'idle',
          frames: anims.generateFrameNumbers('player_idle', { start: 0, end: 4 }),
          frameRate: 2,
          repeat: -1
        });
      }
  
      if (!anims.get('walk')) {
        anims.create({
          key: 'walk',
          frames: anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }),
          frameRate: 5,
          repeat: -1
        });
      }
  
      if (!anims.get('crouch')) {
        anims.create({
          key: 'crouch',
          frames: anims.generateFrameNumbers('player_crouch', { start: 0, end: 2 }),
          frameRate: 8,
          repeat: 0
        });
      }
  
      if (!anims.get('talk')) {
        anims.create({
          key: 'talk',
          frames: anims.generateFrameNumbers('player_talk', { start: 0, end: 2 }),
          frameRate: 8,
          repeat: -1
        });
      }
      if (!anims.get('stretch')) {
        anims.create({
          key: 'stretch',
          frames: anims.generateFrameNumbers('player_stretch', { start: 0, end: 2 }),
          frameRate: 8,
          repeat: -1
        });
      }
    }
  
    moveTo(x, y, onArrival = () => {}) {
      
      
      // Check if the target point is in the walk area
      if (this.scene.walkArea && !Phaser.Geom.Polygon.Contains(this.scene.walkArea, x, y)) {
        console.log("blocked from walking")
        return; // blocked!
      }

      if (this.isMoving) return;
      this.isMoving = true;

      this.setFlipX(x < this.x);
      this.play('walk');
      this.walk_snd.play()
  
      this.scene.tweens.add({
        targets: this,
        x,
        y,
        duration: Phaser.Math.Distance.Between(this.x, this.y, x, y) * 13,
        onComplete: () => {
          this.play('idle');
          this.isMoving = false;
          this.walk_snd.stop()
          onArrival();
        }
      });
    }
  
    crouch() {
      this.play('crouch');
    }
  
    talk() {
      this.play('talk');
    }

    stretch() {
        this.play('stretch');
      }
  }
  