// CursorManager.js
export class Cursor {
    static init(scene, textureKey, defaultFrame = 0) {
        if (this.cursor) return;

        this.scene = scene;

        scene.input.setDefaultCursor('none');

        this.cursor = scene.add.sprite(0, 0, textureKey, defaultFrame)

        scene.events.on('update', () => {
            const pointer = scene.input.activePointer;
            this.cursor.setPosition(pointer.worldX, pointer.worldY);
        });
    }

    static grab() {
        if (!this.cursor) return;
        this.cursor.setFrame(1);
    }
    static reset() {
        if (!this.cursor) return;
        this.cursor.setFrame(0);
    }
    static question() {
        if (!this.cursor) return;
        this.cursor.setFrame(2);
    }
    static left() {
        if (!this.cursor) return;
        this.cursor.setFrame(3);
    }
    static right() {
        if (!this.cursor) return;
        this.cursor.setFrame(4);
    }
    static up() {
        if (!this.cursor) return;
        this.cursor.setFrame(5);
    }
    static down() {
        if (!this.cursor) return;
        this.cursor.setFrame(6);
    }
    static destroy() {
        this.cursor?.destroy();
        this.cursor = null;
    }
}
