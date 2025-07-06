// === 游戏配置 ===
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor:'#FF007F',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 0 },
            debug: false // 调试时可设为true
        }
    }
};

// === 创建游戏实例 ===
const game = new Phaser.Game(config);

// === 全局变量 ===
let bgMusic;
let player;
let breads;
let score = 0;
let scoreText;
let cursors;
let eatSound;

// === 预加载资源 ===
function preload() {
    this.load.audio('bgMusic', 'assets/bgm.mp3');
    this.load.image('player', 'assets/player.png');
    this.load.image('bread', 'assets/bread.png');
    this.load.audio('eatSound', 'assets/eat.wav');
}

// === 初始化游戏对象 ===
function create() {
    // 背景音乐
    bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
    bgMusic.play();
    eatSound = this.sound.add('eatSound', { volume: 0.2 });
    eatSound.play();

    // 玩家设置
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setSize(30, 30); // 调整碰撞框大小

    // 面包组设置 - 修复了这里的大括号和immovable位置
    breads = this.physics.add.group({
        key: 'bread',
        repeat: 4,
        setXY: {
            x: 100, 
            y: 0, 
            stepX: 150
        }, // 注意这里添加了逗号
        immovable: true // 正确的immovable位置
    });

    // 键盘控制
    cursors = this.input.keyboard.createCursorKeys();

    // 分数文本
    scoreText = this.add.text(16, 16, '面包: 0', { 
        fontSize: '32px', 
        fill: '#fff' 
    });

    // 音效
    eatSound = this.sound.add('eatSound');

    // 碰撞检测
    this.physics.add.overlap(player, breads, eatBread, null, this);
}

// === 更新逻辑 ===
function update() {
    player.setVelocity(0);
    const speed = 200;
    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
}

// === 碰撞处理 ===
function eatBread(player, bread) {
    bread.disableBody(true, true);
    score += 1;
    scoreText.setText('面包: ' + score);
    eatSound.play();

    // 修复了这里的格式和逻辑
    let newX, newY;
    do {
        newX = Phaser.Math.Between(50, 750);
        newY = Phaser.Math.Between(50, 550);
    } while (Phaser.Math.Distance.Between(player.x, player.y, newX, newY) < 100);

    const newBread = breads.getFirstDead();
    if (newBread) {
        newBread.enableBody(true, newX, newY, true, true);
    }
}