class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      key: 'laser',
      frameQuantity: 20,
      active: false,
      visible: false,
      setXY: { x: -100, y: -100 } // Set lasers off-screen
    });
  }
}

function fireLaser(laserGroup, player) {
  let laser = laserGroup.getFirstDead(false);
  if (laser) {
    laser.setActive(true);
    laser.setVisible(true);
    laser.body.enable = true; // Enable the laser's body
    laser.setPosition(player.x, player.y);
    laser.setVelocityY(-500);
    // Add any other laser properties or behavior here
  }
}

function checkLaserOutOfBounds(laserGroup) {
  laserGroup.getChildren().forEach(laser =>{
    if (laser.y < 0) {
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.enable = false;
      laser.setVelocity(0, 0);
    }
  });
}