class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      key: 'enemies',
      frameQuantity: 20,
      active: false,
      visible: false,
      setXY: { x: -100, y: -100 } // Set enemies off-screen
    });
  }
}

function move(enemy, scene) {
  // Random position at the top of the screen
  enemy.x = Phaser.Math.Between(0, scene.game.config.width);
  enemy.y = 0;

  // Activate and make visible
  enemy.setActive(true);
  enemy.setVisible(true);

  // Random vertical velocity
  enemy.setVelocityY(Phaser.Math.Between(50, 150));

  // Random horizontal direction (left or right)
  enemy.setVelocityX(Phaser.Math.RND.pick([-50, 50]));
}

function checkEnemyOutOfBounds(enemyGroup, scene) {
  enemyGroup.children.iterate((enemy) => {
    if (enemy.y > scene.game.config.height || enemy.x < 0 || enemy.x > scene.game.config.width ) {
      move(enemy, scene);
    }
  });
}