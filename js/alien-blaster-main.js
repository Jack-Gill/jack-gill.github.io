function AlienBlasterMain() {

    this.app = new PIXI.Application(1000, 700, {
        backgroundColor: 0x1099bb
    });

    document.body.appendChild(this.app.view);

    window.addEventListener('resize', resize.bind(this));

    this.alienContainer = new PIXI.Container();
    this.app.stage.addChild(this.alienContainer);

    this.number_of_aliens = 200;
    this.aliens = [];
    this.alien_texture_atlas;
    this.number_of_alien_textures = 5;
    this.alien_speed = 5;
    this.pixiAssetsLoaded = false;
    this.soundAssetsLoaded = false;
    this.sounds = {};



    this.loadGameAssets();
}

AlienBlasterMain.prototype.update = function (delta) {

    for (var i = 0; i < this.aliens.length; i++) {
        this.aliens[i].update(delta);
    }
}

AlienBlasterMain.prototype.loadGameAssets = function () {

    loader.add([
        "resources/img/aliensAtlas.json",
        "resources/img/explosionAtlas.json"
    ]).on("progress", this.loadProgressHandler.bind(this));
    loader.load(this.pixiLoadCompleteHandler.bind(this));

    sounds.load([
  "resources/sound/alien-appears.mp3",
        "resources/sound/alien-explodes.mp3"
    ]);

    //Assign the callback function that should run
    //when the sounds have loaded
    sounds.whenLoaded = this.soundLoadCompleteHandler.bind(this);
};

AlienBlasterMain.prototype.loadProgressHandler = function (loader, resource) {
    console.log("Pixi load progress: " + loader.progress + "%");
};

AlienBlasterMain.prototype.pixiLoadCompleteHandler = function () {

    this.pixiAssetsLoaded = true;

    if (this.soundAssetsLoaded) {
        this.loadCompleteHandler();
    }
}

AlienBlasterMain.prototype.soundLoadCompleteHandler = function () {

    this.soundAssetsLoaded = true;
    this.sounds.alien_appears = sounds["resources/sound/alien-appears.mp3"];
    this.sounds.alien_explodes = sounds["resources/sound/alien-explodes.mp3"];

    if (this.pixiAssetsLoaded) {
        this.loadCompleteHandler();
    }
}

AlienBlasterMain.prototype.loadCompleteHandler = function () {

    setTimeout(resize(this), 0);

    this.alien_texture_atlas = resources["resources/img/aliensAtlas.json"].textures;

    var explosion_atlas = resources["resources/img/explosionAtlas.json"].textures;
    this.explosion_textures = [];

    for (var i = 0; i < Object.keys(explosion_atlas).length; i++) {
        this.explosion_textures[i] = explosion_atlas["explosion" + i + ".png"];
    }

    this.createAliens();

    this.app.ticker.add(this.update.bind(this));
};

AlienBlasterMain.prototype.createAliens = function () {

    var alien_textures = [];
    var textureIndex = 0;

    for (var i = 0; i < this.number_of_alien_textures; i++) {
        alien_textures[i] = this.alien_texture_atlas["alien" + i + ".png"];
    }

    for (var i = 0; i < this.number_of_aliens; i++) {

        textureIndex = i % this.number_of_alien_textures;

        this.aliens[i] = new Alien(alien_textures[textureIndex], this.alien_speed, this.app.renderer.height, this.app.renderer.width, this.explosion_textures, this.sounds.alien_explodes, this.app.stage);

        this.aliens[i].setStartPosition();
        this.addAlienToStageOrderedByScale(this.aliens[i])
    }
};

AlienBlasterMain.prototype.addAlienToStageOrderedByScale = function (newAlien) {

    if (this.alienContainer.children.length === 0) {

        this.alienContainer.addChild(newAlien);

    } else {

        for (var j = 0; j < this.alienContainer.children.length; j++) {

            if (this.alienContainer.children[j].scale.x > newAlien.scale.x) {
                this.alienContainer.addChildAt(newAlien, j);
                break;
            }

            this.alienContainer.addChild(newAlien);
        }

    }
};









//