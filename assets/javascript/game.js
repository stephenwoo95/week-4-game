//game object
var game = {
  //globals
  characterSelected: false,
  defenderSelected: false,
  wins: 0,
  //user's character and enemy objects
  character: {},
  defender: {},
  gameOver: false,

  //characters

  obiWanKenobi: {
    name: "Obi-Wan Kenobi",
    health: 120,
    baseAttack: 10,
    attack: 10
  },

  lukeSkywalker: {
    name: "Luke Skywalker",
    health: 100,
    baseAttack: 5,
    attack: 5
  },

  darthSidious: {
    name: "Darth Sidious",
    health: 150,
    baseAttack: 20,
    attack: 20
  },

  darthMaul: {
    name: "Darth Maul",
    health: 180,
    baseAttack: 25,
    attack: 25
  },

  //initialize user's character object to chosen jedi
  initCharacter: function(selection){
    character.name = selection.name;
    character.health = selection.health;
    character.baseAttack = selection.baseAttack;
    character.attack = selection.attack;
  },
  //move remaining characters to enemy selection row
  moveToEnemies: function() {
    $(".character-available").addClass("enemy-available").removeClass("character-available");
    $("#enemy-selection").append($(".enemy-available"));
  },
  //initialize user's enemy object to chosen defender
  initDefender: function(selection) {
    defender.name = selection.name;
    defender.health = selection.health;
    defender.baseAttack = selection.baseAttack;
    defender.attack = selection.attack;
  },
  //reset game
  reset: function() {
    $("#obiWan").children("#obiWan-health").html(obiWanKenobi.health);
    $("#lukeSkywalker").children("#lukeSkywalker-health").html(lukeSkywalker.health);
    $("#darthSidious").children("#darthSidious-health").html(darthSidious.health);
    $("#darthMaul").children("#darthMaul-health").html(darthMaul.health);

    $(".character").removeClass("chosen-character enemy-available chosen-defender").addClass("character-available");
    var available = $(".character-available").show();
    $("#character-selection").html(available);

    $("#stats").empty();
    $("#restart").hide();

    this.characterSelected = false;
    this.defenderSelected = false;
    this.gameOver = false;

    this.character = {};
    this.defender = {};
  }
}

$(document).ready(function() {

  //hide restart button when page loads
  $("#restart").hide();

  // when player clicks one of the available characters
  $(".character").on("click", function () {
    var selection;

    //get character object that refers to character pressed
    console.log($(this).children(".name").text());
    switch($(this).children(".name").text()){
      case "Obi-Wan Kenobi": 
        selection = game.obiWanKenobi;
        break;
      case "Luke Skywalker": 
        selection = game.lukeSkywalker;
        break;
      case "Darth Sidious":
        selection = game.darthSidious;
        break; 
      case "Darth Maul":
        selection = game.darthMaul;
        break;
      default:
        break;
    }
    // only allow if character has not been selected yet
    if(game.characterSelected == false) {

      //initialize chosen character
      game.initCharacter(selection);
      game.characterSelected = true;

      //display the chosen character
      $(this).removeClass("character-available").addClass("chosen-character");
      $("#character").append(this);

      game.moveToEnemies();
    } else if ((game.characterSelected == true) && (game.defenderSelected == false)) {
      //pick enemy
      if($(this).hasClass("enemy-available")) {

        //initialize enemy character
        game.initDefender(selection);
        game.defenderSelected = true;

        //display the chosen defender
        $(this).removeClass("enemy-available").addClass("chosen-defender");
        $("#defender").prepend(this);
      }
    }
  });

  $("#attack").on("click", function() {
    console.log("attack");
    //character and defender chosen, attacking is ok
    if (game.characterSelected && game.defenderSelected && !game.gameOver) {
      //attacks defender and reduce health
      game.defender.health = game.defender.health - game.character.attack;
      $(".chosen-defender").children(".health").html(game.defender.health);
      $("#stats").html("You attacked " + game.defender.name + " for " + game.character.attack + " damage.<br>");

      //character attack increases
      game.character.attack += game.character.baseAttack;

      //counterattack
      if (game.defender.health > 0) {
        game.character.health -= game.defender.baseAttack;
        $(".chosen-character").children(".health").html(character.health);

        if (game.character.health > 0) {
          $("#stats").append(game.defender.name + " attacked you back for " + game.defender.baseAttack + " damage.");
        } else {
          game.gameOver = true;
          $("#stats").html("You have been defeated...GAME OVER!!!<br>Play again?");
          $("#restart").show();
        }
      }else{
        //beat defender
        game.wins++;
        game.defenderSelected = false;
        $("#stats").html("You have defeated " + game.defender.name + ". You can choose to fight another enemy.");
        $(".chosen-defender").hide();

        //all defenders lost?
        if (game.wins === 3) {
          game.gameOver = true;
          $("#stats").html("You won! GAME OVER!!!<br>Play again?");
          $("#restart").show();
        }
      }
    } else if (!game.characterSelected && !game.gameOver) {
      $("#stats").html("<p>You must first select your game character.</p>");
    } else if (!game.defenderSelected && !game.gameOver) {
      $("#stats").html("<p>You must choose an enemy to fight.</p>");
    }
  });

  $("#restart").on("click", function() {
    console.log("restart");
    game.reset();
  });

}); // Main routine
