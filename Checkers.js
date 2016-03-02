$(document).ready(function(){
	var blackSquare = true;
	var squares = [];
	var blackMove = true;
	var selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
	var oldPos = "";
	var redChipLoc = '<img src="./Assets/RedChecker.png">';
	var blackChipLoc = '<img src="./Assets/BlackChecker.png">';
	var redChipKingLoc = '<img src="./Assets/RedCheckerKing.png">';
	var blackChipKingLoc = '<img src="./Assets/BlackCheckerKing.png">';
	var kingSelected = false;
	var redsCaptured = 0;
	var blacksCaptured = 0;
	var jumpablePieces = []

//====================START============================
	startUp(squares, blackSquare);
	
//==================CLICK LISTENERS===============
	$(".whiteSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight-red");
		var position = this.id;
		console.log(position[1]+position[2]);
		var row = +position[1];
		var col = +position[2];
		var square = squares[row][col];
		if(square.occupied && !square.king){
			$(".whiteSquare").removeClass("highlight-yellow");
			//1. look at all four around it, and check for jumps. The two diagonally front can be moved into, any of the four can be jumped over.
			//2. Look at the two diagonally front, for red and black, and highlight them if they are not occupied
			if(square.chip == "black" && blackMove){
				$(this).addClass("highlight-yellow");

				saveSquare(square);

				checkMoveBlack(squares,row,col);
				checkJumpBlack(squares,row,col);
			} else if (square.chip == "red" && !blackMove){
				$(this).addClass("highlight-yellow");

				saveSquare(square);
				
				checkMoveRed(squares,row,col);
				checkJumpRed(squares,row,col);
			} else {
				jumpablePieces = [];
				oldPos = "";
				selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
			}
		} else if(square.occupied && square.king){
			$(".whiteSquare").removeClass("highlight-yellow");
			if((square.chip == "black" && blackMove) || (square.chip == "red" && !blackMove)){
				$(this).addClass("highlight-yellow");
				saveSquare(square);
				checkMoveKing(squares,row,col);
				if(square.chip == "red"){
					checkJumpKingRed(squares,row,col);
				} else if (square.chip == "black"){
					checkJumpKingBlack(squares,row,col);
				}
			}
				
			//look at all four around, going along the WHOLE diagonal until running into a piece. exclude edge pieces
		} else if(!square.occupied && $(this).hasClass("highlight-yellow")){
			$(".whiteSquare").removeClass("highlight-yellow");
			var oldRow = +oldPos[1];
			var oldCol = +oldPos[2];			
			//change array
			squares[row][col] = selectedSquare;
			squares[row][col].position = "i"+row+col;
			//append img to new div
			$(this).append(squares[row][col].img);
			//change old array spot
			emptySquare(squares,oldRow,oldCol);
			//remove image from old div
			$("#i"+oldRow+oldCol).text("");
			//=========handle jumped piece=============
			if(jumpablePieces.length > 0){
				jumpPiece(jumpablePieces, position, squares);
			}
			
			if (selectedSquare.chip == "black"){
					blackMove = false;
			} else if (selectedSquare.chip =="red"){
				blackMove = true;
			}
			checkKingMe(selectedSquare.chip, position, squares);
			if(jumpablePieces.length == 0){
				selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
				oldPos = "";
			}

		} else{
			$(".whiteSquare").removeClass("highlight-yellow");
			oldPos = "";
			selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
			// resetJumpedPiece();
		}
	});

	$(".blackSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight-yellow");
		$(".whiteSquare").removeClass("highlight-red");
		oldPos = "";
		selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
		jumpablePieces = [];
		// resetJumpedPiece();
	});

	$("#test-btn").on("click", function(){
		var idArr = [
			54,
			43,
			25,
			34,
			43,
			32,
			16,
			25,
			65,
			54,
			21,
			43,
			65,
			56,
			45,
			34,
			43,
			67,
			56,
			23,
			32,
			76,
			67,
			65,
			76,
			52,
			34,
			16,
			76,
			65,
			45,
			36,
			65,
			47,
			25,
			74,
			65,
			25,
			34,
			67,
			56,
			07,
			25,
			61,
			52,
			12,
			21,
			52,
			43,
			03,
			12,
			56,
			45,
			34,
			52,
			74,
			56,
			34,
			52,
			74,
			56,
			34,
			14,
			23,
			61,
			52,
			21,
			30,
			52,
			43,
			34,
			52,
			74,
			56,
			34
		]
		var index = 0;
		var testIntervalID = window.setInterval(function(){
			if(index < idArr.length){
			clickCell(idArr[index]);
				index++;
			}
		},250);
	});

//===================================================FUNCTIONS=============================================
function clickCell(id){
	idStr = id.toString();
	$('#i'+idStr).click();
}

function startUp(arr, flag){
	for(var i = 0; i < 8; i++){
		var row = [];
		if(i%2 == 0){
			flag = true;
		}else{
			flag = false;
		}

		for(var j = 0; j < 8; j++){
			if(flag){
				$("#gameBoard").append("<div class='blackSquare'></div>");
				row.push({"position": ["i",i,j], "chip": "", "occupied": false, "king": false});
				flag = false;
			} else{
				if(i < 3){
					$("#gameBoard").append('<div class="whiteSquare">'+redChipLoc+'</div>');
					row.push({"position": ["i",i,j], "chip": "red", "occupied": true, "king": false, "img": redChipLoc});
				} else if(i > 4){
					$("#gameBoard").append('<div class="whiteSquare">'+blackChipLoc+'</div>');
					row.push({"position": ["i",i,j], "chip": "black", "occupied": true, "king": false, "img": blackChipLoc});
				} else{
					$("#gameBoard").append('<div class="whiteSquare"></div>');
					row.push({"position": ["i",i,j], "chip": "", "occupied": false, "king": false});
				}
				$("#gameBoard div:last-child").attr("id", "i"+i+j);
				flag = true;
			}
		}
		arr.push(row);
	}
}

function emptySquare(arr,row,col){
	arr[row][col] = {
		"position": ["i",row,col], 
		"chip": "", 
		"occupied": false, 
		"king": false
	}
}

function checkMoveRed(arr,row,col){
	if(row < 7 && col < 7 && !arr[(row + 1)][(col + 1)].occupied){
			$("#i" + (row + 1).toString()+(col + 1).toString()).addClass("highlight-yellow");
		} 
	if (row < 7 && col > 0 && !arr[(row + 1)][(col - 1)].occupied){
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-yellow");
		} 
}

function checkJumpRed(arr, row, col){
	// resetJumpedPiece();
	if(row < 7 && col < 7 && arr[(row + 1)][(col + 1)].occupied && arr[(row + 1)][(col + 1)].chip == "black"){
		if (row < 6 && col < 6 && !arr[(row + 2)][(col + 2)].occupied){
			$("#i" + (row + 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col + 2).toString();

			jumpablePieces.push(jumpedPiece);
			
		}
	}


	if(row < 7 && col > 0 && arr[(row + 1)][(col - 1)].occupied && arr[(row + 1)][(col - 1)].chip == "black"){
		if (row < 6 && col > 1 && !arr[(row + 2)][(col - 2)].occupied){
			$("#i" + (row + 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col - 2).toString();
			
			jumpablePieces.push(jumpedPiece);
			
		}
	}
}

function checkMoveBlack(arr, row, col){
	if(row > 0 && col < 7 && !arr[(row - 1)][(col + 1)].occupied){
			$("#i" + (row-1).toString()+(col+1).toString()).addClass("highlight-yellow");
		}
	if (row > 0 && col > 0 && !arr[(row - 1)][(col - 1)].occupied){
			$("#i" + (row-1).toString()+(col-1).toString()).addClass("highlight-yellow");
		} 
}

function checkJumpBlack(arr, row, col){
	
	// resetJumpedPiece();
	 if(row > 0 && col < 7 && arr[(row - 1)][(col + 1)].occupied && arr[(row - 1)][(col + 1)].chip == "red" ){
		if(row > 1 && col < 6 && !arr[(row - 2)][(col + 2)].occupied){
			$("#i" + (row - 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col + 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	}

	if (row > 0 && col > 0 && arr[(row - 1)][(col - 1)].occupied && arr[(row - 1)][(col - 1)].chip == "red"){
		if (row > 1 && col > 1 && !arr[(row - 2)][(col - 2)].occupied){
			$("#i" + (row - 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col - 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	} 
}

function jumpPiece(arr, position, squares){
	
	var jumpedPiece = jQuery.grep(arr, function(piece){
		return piece.jumpTo == position;
	});
	
	if(jumpedPiece.length > 0 && jumpedPiece[0].occupied){
		var jpPosition = jumpedPiece[0].position;
		var chip = jumpedPiece[0].chip;
		var jpRow = jpPosition[1];
		var jpCol = jpPosition[2];

		captureChip(chip);
		
		emptySquare(squares,jpRow,jpCol);
		$("#i"+jpRow+jpCol).text("");
		jumpablePieces = [];
		if(chip == "black"){
			// console.log("chip is black");
			checkJumpRed(squares, +position[1], +position[2]);
			if(selectedSquare.king){
				checkJumpKingRed(squares, +position[1], +position[2]);
			}
		} else if (chip == "red"){
			// console.log("Chip is red")
			checkJumpBlack(squares, +position[1], +position[2]);
			if(selectedSquare.king){
				checkJumpKingBlack(squares, +position[1], +position[2]);
			}
		}
		// console.log(jumpablePieces);
		if(jumpablePieces.length > 0){
			//======================================

			oldPos = position;
			// console.log("oldPos " , oldPos);
			// console.log("arr " , arr);

			// console.log("selected squares ", selectedSquare);

			selectedSquare = squares[+oldPos[1]][+oldPos[2]]; 
			// console.log("selected Square " + selectedSquare);
			// console.log("oldPos3 " + oldPos[0] + oldPos[1] + oldPos[2]);
		}
	} else{
		arr = [];
		jumpablePieces = [];
	}
}

function checkKingMe(color, pos, arr){
	var row = +pos[1];
	var col = +pos[2];
	if(color == "black" && row == 0){
		// console.log("inside");
		arr[row][col].img = blackChipKingLoc;
		arr[row][col].king = true;
		$("#i"+row.toString()+col.toString()).text("");
		$("#i"+row.toString()+col.toString()).append(arr[row][col].img);
	} else if(color == "red" && row == 7){
		// console.log("inside");
		arr[row][col].img = redChipKingLoc;
		arr[row][col].king = true;
		$("#i"+row.toString()+col.toString()).text("");
		$("#i"+row.toString()+col.toString()).append(arr[row][col].img);
	}
}

function checkMoveKing(arr, row, col){
	if(row < 7 && col < 7 && !arr[(row + 1)][(col + 1)].occupied){
			$("#i" + (row + 1).toString()+(col + 1).toString()).addClass("highlight-yellow");
		} 
	if (row < 7 && col > 0 && !arr[(row + 1)][(col - 1)].occupied){
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-yellow");
		}
	if(row > 0 && col < 7 && !arr[(row - 1)][(col + 1)].occupied){
			$("#i" + (row-1).toString()+(col+1).toString()).addClass("highlight-yellow");
		}
	if (row > 0 && col > 0 && !arr[(row - 1)][(col - 1)].occupied){
			$("#i" + (row-1).toString()+(col-1).toString()).addClass("highlight-yellow");
		}
}

function checkJumpKingBlack(arr, row, col){
	if(row > 0 && col < 7 && arr[(row - 1)][(col + 1)].occupied && arr[(row - 1)][(col + 1)].chip == "red" ){
		if(row > 1 && col < 6 && !arr[(row - 2)][(col + 2)].occupied){
			$("#i" + (row - 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col + 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	}

	if (row > 0 && col > 0 && arr[(row - 1)][(col - 1)].occupied && arr[(row - 1)][(col - 1)].chip == "red"){
		if (row > 1 && col > 1 && !arr[(row - 2)][(col - 2)].occupied){
			$("#i" + (row - 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col - 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	}

	if(row < 7 && col < 7 && arr[(row + 1)][(col + 1)].occupied && arr[(row + 1)][(col + 1)].chip == "red"){
		if (row < 6 && col < 6 && !arr[(row + 2)][(col + 2)].occupied){
			$("#i" + (row + 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col + 2).toString();

			jumpablePieces.push(jumpedPiece);
			
		}
	}


	if(row < 7 && col > 0 && arr[(row + 1)][(col - 1)].occupied && arr[(row + 1)][(col - 1)].chip == "red"){
		if (row < 6 && col > 1 && !arr[(row + 2)][(col - 2)].occupied){
			$("#i" + (row + 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col - 2).toString();
			
			jumpablePieces.push(jumpedPiece);
			
		}
	} 
}

function checkJumpKingRed(arr, row, col){
	if(row > 0 && col < 7 && arr[(row - 1)][(col + 1)].occupied && arr[(row - 1)][(col + 1)].chip == "black" ){
		if(row > 1 && col < 6 && !arr[(row - 2)][(col + 2)].occupied){
			$("#i" + (row - 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col + 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	}

	if (row > 0 && col > 0 && arr[(row - 1)][(col - 1)].occupied && arr[(row - 1)][(col - 1)].chip == "black"){
		if (row > 1 && col > 1 && !arr[(row - 2)][(col - 2)].occupied){
			$("#i" + (row - 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col - 2).toString();
			jumpablePieces.push(jumpedPiece);
			
		}
	}

	if(row < 7 && col < 7 && arr[(row + 1)][(col + 1)].occupied && arr[(row + 1)][(col + 1)].chip == "black"){
		if (row < 6 && col < 6 && !arr[(row + 2)][(col + 2)].occupied){
			$("#i" + (row + 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col + 2).toString();

			jumpablePieces.push(jumpedPiece);
			
		}
	}


	if(row < 7 && col > 0 && arr[(row + 1)][(col - 1)].occupied && arr[(row + 1)][(col - 1)].chip == "black"){
		if (row < 6 && col > 1 && !arr[(row + 2)][(col - 2)].occupied){
			$("#i" + (row + 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col - 2).toString();
			
			jumpablePieces.push(jumpedPiece);
			
		}
	} 
}

function saveSquare(square){
	selectedSquare = square;
	oldPos = square.position;
}

function captureChip(chip){
	if(chip == "black"){
		$("#black-prison").append('<li>' + blackChipLoc + '</li>');
		blacksCaptured++;
		if(blacksCaptured >= 12){
			alert("Red Wins!");
			gameReset();
		}
	} else if(chip == "red"){
		$("#red-prison").append('<li>' + redChipLoc + '</li>');
		redsCaptured++;
		if(redsCaptured >= 12){
			alert("Black Wins!");
			gameReset();
		}
	}
}

function gameReset(){
	//location.reload();
}
});


