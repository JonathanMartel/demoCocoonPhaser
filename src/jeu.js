/* Source : 
http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/
*/

(function () {  // IIFE
"use strict";
        var jeu = new Phaser.Game(768, 432, Phaser.AUTO, 'jeu');
        //var jeu = new Phaser.Game(400, 400, Phaser.AUTO, 'jeu');
        jeu.state.add("Jouer",jouer);
        jeu.state.start("Jouer");
		
})();