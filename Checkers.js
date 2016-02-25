$(document).ready(function(){
	var blackSquare = true;
	var squares = [];
	var blackMove = true;
	var selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
	var oldPos = {position: ["n","n"], chip: "", occupied: false, king: false};
	var redChipLoc = '<img src="./Assets/RedChecker.png">';
	var blackChipLoc = '<img src="./Assets/BlackChecker.png">';
	// var jumpedPiece = {position: ["n","n"], chip: "", occupied: false, king: false};
	var jumpablePieces = []

	// var objectExample = {
	// 	position: [i,2,4],
	// 	chip: "red", or "black" or ""
	// 	occupied: true,
	// 	king: false
	// }

//====================START============================
	startUp(squares, blackSquare);
	console.log(squares);
//==================CLICK LISTENERS===============
	$(".whiteSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight-red");
		
		
		var position = this.id;
		var row = +position[1];
		var col = +position[2];
		var square = squares[row][col];
		if(square.occupied && !square.king){
			//1. look at all four around it, and check for jumps. The two diagonally front can be moved into, any of the four can be jumped over.
			//2. Look at the two diagonally front, for red and black, and highlight them if they are not occupied
			if(square.chip == "black" && blackMove){
				$(".whiteSquare").removeClass("highlight-yellow");
				$(this).addClass("highlight-yellow");
				selectedSquare = square;
				oldPos = square.position;
				checkJumpBlack(squares,row,col);
				// blackMove = false;
			} else if (square.chip == "red" && !blackMove){
				$(".whiteSquare").removeClass("highlight-yellow");
				$(this).addClass("highlight-yellow");
				selectedSquare = square;
				oldPos = square.position;
				checkJumpRed(squares,row,col)
				// blackMove = true;
			}
		} else if(square.occupied && square.king){
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
				var jumpedPiece = jQuery.grep(jumpablePieces, function(piece){
					return piece.jumpTo == position;
				});
				if(jumpedPiece[0].occupied){
					console.log("in");
					var jpPosition = jumpedPiece[0].position;
					var chip = jumpedPiece[0].chip;
					var jpRow = jpPosition[1];
					var jpCol = jpPosition[2];

					if(chip == "black"){
						$("#black-prison").append('<li>' + blackChipLoc + '</li>');
					} else if(chip == "red"){
						$("#red-prison").append('<li>' + redChipLoc + '</li>');
					}
					emptySquare(squares,jpRow,jpCol);
					$("#i"+jpRow+jpCol).text("");
					console.log(squares[jpRow][jpCol]);
				}
			}
			
			// console.log("here");
			//===========reset stuff===================
			oldPos = {position: ["n","n"], chip: "", occupied: false, king: false};
			selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
			resetJumpedPiece();
			if (blackMove){
				blackMove = false;
			} else{
				blackMove = true;
			}
		} else{
			$(".whiteSquare").removeClass("highlight-yellow");
			oldPos = {position: ["n","n"], chip: "", occupied: false, king: false};
			selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
			resetJumpedPiece();
		}

		

	});

	$(".blackSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight-yellow");
		$(".whiteSquare").removeClass("highlight-red");
		oldPos = {position: ["n","n"], chip: "", occupied: false, king: false};
		selectedSquare = {position: ["n","n"], chip: "", occupied: false, king: false};
		resetJumpedPiece();
	});

//===================================================FUNCTIONS=============================================

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

function resetJumpedPiece(){
	jumpedPiece = {
		position: ["n","n"],
		chip: "",
		occupied: false,
		king: false
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

function checkJumpRed(arr, row, col){
	resetJumpedPiece();
	if(row < 7 && col < 7 && !arr[(row + 1)][(col + 1)].occupied){
		$("#i" + (row + 1).toString()+(col + 1).toString()).addClass("highlight-yellow");
	} else if(row < 7 && col < 7 && arr[(row + 1)][(col + 1)].occupied && arr[(row + 1)][(col + 1)].chip == "black"){
		if (row < 6 && col < 6 && !arr[(row + 2)][(col + 2)].occupied){
			$("#i" + (row + 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col + 2).toString();
			// console.log(jumpedPiece);
			jumpablePieces.push(jumpedPiece);
		}
	}


	if (row < 7 && col > 0 && !arr[(row + 1)][(col - 1)].occupied){
		$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-yellow");
	} else if(row < 7 && col > 0 && arr[(row + 1)][(col - 1)].occupied && arr[(row + 1)][(col - 1)].chip == "black"){
		if (row < 6 && col > 1 && !arr[(row + 2)][(col - 2)].occupied){
			$("#i" + (row + 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row + 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row + 2).toString() + (col - 2).toString();
			// console.log(jumpedPiece);
			jumpablePieces.push(jumpedPiece);
		}
	}
}
function checkJumpBlack(arr, row, col){
	resetJumpedPiece();
	if(row > 0 && col < 7 && !arr[(row - 1)][(col + 1)].occupied){
		$("#i" + (row-1).toString()+(col+1).toString()).addClass("highlight-yellow");
	} else if(row > 0 && col < 7 && arr[(row - 1)][(col + 1)].occupied && arr[(row - 1)][(col + 1)].chip == "red" ){
		if(row > 1 && col < 6 && !arr[(row - 2)][(col + 2)].occupied){
			$("#i" + (row - 2).toString() + (col + 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col + 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col + 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col + 2).toString();
			jumpablePieces.push(jumpedPiece);
		}
	}

	if (row > 0 && col > 0 && !arr[(row - 1)][(col - 1)].occupied){
		$("#i" + (row-1).toString()+(col-1).toString()).addClass("highlight-yellow");
	} else if (row > 0 && col > 0 && arr[(row - 1)][(col - 1)].occupied && arr[(row - 1)][(col - 1)].chip == "red"){
		if (row > 1 && col > 1 && !arr[(row - 2)][(col - 2)].occupied){
			$("#i" + (row - 2).toString() + (col - 2).toString()).addClass("highlight-yellow");
			$("#i" + (row - 1).toString() + (col - 1).toString()).addClass("highlight-red");
			var jumpedPiece = arr[(row - 1)][(col - 1)];
			jumpedPiece.jumpTo = "i" + (row - 2).toString() + (col - 2).toString();
			jumpablePieces.push(jumpedPiece);
		}
	} 
}


});

