var Projectile = (function () {
    var Projectile = function (jeu, x, y, cle) {  
        Phaser.Sprite.call(this, jeu, x, y, cle);
        _jeu = jeu;

        console.log("create");
        
	}
	Projectile.prototype = Object.create(Phaser.Sprite.prototype);
	Projectile.prototype.constructor = Projectile;
	    
    Projectile.prototype.update = function(){
            
    };
    
    return Projectile;

})();