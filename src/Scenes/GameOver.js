// Vishrut Shah

class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("fishAssets", "fishSpritesheet.png", "fishSpritesheet.xml");
        this.load.bitmapFont('font', 'Text.png', 'Text.xml');
        this.load.audio("eating", "eating.mp3");
    }

    init(data) {
        this.score = data.score;
        this.high_score = data.high_score;
    } 

    create() {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.add.bitmapText(this.width/2, 120, 'font', 'Eaten By Hungry Fish', 20).setOrigin(0.5);
        this.add.bitmapText(this.width/2, 220, 'font', 'Final Score: ' + this.score, 20).setOrigin(0.5);
        this.add.bitmapText(this.width/2, 420, 'font', 'Press Enter to Continue', 20).setOrigin(0.5);
        if (this.score > this.high_score) {
            this.add.bitmapText(this.width/2, 320, 'font', 'New High Score!', 20).setOrigin(0.5);
            this.high_score = this.score;
        } else {
            this.add.bitmapText(this.width/2, 320, 'font', 'High Score: ' + this.high_score, 20).setOrigin(0.5);
        }
        this.eatingSound = this.sound.add("eating");
        this.eatingSound.play();
        this.add.sprite(this.width/2, 500, "fishAssets", "fishTile_097.png");

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(time, delta) {
        if (this.enterKey.isDown) {
            this.eatingSound.stop();
            this.scene.start("title", {high_score: this.high_score});
        }
    }
}