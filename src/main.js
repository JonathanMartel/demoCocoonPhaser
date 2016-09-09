var jouer = (function () {

    var jouer = function (jeu) {
        _jeu = jeu;
    };
    jouer.prototype = {
        preload : function(){
            _jeu.load.spritesheet('bouton', 'assets/button_sprite_sheet.png', 193, 71);
            _jeu.load.image('balle', 'assets/bullet.png');	// src : Phaser.io
            _jeu.load.tilemap('carte', 'assets/plateforme.json', null, Phaser.Tilemap.TILED_JSON);
			_jeu.load.image('tuiles', 'assets/tileset-platformer.png');
            _jeu.stage.backgroundColor = '#000000';
            _jeu.load.atlasJSONHash('chevre', 'assets/mc_chevre_2anim.png', 'assets/mc_chevre_2anim.json');
        },
        create: function () { // À la creation du jeu 
            _jeu.physics.startSystem(Phaser.Physics.ARCADE);
            Phaser.Physics.enableBody = true;
            _jeu.physics.arcade.gravity.y = 750;
            _jeu.heros = _jeu.add.sprite(500, 500, 'chevre');
            _jeu.heros.animations.add('idle', Phaser.Animation.generateFrameNames('chevre_idle', 0, 79, '', 4), 30, true);
            _jeu.heros.animations.add('marche', Phaser.Animation.generateFrameNames('chevre_marche', 0, 29, '', 4), 30, true);

            _jeu.heros.scale = new Phaser.Point(.1, .1);
            
            _jeu.heros.anchor.setTo(0.5,0.5);
            
            _jeu.heros.vitesse = 200;
            
            _jeu.camera.follow(_jeu.heros);

            _jeu.physics.enable(_jeu.heros);
            _jeu.heros.body.checkCollision.up = false;
            _jeu.heros.body.collideWorldBounds = true;
            
            _jeu.niveau = _jeu.add.tilemap('carte');

            _jeu.niveau.addTilesetImage('tuiles');
            _jeu.couche = {
                "sol": _jeu.niveau.createLayer('sol'),
                "plateforme": _jeu.niveau.createLayer('plateforme')
            };

            _jeu.couche.sol.resizeWorld();
            _jeu.couche.plateforme.resizeWorld();
            _jeu.niveau.setCollision([37, 39, 41], true, _jeu.couche.plateforme);
            _jeu.niveau.setCollisionBetween(13,15, true, _jeu.couche.plateforme);
            
            //_jeu.niveau.setCollision([12,13,14, 38, 39], true, _jeu.couche.sol);
            _jeu.couche.plateforme.debug = true;
            _jeu.couche.sol.debug = true;
            
            _jeu.curseur = _jeu.input.keyboard.createCursorKeys();
            _jeu.wasd = {
                up: _jeu.input.keyboard.addKey(Phaser.Keyboard.W),
                down: _jeu.input.keyboard.addKey(Phaser.Keyboard.S),
                left: _jeu.input.keyboard.addKey(Phaser.Keyboard.A),
                right: _jeu.input.keyboard.addKey(Phaser.Keyboard.D),
            };
            
            _jeu.wasd.left.onDown.add(function()
                    {
                        this.debutMouvement(-1);
                    }, this);
            _jeu.wasd.right.onDown.add(function()
                    {
                        this.debutMouvement(1);
                    }, this);
            _jeu.wasd.left.onUp.add(this.arretMouvement, this);
            _jeu.wasd.right.onUp.add(this.arretMouvement, this);
            
            _jeu.boutonSaut = _jeu.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
            
            _jeu.world.bringToTop(_jeu.heros);
            
            //_jeu.input.onDown.add(this.lancerFeu, this);
            
            _jeu.pgProjectile = _jeu.add.physicsGroup();
            _jeu.btnControle = {
                "saut" : _jeu.add.button(0,0, 'bouton', this.sauter, this, 2, 1, 0),
                "feu" : _jeu.add.button(0,0, 'bouton', this.lancerFeu, this, 2, 1, 0),
                "gauche" : _jeu.add.button(0,0, 'bouton', null, this, 2, 1, 0),
                "droite" : _jeu.add.button(0,0, 'bouton', null, this, 2, 1, 0),
                
                
            };
           
            _jeu.btnControle.saut.fixedToCamera = true;
            _jeu.btnControle.feu.fixedToCamera = true;
            _jeu.btnControle.gauche.fixedToCamera = true;
            _jeu.btnControle.droite.fixedToCamera = true;
            
            _jeu.btnControle.saut.cameraOffset.setTo(350, 360);
            _jeu.btnControle.feu.cameraOffset.setTo(550, 360);
            _jeu.btnControle.gauche.cameraOffset.setTo(0, 360);
            _jeu.btnControle.droite.cameraOffset.setTo(200, 360);
            
            _jeu.btnControle.gauche.onInputUp.add(this.arretMouvement, this);
            _jeu.btnControle.gauche.onInputDown.add(
                    function()
                    {
                        this.debutMouvement(-1);
                    }, this);
            _jeu.btnControle.droite.onInputUp.add(this.arretMouvement, this);
            _jeu.btnControle.droite.onInputDown.add(
                    function()
                    {
                        this.debutMouvement(1);
                    }, this);
    /*button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);
      */      
            
        },
        lancerFeu : function(pointeur){
            var velocite = 400;
            var balle = _jeu.add.sprite(_jeu.heros.x, _jeu.heros.y, "balle");
            balle.anchor.setTo(0,0.5);
            _jeu.physics.enable(balle);
            balle.body.allowGravity = false;
            console.log(_jeu.input.mousePointer.worldX, _jeu.heros.x);
            if(_jeu.input.mousePointer.worldX < _jeu.heros.x)
            {
                velocite *=-1;
                balle.rotation = Math.PI;
            }
            balle.body.velocity.x = velocite;
            _jeu.pgProjectile.add(balle);
            
        },
        
        update: function () { // Sur chaque frame
            _jeu.physics.arcade.collide(_jeu.heros, _jeu.couche.mur);
            _jeu.physics.arcade.collide(_jeu.heros, _jeu.couche.plateforme);
            
            _jeu.physics.arcade.collide(_jeu.pgProjectile, _jeu.couche.mur, function(balle)
                    { 
                            balle.kill();
                    });
            
            _jeu.physics.arcade.collide(_jeu.pgProjectile, _jeu.couche.plateforme, function(balle)
                    { 
                            balle.kill();
                    });
			
            
            var x = _jeu.couche.plateforme.getTileX(_jeu.heros.x);
            var y = _jeu.couche.plateforme.getTileY(_jeu.heros.y);
            var tuile =  _jeu.niveau.getTile(x, y, _jeu.couche.plateforme);
			
            if(_jeu.heros.grimpe == true)
            {
                _jeu.heros.body.allowGravity = false; 
                if(tuile && tuile.properties.grimpe &&  tuile.properties.grimpe== 1)
                {
                    _jeu.heros.body.velocity.y = 0;
					console.dir(tuile);
                }
                else
                {
                    _jeu.heros.grimpe = false;
                    _jeu.heros.body.allowGravity = true;
                }
            }
            else
            {
                _jeu.heros.body.allowGravity = true;
            }
           //_jeu.heros.body.velocity.x = 0;
            /*if (_jeu.curseur.left.isDown || _jeu.wasd.left.isDown) {
                _jeu.heros.body.velocity.x = -_jeu.heros.vitesse;
            }
            if (_jeu.curseur.right.isDown || _jeu.wasd.right.isDown) {
                _jeu.heros.body.velocity.x = _jeu.heros.vitesse;
            }*/
            if (_jeu.curseur.up.isDown || _jeu.wasd.up.isDown) {
                
                if(tuile && tuile.properties.grimpe &&  tuile.properties.grimpe== 1)
                {
                    _jeu.heros.grimpe = true;
                    _jeu.heros.body.velocity.y = -_jeu.heros.vitesse;
                }
                //console.log(tuile);
            }
            if(_jeu.boutonSaut.isDown)
            {
                //_jeu.heros.saute = true;
                this.sauter();
                
            }
            
            if (_jeu.heros.body.velocity.x == 0 && _jeu.heros.body.velocity.y == 0) {
                _jeu.heros.animations.play('idle', 30, true);

            } else {
                //this.heros.animations.setFrame(this.heros.animations.currentFrame)
                _jeu.heros.animations.play('marche', 30, true);
            }
            

        },
        sauter:function()
        {
            console.log('saut');
            if (_jeu.heros.body.onFloor() || _jeu.heros.grimpe)
            {
                _jeu.heros.body.velocity.y = -550;
                _jeu.heros.grimpe = false;
            }
        },
        debutMouvement : function(direction)
        {
            _jeu.heros.body.velocity.x = direction * _jeu.heros.vitesse;
        },
        arretMouvement : function()
        {
            _jeu.heros.body.velocity.x = _jeu.heros.body.velocity.x = 0;
        },
        
        
        
        
        
    };
    return jouer;

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})();