function Alien(texture, renderer_height, renderer_width, explosion_textures, stage) {

    PIXI.Sprite.call(this, texture);

    this.anchor.set(0.5, 0.5);
    this.vx = 0;
    this.vy = 0;
    this.half_height = 0;
    this.half_width = 0;
    this.renderer_height = renderer_height;
    this.renderer_width = renderer_width;
    this.started_moving = false;
    this.wait_to_move_start_time = 0;
    this.wait_to_move_milliseconds = 0;

    var new_scale = randomRange(0.5, 1.5).toFixed(2);
    this.scale.set(new_scale, new_scale);

    this.speed = AlienBlasterMain.ALIEN_SPEED * new_scale;

    this.interactive = true;
    this.on('pointerdown', this.onClick);

    this.explosion_sprite = new PIXI.extras.AnimatedSprite(explosion_textures);
    this.explosion_sprite.scale.set(new_scale, new_scale);
    this.explosion_sprite.anchor.set(0.5, 0.5);
    this.explosion_sprite.visible = false;
    this.explosion_sprite.loop = false;
    this.explosion_sprite.onComplete = this.explosionFinished;
    stage.addChild(this.explosion_sprite);
}

Alien.prototype = Object.create(PIXI.Sprite.prototype);

Alien.prototype.update = function alienUpdate(delta) {

    if (this.started_moving) {

        this.position.x += (this.speed * delta);

        if (this.hasLeftScreen()) {

            this.setStartPosition();
        }

    } else {
        var difference = Date.now() - this.wait_to_move_start_time;
        if ((Date.now() - this.wait_to_move_start_time) > this.wait_to_move_milliseconds) {
            this.started_moving = true;
        }
    }

};

Alien.prototype.setStartPosition = function () {

    this.half_height = this.height / 2;
    this.half_width = this.width / 2;

    var start_y = randomRange(this.half_height, (this.renderer_height - this.half_height)).toFixed(2);

    this.position.x = -this.half_width;
    this.position.y = start_y;

    this.wait_to_move_start_time = Date.now();
    this.wait_to_move_milliseconds = (randomRange(0.1, 5).toFixed(2)) * 1000;

    this.started_moving = false;
}

Alien.prototype.hasLeftScreen = function () {
    if ((this.position.x - this.half_width) > this.renderer_width) {
        return true;
    } else {
        return false;
    }
};

Alien.prototype.startMoving = function () {
    this.started_moving = true;
};

Alien.prototype.onClick = function () {

    AlienBlasterMain.sounds.alien_explodes.play();

    this.explosion_sprite.position.set(this.position.x, this.position.y);
    this.explosion_sprite.visible = true;
    this.explosion_sprite.gotoAndPlay(0);

    this.setStartPosition();

};

Alien.prototype.explosionFinished = function () {

    this.visible = false;

};