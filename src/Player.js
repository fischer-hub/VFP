// Player.js
export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'player_idle', 0);
      scene.add.existing(this);
  
      this.scene = scene;
      this.setOrigin(0.5, 0.9);
      this.setDepth(10);
      this.isMoving = false;
      this.no_collision = true;
  
      this.createAnimations();
      this.play('idle');
      this.walk_snd = this.scene.sound.add('walk_snd')


      scene.input.on('pointerdown', () => {
        if(this.isMoving || this.isGrabbing){return;}
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
          frameRate: 2,
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
  

    getFirstIntersection(x, y) {
      const initial_path = new Phaser.Geom.Line(this.x, this.y, x, y);
      const points = this.scene.walkArea.points;
    
      let closestPoint = null;
      let minDist = Infinity;
    
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const edge = new Phaser.Geom.Line(p1.x, p1.y, p2.x, p2.y);
    
        const intersection = Phaser.Geom.Intersects.GetLineToLine(initial_path, edge);
        if (intersection != null) {
          this.no_collision = false
          const dist = Phaser.Math.Distance.Between(this.x, this.y, intersection.x, intersection.y);
    
          if (dist < minDist) {
            minDist = dist;
            closestPoint = intersection;
          }
        }
      }
    
      // Optionally, nudge the intersection point slightly inside walk area to avoid edge sticking
      if (closestPoint != null) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, closestPoint.x, closestPoint.y);
        closestPoint.x -= Math.cos(angle) * 2;
        closestPoint.y -= Math.sin(angle) * 2;

        // shift point by half the dr sprite depending on the direction he walks
        //if (this.x < x){
        //  closestPoint.x = closestPoint.x - 16
        //} else if (this.x > x) {
        //  closestPoint.x = closestPoint.x + 10
        //} else {
        //  closestPoint.x = closestPoint.x
        //}
      }
    
      return closestPoint;
    }


    moveTo(x, y, onArrival = () => {}) {
      if (!this.scene.walkArea) {
        console.warn("No walk area defined");
        return;
      }
    
      if (this.isMoving) return;

      let intersectionPoint = this.getFirstIntersection(x, y);


      let targetX = x
      let targetY = y


      if (intersectionPoint != null){
        targetX = intersectionPoint.x;
        targetY = intersectionPoint.y;
      }
    
      this.isMoving = true;
    
      if (targetX < this.x) {
        this.setFlipX(true);  // Face left
      } else {
        this.setFlipX(false); // Face right
      }
    

      this.play('walk');
      this.walk_snd.play();
    
      this.scene.tweens.add({
        targets: this,
        x: targetX,
        y: targetY,
        duration: Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY) * 13,
        onComplete: () => {
          this.play('idle');
          this.isMoving = false;
          this.walk_snd.stop();
          onArrival();
          this.no_collision = true
        }
      });
    }
    
  
    crouch() {
      if (this.no_collision){
        console.log('crouch triggered')
        this.play('crouch');
      }
    }
  
    talk() {
      this.play('talk');
    }

    stretch() {
        this.play('stretch');
      }
  }
  