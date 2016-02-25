$(document).ready(function(){
	var blackSquare = true;
	var squares = [];
	var blackMove = false;

//====================START============================
	for(var i = 0; i < 8; i++){
		var row = [];
		if(i%2 == 0){
			blackSquare = true;
		}else{
			blackSquare = false;
		}

		for(var j = 0; j < 8; j++){
			if(blackSquare){
				$("#gameBoard").append("<div class='blackSquare'></div>");
				row.push({"position": ["i",i,j], "chip": "", "occupied": false, "king": false});
				blackSquare = false;
			} else{
				if(i < 3){
					$("#gameBoard").append('<div class="whiteSquare"><img src="./Assets/RedCheckerKing.png"></div>');
					row.push({"position": ["i",i,j], "chip": "red", "occupied": true, "king": false});
				} else if(i > 4){
					$("#gameBoard").append('<div class="whiteSquare"><img src="./Assets/BlackChecker.png"></div>');
					row.push({"position": ["i",i,j], "chip": "black", "occupied": true, "king": false});
				} else{
					$("#gameBoard").append('<div class="whiteSquare"></div>');
					row.push({"position": ["i",i,j], "chip": "", "occupied": false, "king": false});
				}
				$("#gameBoard div:last-child").attr("id", "i"+i+j);
				blackSquare = true;
			}
		}
		squares.push(row);
	}
	console.log(squares);
//==================CLICK LISTENERS===============
	$(".whiteSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight");
		
		var position = this.id;
		var row = +position[1];
		var col = +position[2];
		var square = squares[row][col];
		if(square.occupied && !square.king){
			//1. look at all four around it, and check for jumps. The two diagonally front can be moved into, any of the four can be jumped over.
			//2. Look at the two diagonally front, for red and black, and highlight them if they are not occupied
			if(square.chip == "black"){
				$(this).toggleClass("highlight");
				if(row > 0 && col < 7 && !squares[(row - 1)][(col + 1)].occupied){
					$("#i" + (row-1).toString()+(col+1).toString()).toggleClass("highlight");
				}
				if (row > 0 && col > 0 && !squares[(row - 1)][(col - 1)].occupied){
					$("#i" + (row-1).toString()+(col-1).toString()).toggleClass("highlight");
				}//I need to handle the error that shows up. If I don't, my work around wont work after the pieces start moving. I need to add logic to check if the next one is outside the array boundaries before look at the spot
			} else if (square.chip == "red"){
				$(this).toggleClass("highlight");
				if(row < 7 && col < 7 && !squares[(row + 1)][(col + 1)].occupied){
					$("#i" + (row + 1).toString()+(col + 1).toString()).toggleClass("highlight");
				}
				if (row < 7 && col > 0 && !squares[(row + 1)][(col - 1)].occupied){
					$("#i" + (row + 1).toString() + (col - 1).toString()).toggleClass("highlight");
				}
			}
		} else if(square.occupied && square.king){
			//look at all four around, going along the WHOLE diagonal until running into a piece. exclude edge pieces
		}

	});

	$(".blackSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight");
	});

});