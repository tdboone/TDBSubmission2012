
//Start by loading images

//The image of a square outline for the board
var imgBoardSquare = new Image();
imgBoardSquare.src = 'Board.png';

//The image of the pieces the red player uses		
var imgRed = new Image();
imgRed.src = 'Red.png';
		
//The image of the pieces the black player (AI) uses
var imgBlack = new Image();
imgBlack.src = 'Black.png';

//This matrix is used to keep track of the pieces on the game board
var boardMatrix = 	[[0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0]];
				 
//This is set to true when it's the players turn.
var playerTurn = true;

//This is a place to output messages
var consoleDiv = document.getElementById('consolediv');

//This idenifies the canvas element
var canvas = document.getElementById('gamecanvas');
var ctx = canvas.getContext('2d');

//This sets the default difficulty and assigns event handlers to the radio buttons to adjust the difficulty
//accordingly
var difficulty = "medium";
var difficultyButtons = document.getElementsByClassName("difficulty");
for (var i = 0; i < difficultyButtons.length; i++){
	difficultyButtons[i].onclick = function(j){
		return function(){
			difficulty = difficultyButtons[j].value;			
		}
	}(i);
}

//This sets up the reset button, which can be used to start the game over at any time
var resetButton = document.getElementById('resetbutton');
var animationPlaying = false;
var animationStop = false; //If an animation is playing, setting this flag to true stops the animation
resetButton.onclick = function(){
	if (animationPlaying){
		animationStop = true;
	}
	boardMatrix = 	[[0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0]];
	playerTurn = true;
	consoleDiv.innerHTML = "";
	drawBoard();
};

//This function redraws the board after a new piece is added
//There is the option to draw an animated piece, which is passed in as an array of three integers, the first being the player,
//and the second and third being the X and Y coordinates of the piece.
function drawBoard(animatedPiece){
	ctx.clearRect(0, 0, 525, 450);
	if (animatedPiece){
		if (animatedPiece[0] == 1){
			ctx.drawImage(imgRed, animatedPiece[1], animatedPiece[2]);
		}else if (animatedPiece[0] == 2){
			ctx.drawImage(imgBlack, animatedPiece[1], animatedPiece[2]);
		}
	}
	for (var i = 0; i < 6; i++){
		for (var j = 0; j < 7; j++){
			ctx.drawImage(imgBoardSquare, j * 75, i * 75);
			if (boardMatrix[i][j] == 1){
				ctx.drawImage(imgRed, j * 75, i * 75);
			} else if (boardMatrix[i][j] == 2){
				ctx.drawImage(imgBlack, j * 75, i * 75);
			}
		}
	}			
}

//Wait to draw the board for the first time until the board square image is loaded
imgBoardSquare.onload = function(){
	drawBoard();
}
	
//This function is used to interpret the user's clicks to drop pieces in the different columns
function clickHandler(e){
	var findPos = function(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return [curleft,curtop];
	}	
	
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	posx -= findPos(canvas)[0] + 6;
	posy -= findPos(canvas)[1] + 6;
	column = Math.floor(posx / 75) + 1;
	if (column > 0 && column < 8 && posy >= 0 && posy <= 462 && playerTurn){
		playerDrop(column);
	}
}

//This function attempts to drop the player's piece in a given column
//If that column is full, then no piece is ropped and it's still the player's turn
function playerDrop (column){
	for (var i = 5; i > -1; i--){
		if (boardMatrix[i][column - 1] == 0){
			animatedDrop(1, column - 1);
			i = -1;
			playerTurn = false;
		}
	}
}

//This function checks if the board is tied
function checkForTie(){
	for (var i = 0; i < 7; i++){
		if (boardMatrix[0][i] == 0){
			return false;
		}
	}
	return true;
}

//This function checks the board for four in a row given the player who just dropped a piece.
function checkForFours(player){
	function fourFound(){
		playerTurn = false;
		if (player == 1){
			consoleDiv.innerHTML += "You win!!!<br/>";
		}else{
			consoleDiv.innerHTML += "The computer wins.<br/>";
		}
	}
	
	//First check for horizontals
	for (var i = 0; i < 6; i++){
		for (var j = 0; j < 4; j++){
			if (boardMatrix[i][j] == player &&
			boardMatrix[i][j+1] == player &&
			boardMatrix[i][j+2] == player &&
			boardMatrix[i][j+3] == player){
				fourFound();
				return true;
			}
		}
	}
	
	//Second check for verticals
	for (var i=0; i < 3; i++){
		for (var j = 0; j < 7; j++){
			if (boardMatrix[i][j] == player &&
			boardMatrix[i+1][j] == player &&
			boardMatrix[i+2][j] == player &&
			boardMatrix[i+3][j] == player){
				fourFound();
				return true;
			}
		}
	}
	
	//Third check for upward diagonals
	for (var i = 3; i < 6; i++){
		for (var j = 0; j < 4; j++){
			if (boardMatrix[i][j] == player &&
			boardMatrix[i-1][j+1] == player &&
			boardMatrix[i-2][j+2] == player &&
			boardMatrix[i-3][j+3] == player){
				fourFound();
				return true;
			}				
		}
	}
	
	//Fourth check for downward diagonals
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 4; j++){
			if (boardMatrix[i][j] == player &&
			boardMatrix[i+1][j+1] == player &&
			boardMatrix[i+2][j+2] == player &&
			boardMatrix[i+3][j+3] == player){
				fourFound();
				return true;
			}
		}
	}
	
	//If no fours are found, return 'false'
	return false;
}
	
//This function determines where the computer will drop a piece
function aiDrop(){
	var dropColumn = -1;
	
	//This function is the workhorse of the AI strategies. The function will, given a board matrix and a player number, 
	//check the given board and return the locations of all spaces in which that
	//player just needs to put one piece to get Connect 4
	function checkForPotentialFours(board, player){
		var matchingSpaces = 0;
		var emptySpaces = 0;
		var emptySpaceLocation = [];
		var returnArray = [];
		
		//first check for verticals
		for (var i=0; i < 3; i++){
			for (var j=0; j < 7; j++){
				if (board[i][j] == 0 &&
				board[i+1][j] == player &&
				board[i+2][j] == player &&
				board[i+3][j] == player){
					returnArray.push([i,j]);
				}
			}
		}
		
		//next check for horizontals
		for (var i = 0; i < 6; i++){
			for (var j = 0; j < 4; j++){
				emptySpaces = 0;
				matchingSpaces = 0;
				for (var k = 0; k < 4; k++){
					if (board[i][j+k] == player){
						matchingSpaces++;
					}else if(board[i][j+k] == 0){
						emptySpaces++;
						emptySpaceLocation = [i, j+k];
					}
				}
				if (matchingSpaces == 3 && emptySpaces == 1){
					var spaceAlreadyCounted = false;
					for (var k = 0; k < returnArray.length; k++){
						if (returnArray[k][0] == emptySpaceLocation[0] && returnArray[k][1] == emptySpaceLocation[1]){
							spaceAlreadyCounted = true;
						}						
					}
					if (!spaceAlreadyCounted){
						returnArray.push(emptySpaceLocation);
					}
				}
			}
		}
		
		//next check for upward diagonals
		for (var i = 3; i < 6; i++){
			for (var j = 0; j < 4; j++){
				emptySpaces = 0;
				matchingSpaces = 0;
				for (var k = 0; k < 4; k++){
					if (board[i-k][j+k] == player){
						matchingSpaces++;
					}else if(board[i-k][j+k] == 0){
						emptySpaces++;
						emptySpaceLocation = [i-k, j+k];
					}
				}
				if (matchingSpaces == 3 && emptySpaces == 1){
					var spaceAlreadyCounted = false;
					for (var k = 0; k < returnArray.length; k++){
						if (returnArray[k][0] == emptySpaceLocation[0] && returnArray[k][1] == emptySpaceLocation[1]){
							spaceAlreadyCounted = true;
						}						
					}
					if (!spaceAlreadyCounted){
						returnArray.push(emptySpaceLocation);
					}
				}
			}
		}
		
		//finally, check for upward diagonals
		for (var i = 0; i < 3; i++){
			for (var j = 0; j < 4; j++){
				emptySpaces = 0;
				matchingSpaces = 0;
				for (var k = 0; k < 4; k++){
					if (board[i+k][j+k] == player){
						matchingSpaces++;
					}else if(board[i+k][j+k] == 0){
						emptySpaces++;
						emptySpaceLocation = [i+k, j+k];
					}
				}
				if (matchingSpaces == 3 && emptySpaces == 1){
					var spaceAlreadyCounted = false;
					for (var k = 0; k < returnArray.length; k++){
						if (returnArray[k][0] == emptySpaceLocation[0] && returnArray[k][1] == emptySpaceLocation[1]){
							spaceAlreadyCounted = true;
						}						
					}
					if (!spaceAlreadyCounted){
						returnArray.push(emptySpaceLocation);
					}
				}
			}
		}
		
		return returnArray;
	}
		
	//This is a function that makes sure that the AI takes an opportunity to block
	//the player if they would get a connect 4 on the next turn.
	//If the player has a chance to connect 4 on the next turn, block it
	function blockPlayer(){
		if (dropColumn == -1){
			var spotsToCheck = checkForPotentialFours(boardMatrix, 1);
			for (var i = 0; i < spotsToCheck.length; i++){
				if (spotsToCheck[i][0] == 5 || boardMatrix[spotsToCheck[i][0]+1][spotsToCheck[i][1]] != 0){
					dropColumn = spotsToCheck[i][1];
				}
			}
		}
	}	
	
	//If the computer hasn't made up it's mind, then this function randomly selects an empty column
	function derp(){
		while (dropColumn == -1){
			var attemptedColumn = Math.floor(Math.random()*7);
			if (boardMatrix[0][attemptedColumn] == 0){
				dropColumn = attemptedColumn;
			}
		}
	}
	
	//This is a function that makes sure the computer doesn't miss the chance to get connect 4 if they can do it this turn
	function aiGetC4(){
		if (dropColumn == -1){
			var spotsToCheck = checkForPotentialFours(boardMatrix, 2);
			for (var i = 0; i < spotsToCheck.length; i++){
				if (spotsToCheck[i][0] == 5 || boardMatrix[spotsToCheck[i][0]+1][spotsToCheck[i][1]] != 0){
					dropColumn = spotsToCheck[i][1];
				}
			}
		}
	}
	
	//This function directs the AI to block the player from setting up three in a row that could lead 
	//to a connect 4. This function makes the difference between the easy and medium difficulty.
	function blockThrees(){
		
		//This is a matrix used to test out potential moves
		var hypotheticalMatrix = [[0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0]];
		
		//This function resets the hypotheicalMatrix to match the current board.
		function resetHypothetical(){
			for (var i = 0; i < 6; i++){
				for(var j = 0; j < 7; j++){
					hypotheticalMatrix[i][j] = boardMatrix[i][j];
				}
			}
		}
		
		if (dropColumn == -1){
			resetHypothetical();
			var currentThrees = checkForPotentialFours(boardMatrix, 1).length;
			for (var i = 0; i<7; i++){
				if (hypotheticalMatrix[0][i] == 0){
					for (var j = 5; j > -1; j--){
						if (hypotheticalMatrix[j][i] == 0){
							hypotheticalMatrix[j][i] = 1;
							j = -1;
						}
					}
					if (checkForPotentialFours(hypotheticalMatrix, 1).length > currentThrees){
						dropColumn = i;
						currentThrees = checkForPotentialFours(hypotheticalMatrix, 1).length;
					}
					resetHypothetical();
				}
			}
		}
	}
	
	//The "hard" AI looks at several factors and assigns each column a score based on the likelihood that a move there would
	//help the AI or block the player. It then uses these scores to place a piece in the most desirable column.
	function hardAI(){
		
		//This is a matrix used to test out potential moves
		var hypotheticalMatrix = [[0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0, 0]];
		
		//This is a matrix used to keep scores for each column to help the AI decide which to use.
		var columnScores = [0, 0, 0, 0, 0, 0, 0];
		
		//This function resets the hypotheicalMatrix to match the current board.
		function resetHypothetical(){
			for (var i = 0; i < 6; i++){
				for(var j = 0; j < 7; j++){
					hypotheticalMatrix[i][j] = boardMatrix[i][j];
				}
			}
		}
		resetHypothetical();
		
		if (dropColumn == -1){
			//check if any moves will set up the player for an immediate connect 4, and assign those columns a -10
			for (i = 0; i < 7; i++){
				for (j = 5; j >= 0; j--){
					if (hypotheticalMatrix[j][i] == 0){
						hypotheticalMatrix[j][i] = 2;
						var potentialPlayerFours = checkForPotentialFours(hypotheticalMatrix, 1);
						for (var k = 0; k < potentialPlayerFours.length; k++){
							if (potentialPlayerFours[k][0] == 5 || hypotheticalMatrix[potentialPlayerFours[k][0] +1][potentialPlayerFours[k][1]] != 0){
								columnScores[i] = -10;
								k = potentialPlayerFours.length;									
							}
						}
						j = -1;
						resetHypothetical();
					}
				}
			}			
			
			//check if any columns add additional threes that are potential fours for the AI. If so, give those columns +1 for each additional connect 4 they could lead to.
			var currentAIThrees = checkForPotentialFours(boardMatrix, 2).length;
			for (i = 0; i < 7; i++){
				for (j = 5; j >= 0; j--){
					if (hypotheticalMatrix[j][i] == 0){
						hypotheticalMatrix[j][i] = 2;
						var potentialAIFours = checkForPotentialFours(hypotheticalMatrix, 2);
						if (potentialAIFours.length > currentAIThrees){
							columnScores[i] += potentialAIFours.length - currentAIThrees;
						}
						j = -1;
						resetHypothetical();
					}
				}
			}	
			
			//check if any columns would create threes for the player if the player goes there so that the AI could block. If so, give those columns +2 for each three blocked
			var currentPlayerThrees = checkForPotentialFours(boardMatrix, 1).length;
			for (i = 0; i < 7; i++){
				for (j = 5; j >= 0; j--){
					if (hypotheticalMatrix[j][i] == 0){
						hypotheticalMatrix[j][i] = 1;
						var potentialPlayerFours = checkForPotentialFours(hypotheticalMatrix, 1);
						if (potentialPlayerFours.length > currentPlayerThrees){
							columnScores[i] += (potentialPlayerFours.length - currentPlayerThrees)*2;
						}
						j = -1;
						resetHypothetical();
					}
				}
			}
			
			//check if any columns set up the AI for a connect 4 the next turn. If so, give those columns -3 (because they give the player an opportunity to block them)
			for (i = 0; i < 7; i++){
				for (j = 5; j >= 0; j--){
					if (hypotheticalMatrix[j][i] == 0){
						hypotheticalMatrix[j][i] = 2;
						potentialAIFours = checkForPotentialFours(hypotheticalMatrix, 2);
						for (var k = 0; k < potentialAIFours.length; k++){
							if (potentialAIFours[k][0] == 5 || hypotheticalMatrix[potentialAIFours[k][0] +1][potentialAIFours[k][1]] != 0){
								columnScores[i] -= 3;
								k = potentialAIFours.length;									
							}
						}
						j = -1;
						resetHypothetical();
					}
				}
			}
			
			//select a drop column based on the column scores. In the case of a tie, select randomly between them.
			var highestScore = -1000;
			var highestColumns = [];
			for (var i = 0; i < columnScores.length; i++){
				if (boardMatrix[0][i] == 0){
					if (columnScores[i] > highestScore){
						highestScore = columnScores[i];
						highestColumns = [i];
					}else if (columnScores[i] == highestScore){
						highestColumns.push(i);
					}
				}
			}
			dropColumn = highestColumns[Math.floor(Math.random()*highestColumns.length)];			
		}
	}
	
	if (difficulty == "medium"){
		//For "medium", the computer does the things for easy, but also tries to keep the player from getting 3 in a row on their way to a connect 4
		aiGetC4();
		blockPlayer();
		blockThrees();
		derp();
	}else if(difficulty == "hard"){
		//For "hard", the computer assigns each column a score based on several factors and places a piece accordingly
		aiGetC4();
		blockPlayer();
		hardAI();
	}else{
		//For "easy", the computer only blocks the player if they can get connect 4 next turn, or they get connect 4 if they can this turn. Otherwise they decide randomly
		aiGetC4();
		blockPlayer();
		derp();
	}
	
	//Once the column is decided, this code actually drops the piece there
	for (var i = 5; i > -1; i--){
		if (boardMatrix[i][dropColumn] == 0){
			var tFunc = function(){
				if (!playerTurn){
					animatedDrop(2, dropColumn);
				}
			};
			window.setTimeout(tFunc, 600);
			i = -1;
		}
	}
}

//This uses a loop that calls itself with timeouts to animate the falling pieces
function animatedDrop(player, column){
	//the location, in pixels, of the animated piece
	var pieceLocation = [column * 75, -50];
	//the downward velocity of the piece. The piece accelerates until it lands on something.
	var vel = 0;

	function advanceFrame(){
		if (!animationStop){
			pieceLocation[1] += vel;
			vel += 3;
			//once the animated piece hits something, either the bottom of the board or another piece, have it stop moving and
			//set it in the board matrix.
			if (Math.ceil(pieceLocation[1] / 75.0) >= 6 || boardMatrix[Math.ceil(pieceLocation[1] / 75.0)][column] != 0){
				animationPlaying = false;
				boardMatrix[Math.ceil(pieceLocation[1] / 75.0) - 1][column] = player;
				drawBoard();
				if (player == 1){
					if (!checkForFours(1)){
						aiDrop();
					}			
				}else if(player == 2){
					if (!checkForFours(2)){
						if (!checkForTie()){
							playerTurn = true;
						}else{
							consoleDiv.innerHTML += "It's a tie!";
						}
					}
				}
			}else{
				drawBoard([player, pieceLocation[0], pieceLocation[1]]);
				window.setTimeout(advanceFrame, 40);
			}
		}else{
			animationStop = false;
		}
	}
	
	animationPlaying = true;
	advanceFrame();
}
	
//Activate the event handler for the player's clicks
document.addEventListener('click', clickHandler, false);	