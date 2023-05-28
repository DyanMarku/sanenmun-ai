var moveAud = new Audio('sounds/move.wav');

function moveSound(){
	moveAud.play();
}
var scores = [0,0,0]
			
var	gameState = new Position();
            
var gameEnd = true;
var playComputer = true;

console.time('Complete Search');
console.log(gameState.search(9, 0, -INFINITY, INFINITY, X));
console.timeEnd('Complete Search');
playerTurn = 0;

var MOON = 1;
var SUN = 0;
var NONE = -1;

var currentTurn = SUN;
var playerTurn = MOON;
function make(x){
	if((currentTurn == playerTurn || !playComputer) && gameState.board[x] == NONE && !gameEnd){
		moveSound();
		gameState.make(parseInt(x), playerTurn);
		if(playerTurn == SUN){
			document.getElementById(x).innerHTML = "<img src='./images/moons.png'>";
		} else{
			document.getElementById(x).innerHTML = "<img src='./images/suns.png'>";
		}
		document.getElementById(x).classList.add("noclick");
		if(gameState.gameWon() != NONE){
			document.getElementById("menu").classList.add("gameDone");
			document.getElementById("menu").style.display = "block";
			if(playComputer){
				document.getElementById("decl").innerHTML = "You Won!";
				document.getElementById("dec2").innerHTML = "";
				scores[2] += 1;
				document.getElementById("pwins").innerHTML = "<span>Player Wins</span><br>" + scores[2];
			} else { 
				if(currentTurn == SUN){
					document.getElementById("decl").innerHTML = "X Won!";
				} else {
					document.getElementById("decl").innerHTML = "O Won!";
				}
			}
			gameEnd = true;
			return;
		} else if(gameState.isTied()){
			if(playComputer){
				scores[1] += 1;
				document.getElementById("ties").innerHTML = "<span>Ties</span><br>" + scores[1];
			}
			document.getElementById("menu").classList.add("gameDone");
			document.getElementById("menu").style.display = "block";
			document.getElementById("decl").innerHTML = "Tied!";
			gameEnd = true;
			return;
		}
		currentTurn = 1-currentTurn;
		if(playComputer){
			gameState.engineMove();
		} else{
			playerTurn = 1-playerTurn;
		}
	}
}

function play(player){
	playComputer = true;
	currentTurn = SUN;
	if(player == MOON){
		playerTurn = MOON;
		gameState.engineMove();
	}
}

function clearBoard(){
	for(var i =0; i<9; i++){
		document.getElementById(i.toString()).style.color = "black";
		document.getElementById(i.toString()).innerHTML = "";
		document.getElementById(i.toString()).classList.remove("noclick");
		gameState.board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
		gameState.turn = SUN;
		gameState.ply = 0;
		gameState.key = 0;
	}
}

function reloadScores(){
	scores = [0,0,0];
	document.getElementById('cwins').innerHTML = "<span>Computer Wins</span><br>0";
	document.getElementById('ties').innerHTML = "<span>Ties</span><br>0";
	document.getElementById('pwins').innerHTML = "<span>Player Wins</span><br>0";
}

function selectD(x){
	if(x == 0 && gameState.difficulty != EASY){
		reloadScores();
		gameState.difficulty = EASY;
		document.getElementById('easy').classList.add("selected");
		document.getElementById('medium').classList.remove("selected");
		document.getElementById('hard').classList.remove("selected");
	}
	if(x == 1 && gameState.difficulty != MEDIUM){
		reloadScores();
		gameState.difficulty = MEDIUM;
		document.getElementById('medium').classList.add("selected");
		document.getElementById('easy').classList.remove("selected");
		document.getElementById('hard').classList.remove("selected");
	}
	if(x == 2 && gameState.difficulty != HARD){
		reloadScores();
		gameState.difficulty = 1.01;
		document.getElementById('hard').classList.add("selected");
		document.getElementById('medium').classList.remove("selected");
		document.getElementById('easy').classList.remove("selected");
	}
}

function selectP(x){
	if(x == 0 && playerTurn != MOON){
		playerTurn = MOON
		document.getElementById('o').classList.add("selected");
		document.getElementById('x').classList.remove("selected");
	}
	if(x == 1 && playerTurn != SUN){
		playerTurn = SUN
		document.getElementById('x').classList.add("selected");
		document.getElementById('o').classList.remove("selected");
	}
}

function selectT(x){
	if(x == 0 && playComputer){
		document.getElementById("scoreTracker").style.display = "none";
		playComputer = false;
		gameState.turn = SUN;
		currentTurn = SUN;
		playerTurn = SUN;
		reloadScores();
	}
	if(x == 1 && !playComputer){
		document.getElementById("scoreTracker").style.display = "block";
		playComputer = true;
		gameState.turn = SUN;
		currentTurn = SUN;
		if(document.getElementById("x").classList.contains("selected")){
			playerTurn = SUN;
		} else {
			playerTurn = MOON;
		}
	}
	document.getElementById("menu").style.display = "none";
	gameEnd = false;
	clearBoard();
	if(playComputer){
		play(playerTurn);
	}
}

