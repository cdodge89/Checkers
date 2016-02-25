$(document).ready(function(){
	var blackSquare = true;
	var squares = [];
	var blackMove = false;
	var selectedSquare;
	var oldPos;
	var redChipLoc = '<img src="./Assets/RedChecker.png">';
	var blackChipLoc = '<img src="./Assets/BlackChecker.png">';

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
		
		
		var position = this.id;
		var row = +position[1];
		var col = +position[2];
		var square = squares[row][col];
		if(square.occupied && !square.king){
			//1. look at all four around it, and check for jumps. The two diagonally front can be moved into, any of the four can be jumped over.
			//2. Look at the two diagonally front, for red and black, and highlight them if they are not occupied
			if(square.chip == "black"){
				$(".whiteSquare").removeClass("highlight");
				$(this).addClass("highlight");
				selectedSquare = square;
				oldPos = square.position;

				if(row > 0 && col < 7 && !squares[(row - 1)][(col + 1)].occupied){
					$("#i" + (row-1).toString()+(col+1).toString()).addClass("highlight");
				}

				if (row > 0 && col > 0 && !squares[(row - 1)][(col - 1)].occupied){
					$("#i" + (row-1).toString()+(col-1).toString()).addClass("highlight");
				}

			} else if (square.chip == "red"){
				$(".whiteSquare").removeClass("highlight");
				$(this).addClass("highlight");
				selectedSquare = square;
				oldPos = square.position;


				if(row < 7 && col < 7 && !squares[(row + 1)][(col + 1)].occupied){
					$("#i" + (row + 1).toString()+(col + 1).toString()).addClass("highlight");
				}

				if (row < 7 && col > 0 && !squares[(row + 1)][(col - 1)].occupied){
					$("#i" + (row + 1).toString() + (col - 1).toString()).addClass("highlight");
				}
			}
		} else if(square.occupied && square.king){
			//look at all four around, going along the WHOLE diagonal until running into a piece. exclude edge pieces
		} else if(!square.occupied && $(this).hasClass("highlight")){
			$(".whiteSquare").removeClass("highlight");
			var oldRow = +oldPos[1];
			var oldCol = +oldPos[2];
			//change array
			squares[row][col] = selectedSquare;
			squares[row][col].position = "i"+row+col;
			console.log(squares[row][col].position)
			console.log(squares);
			console.log(oldPos);
			//append img to new div
			$(this).append(squares[row][col].img);
			//change old array spot
			squares[oldRow][oldCol] = "";
			//remove image from old div
			$("#i"+oldRow+oldCol).text("");
			oldPos = "";
			selectedSquare = "";
		} else{
			$(".whiteSquare").removeClass("highlight");
			selectedSquare = "";
		}

		

	});

	$(".blackSquare").on("click", function(){
		$(".whiteSquare").removeClass("highlight");
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

});