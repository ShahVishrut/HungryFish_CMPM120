// Vishrut Shah

class Title extends Phaser.Scene {
    constructor() {
        super("title");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("fishAssets", "fishSpritesheet.png", "fishSpritesheet.xml");
        this.load.bitmapFont('font', 'Text.png', 'Text.xml');
        this.load.audio("eating", "eating.mp3");
        this.load.image("background1", "background.jpg");
    }

    init(data) {
        this.high_score = data.high_score;
    } 

    create() {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.my.sprite.background1 = this.add.sprite(728,350,"background1");
        this.add.bitmapText(this.width/2, 120, 'font', 'Hungry Fish', 40).setOrigin(0.5);
        this.add.bitmapText(this.width/2, 500, 'font', 'Press Enter to Play', 20).setOrigin(0.5);

        if (!this.high_score) {
            this.high_score = 0;
        }
        this.add.bitmapText(this.width/2, 550, 'font', 'High Score: ' + this.high_score, 15).setOrigin(0.5);
        
        this.my.sprite.fish = this.add.sprite(this.width/2, this.height/2, "fishAssets", "fishTile_101.png");
        this.my.sprite.enemy1 = this.add.sprite(-10, this.height/2, "fishAssets", "fishTile_073.png");
        this.my.sprite.enemy2 = this.add.sprite(-40, this.height/2, "fishAssets", "fishTile_079.png");


        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.startCutscene = false;
        this.endCutscene = false;

        this.curTime = 0;
    }

    update(time, delta) {
        if (this.enterKey.isDown) {
            this.startCutscene = true;
            this.curTime = Date.now();
        }
        if (this.startCutscene) {
            this.my.sprite.fish.flipX = true;
            if (Date.now() - this.curTime < 2000) {
                return;
            }
            this.my.sprite.fish.flipX = false;
            if (Date.now() - this.curTime < 100) {
                return;
            }
            this.my.sprite.fish.x += 10;
            this.my.sprite.enemy1.x += 15;
            this.my.sprite.enemy2.x += 15;
            if (this.my.sprite.enemy2.x > this.width + 50) {
                this.endCutscene = true;
            }

        }
        if (this.endCutscene) {
            this.scene.start("shooterScene", {high_score: this.high_score});
        }
    }
}