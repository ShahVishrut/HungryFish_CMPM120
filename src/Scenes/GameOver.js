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
    } 

    create() {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.add.bitmapText(this.width/2, 120, 'font', 'Eaten By Hungry Fish', 20).setOrigin(0.5);
        this.add.bitmapText(this.width/2, 220, 'font', 'Final Score: ' + this.score, 20).setOrigin(0.5);
        this.add.bitmapText(this.width/2, 320, 'font', 'Press Enter to Play Again', 20).setOrigin(0.5);
        this.eatingSound = this.sound.add("eating");
        this.eatingSound.play();
        this.add.sprite(this.width/2, 500, "fishAssets", "fishTile_097.png");

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(time, delta) {
        if (this.enterKey.isDown) {
            this.eatingSound.stop();
            this.scene.start("shooterScene");
        }
    }
}