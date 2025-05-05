// Vishrut Shah

class Shooter extends Phaser.Scene {
    constructor() {
        super("shooterScene");
        this.my = {sprite: {}};

        this.bodyX = 50;
        this.bodyY = 100;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");

        this.load.atlasXML("fishAssets", "fishSpritesheet.png", "fishSpritesheet.xml");

        this.load.image("background1", "background.jpg");

        this.load.audio("underwater", "underwater.mp3");

        this.load.audio("pop", "pop.mp3");

        this.load.audio("hit", "hit.mp3");

        this.load.bitmapFont('font', 'Text.png', 'Text.xml');
        
    }

    create() {
        let my = this.my;

        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;

        my.sprite.music = [];

        my.sprite.music.push(this.sound.add("underwater"));
        my.sprite.music[0].loop = true;
        my.sprite.music[0].play();

        my.sprite.music.push(this.sound.add("pop"));
        my.sprite.music.push(this.sound.add("hit"));

        my.sprite.background1 = this.add.sprite(728,350,"background1");
        my.sprite.background2 = this.add.sprite(-3000,350,"background1");
        my.sprite.background2.flipX = true;
        let player = this.add.sprite(this.bodyX, this.bodyY, "fishAssets", "fishTile_101.png");
        my.sprite.player = player;
        

        my.sprite.activeProjectiles = [];
        my.sprite.enemyProjectiles = [];
        my.sprite.curveEnemies = [];
        my.sprite.zigzagEnemies = [];
        my.sprite.stoppedEnemies = [];
        

        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.lastEnemyBullet = 0;
        this.lastCurveEnemy = null;
        this.lastZigzagEnemy = null;

        this.playerRX = player.displayWidth / 2;
        this.playerRY = player.displayHeight / 2;
        this.projectileRX = null;
        this.projectileRY = null;
        this.enemyBulletRX = null;
        this.enemyBulletRY = null;
        this.curveRX = null;
        this.curveRY = null;
        this.zigzagRX = null;
        this.zigzagRY = null;

        this.zigzagGap = 5000;
        this.curveGap = 4000;
        this.bulletGap = 2000;

        this.score = 0;
        this.lives = 10;
        this.projectiles = 20;

        this.projectilesDisplay = this.add.bitmapText(10, 7, 'font', 'Food: 20', 20);
        this.liveDisplay = this.add.bitmapText(170, 7, 'font', 'Lives: 5', 20);
        this.scoreDisplay = this.add.bitmapText(this.width - 10, 30, 'font', 'Score: 0', 20);
    }

    update(time, delta) {
        if (this.lives == 0) {

        }
        this.score++;
        this.projectilesDisplay.setText('Food: ' + this.projectiles);
        this.liveDisplay.setText('Lives: ' + this.lives);
        this.scoreDisplay.setText('Score: ' + this.score).setOrigin(1);
        if (time - this.lastEnemyBullet > this.bulletGap) {
            let numEnemies = this.my.sprite.curveEnemies.length + this.my.sprite.zigzagEnemies.length;
            if (this.bulletGap > 300) {
                this.bulletGap -= 4;
            }
            if (numEnemies != 0) {
                let index = Math.floor(Math.random() * numEnemies);
                let enemy;
                if (index < this.my.sprite.curveEnemies.length) {
                    enemy = this.my.sprite.curveEnemies[index];
                } else {
                    enemy = this.my.sprite.zigzagEnemies[index - this.my.sprite.curveEnemies.length];
                }
                let temp = this.add.sprite(enemy[0].x - 30, enemy[0].y, "fishAssets", "fishTile_069.png").setScale(0.5);
                this.enemyBulletRX = temp.displayWidth / 2;
                this.enemyBulletRY = temp.displayHeight / 2;
                this.my.sprite.enemyProjectiles.push(temp);
                this.lastEnemyBullet = time;
            }
        }
        for (let i = 0; i < this.my.sprite.enemyProjectiles.length; i++) {
            this.my.sprite.enemyProjectiles[i].x -= 5;
            if (Math.abs(this.my.sprite.enemyProjectiles[i].x - this.my.sprite.player.x) < this.enemyBulletRX + this.playerRX && Math.abs(this.my.sprite.enemyProjectiles[i].y - this.my.sprite.player.y) < this.enemyBulletRY + this.playerRY) {
                this.my.sprite.enemyProjectiles[i].destroy();
                this.my.sprite.enemyProjectiles.splice(i,1);
                this.lives--;
                i--;
            }
            
        }
        this.my.sprite.background1.x -= 3;
        this.my.sprite.background2.x -= 3;
        if (this.my.sprite.background1.x > this.my.sprite.background2.x && this.my.sprite.background1.x < this.width - 728) {
            this.my.sprite.background2.x = this.my.sprite.background1.x + 1456;
        } else if (this.my.sprite.background1.x < this.my.sprite.background2.x && this.my.sprite.background2.x < this.width - 728) {
            this.my.sprite.background1.x = this.my.sprite.background2.x + 1456;
        }
        if (this.wKey.isDown) {
            this.my.sprite.player.y -= 10;
        } else if (this.sKey.isDown) {
            this.my.sprite.player.y += 10;
        }
        if (this.my.sprite.player.y <= 50) {
            this.my.sprite.player.y = 50;
        }
        if (this.my.sprite.player.y >= this.height-50) {
            this.my.sprite.player.y = this.height-50;
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.projectiles > 0) {
            let temp = this.add.sprite(this.my.sprite.player.x + 30, this.my.sprite.player.y, "fishAssets", "fishTile_122.png");
            this.projectileRX = temp.displayWidth / 2;
            this.projectileRY = temp.displayHeight / 2;
            this.my.sprite.activeProjectiles.push(temp);
            this.my.sprite.music[1].play();
            this.projectiles--;
        }

        for (let i = 0; i < this.my.sprite.activeProjectiles.length; i++) {
            this.my.sprite.activeProjectiles[i].x += 10;
            if (this.my.sprite.activeProjectiles[i].x >= this.width) {
                this.my.sprite.activeProjectiles[i].destroy();
                this.my.sprite.activeProjectiles.shift();
                i--;
            }
        }

        if (this.lastCurveEnemy == null || time - this.lastCurveEnemy >= this.curveGap) {
            this.lastCurveEnemy = time;
            if (this.curveGap > 100) {
                this.curveGap -= 10;
            }
            let center = Math.random() * this.height;
            let temp = this.add.sprite(this.width, center, "fishAssets", "fishTile_073.png");
            temp.flipX = true;
            this.curveRX = temp.displayWidth / 2;
            this.curveRY = temp.displayHeight / 2;
            this.my.sprite.curveEnemies.push([temp,time,center]);
        }
        for (let i = 0; i < this.my.sprite.curveEnemies.length; i++) {
            let timeDiff = time - this.my.sprite.curveEnemies[i][1];
            this.my.sprite.curveEnemies[i][0].x = this.width - 40 * timeDiff / 1000;
            this.my.sprite.curveEnemies[i][0].y =  this.my.sprite.curveEnemies[i][2] + 40 * Math.sin(timeDiff / 1000);
            if (this.my.sprite.curveEnemies[i][0].x < -20) {
                this.my.sprite.curveEnemies[i][0].destroy();
                this.my.sprite.curveEnemies.shift();
                i--;
            }
        }

        if (this.lastZigzagEnemy == null || time - this.lastZigzagEnemy >= this.zigzagGap) {
            this.lastZigzagEnemy = time;
            if (this.zigzagGap > 200) {
                this.zigzagGap -= 10;
            }
            let temp = this.add.sprite(this.width, 100, "fishAssets", "fishTile_079.png");
            temp.flipX = true;
            this.zigzagRX = temp.displayWidth / 2;
            this.zigzagRY = temp.displayHeight / 2;
            this.my.sprite.zigzagEnemies.push([temp, time]);
        }

        for (let i = 0; i < this.my.sprite.zigzagEnemies.length; i++) {
            let timeDiff = time - this.my.sprite.zigzagEnemies[i][1];
            this.my.sprite.zigzagEnemies[i][0].x = this.width - 40 * timeDiff / 1000;
            this.my.sprite.zigzagEnemies[i][0].y = Math.floor(timeDiff / 1000) % 4 < 2 ? this.height - this.height / 2 * [(timeDiff / 1000) % 4] : this.height/2 * [(timeDiff / 1000) % 4 - 2];
            if (this.my.sprite.zigzagEnemies[i][0].x < -20) {
                this.my.sprite.zigzagEnemies[i][0].destroy();
                this.my.sprite.zigzagEnemies.shift();
                i--;
            }
        }

        for (let i = 0; i < this.my.sprite.stoppedEnemies.length; i++) {
            this.my.sprite.stoppedEnemies[i][0].x += 10;
            this.my.sprite.stoppedEnemies[i][1].x += 10;
            if (this.my.sprite.stoppedEnemies[i][1].x >= this.width + 20) {
                this.my.sprite.stoppedEnemies[i][0].destroy();
                this.my.sprite.stoppedEnemies[i][1].destroy();
                this.my.sprite.stoppedEnemies.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.my.sprite.activeProjectiles.length; i++) {
            let projectileGone = false;
            for (let j = 0; j < this.my.sprite.curveEnemies.length; j++) {
                if (Math.abs(this.my.sprite.curveEnemies[j][0].x - this.my.sprite.activeProjectiles[i].x) < this.curveRX + this.projectileRX && Math.abs(this.my.sprite.curveEnemies[j][0].y - this.my.sprite.activeProjectiles[i].y) < this.curveRY + this.projectileRY) {
                    this.my.sprite.activeProjectiles[i].y = this.my.sprite.curveEnemies[j][0].y;
                    this.my.sprite.activeProjectiles[i].x = this.my.sprite.curveEnemies[j][0].x - this.curveRX;
                    this.my.sprite.stoppedEnemies.push([this.my.sprite.curveEnemies[j][0], this.my.sprite.activeProjectiles[i]]);
                    this.my.sprite.curveEnemies.splice(j, 1);
                    this.my.sprite.activeProjectiles.splice(i, 1);
                    projectileGone = true;
                    this.my.sprite.music[2].play();
                    break;
                }
            }
            if (projectileGone) {
                i--;
                continue;
            }
            for (let j = 0; j < this.my.sprite.zigzagEnemies.length; j++) {
                if (Math.abs(this.my.sprite.zigzagEnemies[j][0].x - this.my.sprite.activeProjectiles[i].x) < this.zigzagRX + this.projectileRX && Math.abs(this.my.sprite.zigzagEnemies[j][0].y - this.my.sprite.activeProjectiles[i].y) < this.zigzagRY + this.projectileRY) {
                    this.my.sprite.activeProjectiles[i].y = this.my.sprite.zigzagEnemies[j][0].y;
                    this.my.sprite.activeProjectiles[i].x = this.my.sprite.zigzagEnemies[j][0].x - this.zigzagRX;
                    this.my.sprite.stoppedEnemies.push([this.my.sprite.zigzagEnemies[j][0], this.my.sprite.activeProjectiles[i]]);
                    this.my.sprite.zigzagEnemies.splice(j, 1);
                    this.my.sprite.activeProjectiles.splice(i, 1);
                    this.my.sprite.music[2].play();
                    i--;
                    break;
                }
            }
        }

        for (let j = 0; j < this.my.sprite.curveEnemies.length; j++) {
            if (Math.abs(this.my.sprite.curveEnemies[j][0].x - this.my.sprite.player.x) < this.curveRX + this.playerRX && Math.abs(this.my.sprite.curveEnemies[j][0].y - this.my.sprite.player.y) < this.curveRY + this.playerRY) {
                this.lives = 0;
                return;
            }
        }
        for (let j = 0; j < this.my.sprite.zigzagEnemies.length; j++) {
            if (Math.abs(this.my.sprite.zigzagEnemies[j][0].x - this.my.sprite.player.x) < this.zigzagRX + this.playerRX && Math.abs(this.my.sprite.zigzagEnemies[j][0].y - this.my.sprite.player.y) < this.zigzagRY + this.playerRY) {
                this.lives = 0;
                return;
            }
        }
    }
}