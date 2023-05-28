/**
	Tic Tac Toe:
	
	Board is represented as follows:
			 0 | 1 | 2 
			---+---+---
			 3 | 4 | 5
			---+---+---
			 6 | 7 | 8

			 0 | 1 | 2 | 9
			---+---+---------
			 3 | 4 | 5 | 10
			---+---+---------
			 6 | 7 | 8 | 11
			---+---+---------
			12 | 13 | 14 | 15
*/
var nodeCount = 0;

// Initialize constants
var NONE = -1;
var X = 0;
var Y = 1;
var HASH_SIZE = 1421351;
var INFINITY = 9001;
var WIN_SCORE = 10000;

var EXACT = 0;
var L_BOUND = -1;
var U_BOUND = 1;

var HARD = 5.01;
var MEDIUM = 0.88;
var EASY = 0.5;

var moveOrder = [4,8,5,7, 0,12,9,15, 6,2,1,11, 10,13,14,3 ];

// Create zobrist keys
// Zobrist array: [player][square]
var zobrist = new Array(2);
zobrist[0] = new Array(16);
zobrist[1] = new Array(16);
var zobristTurn = Math.floor(Math.random() * 2147483647);

for(var i =0; i < 2; i++){
	for(var j=0; j<16; j++){
		zobrist[i][j] = Math.floor(Math.random() * 2147483647);
	}
}

// Create hash class
class HashPos {
	constructor(){
		this.score = -INFINITY;
		this.key = 0;
		this.depth = -INFINITY;
		this.flag = L_BOUND;
		this.turn = NONE;
		this.bestMove = NONE;
		this.difficulty = MEDIUM;
	}
}

// Create hash table
var ttable = new Array(HASH_SIZE);
for (var i=0; i<HASH_SIZE; i++){
	ttable[i] = new HashPos();
}

// Create Position class
class Position {
	constructor(){
		this.board = [-1,-1,-1, -1,-1,-1, -1,-1,-1, -1,-1,-1, -1,-1,-1, -1]; 
		this.turn = X;
		this.ply = 0;
		this.key = 0;
	}
	
	// Ugly brute force check for win
	isWon() {
		const patterns = [
		  // Horizontal pattern
		  [0, 1, 2, 9],
		  [3, 4, 5, 10],
		  [6, 7, 8, 11],
		  [12, 13, 14, 15],
	  
		  // Vertical pattern
		  [0, 3, 6, 12],
		  [1, 4, 7, 13],
		  [2, 5, 8, 14],
		  [9, 10, 11, 15],
	  
		  // Diagonal pattern
		  [0, 4, 8, 15],
		  [9, 5, 7, 12],
	  
		  // 4 Corners pattern
		  [0, 9, 12, 15],
	  
		  // 4 at the middle
		  [4, 5, 7, 8],

		  // 4 squares
		  [0,1,3,4],  
		  [1,4,2,5],  
		  [2,5,9,10],  
		  [3,4,6,7],  
		  [5,10,8,11],  
		  [6,7,12,13],  
		  [7,8,13,14],  
		  [8,14,11,15]  

		];
	  
		for (const pattern of patterns) {
		  const [a, b, c, d] = pattern;
		  if (
			this.board[a] === this.board[b] &&
			this.board[a] === this.board[c] &&
			this.board[a] === this.board[d] &&
			this.board[a] !== NONE
		  ) {
			return this.board[a];
		  }
		}
	  
		return NONE;
	  }
	  
	// Win check with interface
	  gameWon() {
		const patterns = [
		  // Horizontal pattern
		  [0, 1, 2, 9],
		  [3, 4, 5, 10],
		  [6, 7, 8, 11],
		  [12, 13, 14, 15],
	  
		  // Vertical pattern
		  [0, 3, 6, 12],
		  [1, 4, 7, 13],
		  [2, 5, 8, 14],
		  [9, 10, 11, 15],
	  
		  // Diagonal pattern
		  [0, 4, 8, 15],
		  [9, 5, 7, 12],
	  
		  // 4 Corners pattern
		  [0, 9, 12, 15],
	  
		  // 4 at the middle
		  [4, 5, 7, 8],

		  // 4 squares
		  [0,1,3,4],  
		  [1,4,2,5],  
		  [2,5,9,10],  
		  [3,4,6,7],  
		  [5,10,8,11],  
		  [6,7,12,13],  
		  [7,8,13,14],  
		  [8,14,11,15]  

		];
	  
		for (const pattern of patterns) {
		  const [a, b, c, d] = pattern;
		  if (
			this.board[a] === this.board[b] &&
			this.board[a] === this.board[c] &&
			this.board[a] === this.board[d] &&
			this.board[a] !== NONE
		  ) {
			pattern.forEach((index) => {
			  document.getElementById(index.toString()).style.color = "rgb(240,10,15)";
			});
			return this.board[a];
		  }
		}
	  
		return NONE;
	  }
	  
	  
	
	// Returns true if board full
	isTied(){
		if(this.board[0] != NONE &&
			this.board[1] != NONE &&
			this.board[2] != NONE &&
			this.board[3] != NONE &&
			this.board[4] != NONE &&
			this.board[5] != NONE &&
			this.board[6] != NONE &&
			this.board[7] != NONE &&
			this.board[8] != NONE &&
			this.board[9] != NONE &&
			this.board[10] != NONE &&
			this.board[11] != NONE &&
			this.board[12] != NONE &&
			this.board[13] != NONE &&
			this.board[14] != NONE &&
			this.board[15] != NONE){
				
			return true;
		}
		return false;
	}
	
	// Utility
	displayBoard(){
		console.log(this.board[0] +" " + this.board[1] + " " + this.board[2] + " " + this.board[9] + "\n" 
		+ this.board[3] +" " + this.board[4] + " " + this.board[5] + " " + this.board[10] + "\n" + this.board[6] +" " 
		+ this.board[7] + " " + this.board[8] + " " + this.board[11] + "\n" + this.board[12] + " " + this.board[13] + " " 
		+ this.board[14] + " " + this.board[15]);
	}

	// Make move - used by human
	make(square, player){
		this.board[square] = player;
		this.key ^= zobristTurn;
		this.key ^= zobrist[player][square];
		this.ply += 1;
		this.turn = 1-this.turn;
		this.displayBoard();
	}
	
	engineMove(){
		var move = NONE;
		var evaluation = NONE;
		var dice = Math.random();
		if(dice > this.difficulty){
			// Make random valid move.
			var possibles = [];
			for(var i =0; i<16; i++){
				if(this.board[i] == NONE){
					possibles.push(i);
				}
			}
			
			move = possibles[Math.floor(Math.random()*possibles.length)];
		} else {
			// Make calculated move
			var result = this.search(16-this.ply, 0, -INFINITY, INFINITY, this.turn);
			move = result[1];
			evaluation = result[0];
		}
		var x = this;
		setTimeout(function(){
			moveSound();
			if(x.turn == X){
				document.getElementById(move).innerHTML = "<img src='./images/moons.png'>" ;
			} else{
				document.getElementById(move).innerHTML = "<img src='./images/suns.png'>";
			}
			document.getElementById(move).classList.add("noclick");
			x.make(move, x.turn); 
			
			if(gameState.gameWon() != NONE){
				console.log("Engine wins!");
				scores[0] += 1;
				document.getElementById("cwins").innerHTML = "<span>AI Wins</span><br>" + scores[0];
				document.getElementById("menu").classList.add("gameDone");
				document.getElementById("menu").style.display = "block";
				document.getElementById("decl").innerHTML = "AI Wins";
                
                document.getElementById("dec2").innerHTML = "";
                document.getElementById("start").innerHTML = "Play Again";

				gameEnd = true;
				return;
			} else if(gameState.isTied()){
				scores[1] += 1;
				document.getElementById("ties").innerHTML = "<span>Ties</span><br>" + scores[1];
				document.getElementById("menu").classList.add("gameDone");
				document.getElementById("menu").style.display = "block";
				document.getElementById("decl").innerHTML = "Tied!";

                document.getElementById("decl").innerHTML = "Tied!";
                document.getElementById("dec2").innerHTML = "";

                document.getElementById("start").innerHTML = "Play Again";
				gameEnd = true;
				return;
			}
			currentTurn = 1-currentTurn;
		}, 450);
	}
	
	// Negamax search
	// Run from root under the assumption that there are still legal moves left
	// Returns [score, best move]
	search(depth, ply, alpha, beta, turn){
		nodeCount += 1;
		var alpha_copy = alpha;
		
		var key = this.key%HASH_SIZE;
		if(ttable[key].depth != -INFINITY && ttable[key].depth >= depth 
			&& ttable[key].key == this.key && ttable[key].turn == turn){
			if(ttable[key].flag == EXACT){
				return [ttable[key].score, ttable[key].bestMove];
			} else if(ttable[key].flag == L_BOUND){
				alpha = Math.max(alpha, ttable[key].score);
			} else{
				beta = Math.min(beta, ttable[key].score);
			}
			if(alpha >= beta){
				return [ttable[key].score, ttable[key].bestMove];
			}
		}
		
		// Check if the game is over.
		if(this.isWon() != NONE){
			return [-WIN_SCORE + ply, NONE];
		}
		// Check if the board is full.
		if(this.board[0] != NONE &&
			this.board[1] != NONE &&
			this.board[2] != NONE &&
			this.board[3] != NONE &&
			this.board[4] != NONE &&
			this.board[5] != NONE &&
			this.board[6] != NONE &&
			this.board[7] != NONE &&
			this.board[8] != NONE &&
			this.board[10] != NONE &&
			this.board[11] != NONE &&
			this.board[12] != NONE &&
			this.board[13] != NONE &&
			this.board[14] != NONE &&
			this.board[15] != NONE){
			return [0, NONE];
		}
		
		var bestScore = -WIN_SCORE;
		var bestMove = 0;
		var score = -WIN_SCORE;
		
		// Iterate over all possible moves.
		for (var i = 0; i < this.board.length; i++) {
			// Only test valid moves
			if (this.board[moveOrder[i]] === NONE) {
		  
			  // 1.) Make move
			  this.board[moveOrder[i]] = turn;
			  this.ply += 1;
			  this.key ^= zobrist[turn][moveOrder[i]];
			  this.key ^= zobristTurn;
			  this.turn = 1 - this.turn;
		  
			  // 2.) Recursively search the child node.
			  score = -(this.search(depth - 1, ply + 1, -beta, -alpha, 1 - turn))[0];
		  
			  // 3.) Unmake move
			  this.board[moveOrder[i]] = NONE;
			  this.ply -= 1;
			  this.key ^= zobrist[turn][moveOrder[i]];
			  this.key ^= zobristTurn;
			  this.turn = 1 - this.turn;
		  
			  // Update the best move.
			  if (score > bestScore) {
				bestScore = score;
				bestMove = [moveOrder[i]];
			  }
		  
			  // Alpha-beta pruning.
			  alpha = Math.max(alpha, bestScore);
			  if (alpha >= beta) {
				break;
			  }
			}
		}
		  
		
		ttable[key].depth = depth;
		ttable[key].score = bestScore;
		ttable[key].turn = turn;
		ttable[key].key = this.key;
		ttable[key].bestMove = bestMove;
		if(bestScore <= alpha_copy){
			ttable[key].flag = U_BOUND;
		} else if(bestScore >= beta){
			ttable[key].flag = L_BOUND;
		} else {
			ttable[key].flag = EXACT;
		}
		
		// Return the best move.
		return [bestScore, bestMove];
	}
}