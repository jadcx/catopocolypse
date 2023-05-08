var gameData = {
    biscuits: 0,
    biscuitsPerClick: 1,
    gold: 0,
    biscuitMachines: 0,
    machineProd: 0,
    nextMachineCost: 10,
    cats: 0,
    lastTick: Date.now()
  }

  function update(id, content) { // a general update function
    document.getElementById(id).innerHTML = content;
  }

  function biscuitClick(number){ // manually make biscuit(s)
    gameData.biscuits = gameData.biscuits + number;
    update("biscuits", format(gameData.biscuits, "sci"));
};

function buyBiscuitMachine(){
    //var biscuitMachineCost = Math.floor(10 * Math.pow(1.1,biscuitMachines));     //works out the cost of this biscuit machine
    if(gameData.gold >= gameData.nextMachineCost) {                                   //checks that the player can afford the cursor
        gameData.biscuitMachines = gameData.biscuitMachines + 1;                                   //increases number of biscuitMachines
    	gameData.gold = gameData.gold - gameData.nextMachineCost;                          //removes the biscuitss spent
        update("biscuitMachines", format(gameData.biscuitMachines, "sci"));
        update("gold", format(gameData.gold, "sci"));  //updates the number of cookies for the user
    };
    gameData.nextMachineCost = Math.floor(10 * Math.pow(1.1,gameData.biscuitMachines));       //works out the cost of the next cursor
    update("biscuitMachineCost", format(gameData.nextMachineCost, "sci"));
    gameData.machineProd = gameData.biscuitMachines;
    update("machineProd", format(gameData.machineProd), "sci");
};

var mainGameLoop = window.setInterval(function(){
	diff = Date.now() - gameData.lastTick;  // calculate how long since last tick
    gameData.lastTick = Date.now(); // update lastTick.
	gameData.biscuits += gameData.biscuitMachines * (diff / 1000);
    update("biscuits", format(gameData.biscuits, "sci"));
	var pc1 = gameData.biscuits * 0.01;
    var pc10 = gameData.biscuits * 0.1;
    var pc50 = gameData.biscuits * 0.5;
    update("1pcBiscuits", format(pc1, "sci"));
    update("10pcBiscuits", format(pc10, "sci"));
    update("50pcBiscuits", format(pc50, "sci"));
    update("allBiscuits", format(gameData.biscuits, "sci"));
    update("cats", format (gameData.cats, "sci"));

}, 1000);

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("catopocolypseSave", JSON.stringify(gameData))
  }, 15000)

function loadGame(){
    var savegame = JSON.parse(localStorage.getItem("catopocolypseSave"))
    if (savegame !== null) {
        gameData = savegame
    }
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(0)
	if (type == "sci") return mantissa.toFixed(2) + "e" + exponent
	if (type == "eng") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}

// Selling Biscuits
function sellBiscuits(number) {
    selling = Math.round((number/100)*gameData.biscuits)
    if (gameData.biscuits >= selling) {
        gameData.biscuits = gameData.biscuits - selling;
        gameData.gold = gameData.gold + selling;
        update("biscuits", format(gameData.biscuits, "sci"));
        update("gold", format(gameData.gold, "sci"));
    }
}