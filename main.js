// Initialize Phaser
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let playerSpeed = 200;
let laserGroup; 
let enemies;
let emitter;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let laserSound;
let playerDestroyedSoundl;
let enemyDestroyedSound;

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('laser', 'assets/laser.png');
  this.load.image('enemies', 'assets/enemy.png');
  this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
  this.load.audio('laser', 'assets/sounds/laser_player.ogg');
  this.load.audio('playerDestroyed', 'assets/sounds/player_destroyed.ogg');
  this.load.audio('enemyDestroyed', 'assets/sounds/enemy_destroyed.ogg');
  this.load.image('star', 'assets/star.png');
}

function create() {
  this.add.particles(0, 0, 'star',{
    x: {min: 0, max: 600}, 
    y: {min: 0, max: 800},
    frequency : 100,
    lifespan: 10000 , 
    speedY: {min: 100, max: 300},
    scale: {min: 0.4, max: 0.6},
    alpha: {min: 0.4,  max: 0.6},
    advance: 5000
  });
  laserSound = this.sound.add('laser');
  playerDestroyedSound = this.sound.add('playerDestroyed');
  enemyDestroyedSound = this.sound.add('enemyDestroyed');
  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  laserGroup = new LaserGroup(this);
  enemies = new EnemyGroup(this);
  // Loop through all enemies and call move
  enemies.getChildren().forEach(enemy =>{
    move(enemy, this);
  });
  emitter = this.add.particles(0, 0, 'explosion',
                               {
                                 frame: ['red','blue','green', 'yellow','purple'],
                                 lifespan : 1000,
                                 speed : { min : 50, max : 100 },
                                 emitting : false
                              
                                 
                               });
  // Collision setup
    this.physics.add.overlap(enemies, laserGroup, (enemy, laser) => {
      
      laserCollision(laser, enemy, this);
    });
  this.physics.add.overlap(player, enemies, (player, enemy) => {
    playerEnemyCollision(player, enemy, this);
  });
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFFF00' }  ); 
  livesText = this.add.text(16, 50, 'lives: 3', { fontSize: '32px', fill: '#FFFF00' }  ); 
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  if (this.input.keyboard.addKey('A').isDown) {
    player.setVelocityX(-playerSpeed);
  } else if (this.input.keyboard.addKey('D').isDown) {
    player.setVelocityX(playerSpeed);
  } else {
    player.setVelocityX(0);
  }
  if (cursors.space.isDown && Phaser.Input.Keyboard.JustDown(cursors.space)&& lives > 0) {
    laserSound.play();
    
  fireLaser(laserGroup, player);
  
  }
  checkLaserOutOfBounds(laserGroup);
  checkEnemyOutOfBounds(enemies, this);
}

function laserCollision(laser, enemy, scene) {
  enemyDestroyedSound.play();
  emitter.explode(40, enemy.x, enemy.y);
  laser.setActive(false);
  laser.setVisible(false);
  laser.body.enable = false;
  move(enemy, scene);
  score += 1;
  scoreText.setText(`Score: ${score}`);
}

function playerEnemyCollision(player, enemy, scene) {
  playerDestroyedSound.play();
  enemies.children.iterate((enemy) => {
    move(enemy, scene);
  });
  lives--;
  livesText.setText(`lives: ${lives}`);
  if (lives <= 0) {
     const gameOverText = scene.add.text(game.config.width / 2, game.config.height / 2, 'Game Over', { fontSize: '32px', fill: '#fff' });
      gameOverText.setOrigin(0.5);
      player.setActive(false);
      player.setVisible(false);
      player.body.enable = false;
    } else {
      enemies.children.iterate((enemy) => {
        move(enemy, scene);
      });
    }
    }