var gameData = {
    biscuits: 0,
    biscuitsPerClick: 1,
    gold: 0,
    biscuitMachines: 0,
    machineProd: 0,
    cats: 0,
    biscuitsSold: 0,
    lastTick: Date.now()
  }

if (typeof saveGame.biscuits !== "undefined") gameData.biscuits = saveGame.biscuits;
if (typeof saveGame.biscuitsPerClick !== "undefined") gameData.biscuitsPerClick = saveGame.biscuitsPerClick;
if (typeof saveGame.gold !== "undefined") gameData.gold = saveGame.gold;
if (typeof saveGame.biscuitMachines !== "undefined") gameData.biscuitMachines = saveGame.biscuitMachines;
if (typeof saveGame.machineProd !== "undefined") gameData.machineProd = saveGame.machineProd;
if (typeof saveGame.cats !== "undefined") gameData.cats = saveGame.cats;
if (typeof saveGame.biscuitsSold !== "undefined") gameData.biscuitsSold = saveGame.biscuitsSold;
if (typeof saveGame.lastTick !== "undefined") gameData.lastTick = saveGame.lastTick;

function tab(tab){
    // hide all tabs and show the one selected
    document.getElementById("biscuitMenu").style.display = "none"
    document.getElementById("machinesMenu").style.display = "none"
    document.getElementById("optionsMenu").style.display = "none"
    document.getElementById(tab).style.display = "block"
}
// go to a tab for the first time
tab("biscuitMenu")

function update(id, content) { // a general update function
    document.getElementById(id).innerHTML = content;
}

function biscuitClick(){ // manually make biscuit(s)
    gameData.biscuits = gameData.biscuits + gameData.biscuitsPerClick;
    update("biscuits", format(gameData.biscuits, "sci"));
};

function biscuitMachineCosts(number){
    var startnum = gameData.biscuitMachines
    var thiscost = 0
    for (i=startnum; i<(startnum+number); i ++) {
        thiscost += Math.floor(10 * Math.pow(1.1,i));
    }
    return thiscost;
}

function buyBiscuitMachines(number){
    var cost = biscuitMachineCosts(number)
    if(gameData.gold >= cost) {                                    //checks that the player can afford the purchase
        gameData.biscuitMachines = gameData.biscuitMachines + number;         //increases number of biscuitMachines
    	gameData.gold = gameData.gold - cost;                                 //removes the gold spent
        update("biscuitMachines", format(gameData.biscuitMachines, "sci"));
        update("gold", format(gameData.gold, "sci"));               //updates the amount of gold for the user
        gameData.machineProd = gameData.biscuitMachines * 1;
        update("machineProd", format(gameData.machineProd), "sci");
    }
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
    update("mc1", format(biscuitMachineCosts(1), "sci"));
    update("mc10", format(biscuitMachineCosts(10), "sci"));
    update("mc50", format(biscuitMachineCosts(50), "sci"));
    update("mc100", format(biscuitMachineCosts(100), "sci"));
    update("cats", format (gameData.cats, "sci"));

}, 1000);

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("catopocolypseSave", JSON.stringify(gameData))
  }, 15000)

function saveGame(){
    localStorage.setItem("catopocolypseSave", JSON.stringify(gameData))
}

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
        gameData.biscuitsSold += selling;
        update("biscuits", format(gameData.biscuits, "sci"));
        update("gold", format(gameData.gold, "sci"));
    }
}