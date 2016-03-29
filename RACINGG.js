
// 1. DECLARACIÓN DE VARIABLES
// ***************************

// variable scanvas
var canvas;
var canvasContext;

canvas = document.getElementById("gameCanvas");
canvasContext = canvas.getContext("2d");

// variables tile-based grid
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 40;
const TRACK_COLUMNS = 20;
const TRACK_ROWS = 15;
const TRACK_GAP = 1;

var trackGrid = [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 
        1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 
        1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
        1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];


// variables car
var carX = 75;
var carY = 75;
var carSpeedX = 6;
var carSpeedY = 8;

var carPic = document.createElement("img");
var carLoaded = false;
carPic.onload = function() {
	carLoaded = true;
};

// variables animation loop
var frameRate = 30;


// 2. DECLARACIÓN DE FUNCIONES
// ****************************

// carReset() --> Posiciona inicialmente el coche
// ----------------------------

var carReset = function() {

	carX = canvas.width / 2 + 50;
	carY = canvas.height / 2;
};


// ****************************
// funciones tile-based grid
// ****************************


// pixelToTile(pixelX,pixelY) --> Averigua en qué celda de la cuadrícula se encuentra el pixel
// -------------------------------------

var pixelToTile = function(pixelX,pixelY) {

	// Declaración de variables
	var col, row;

	// Averiguar celda
	col = Math.floor(pixelX / TRACK_WIDTH);
	row = Math.floor(pixelY / TRACK_HEIGHT);

	// Devolver valor
	return {
		col : col,
		row : row
	};

};


// tileToArrayIndex(col,row) --> Devuelve el índice del elemento del array al que le corresponde la celda que 
// se le pasa como argumento.
// -------------------------------------

var tileToArrayIndex = function(col,row) {

	// Declaración de variables
	var index ;

	// Calcular indice
	index = col + ( row * TRACK_COLUMNS );

	// Devolver indice
	return index;

};

// isSpriteInTile(col,row) --> Comprueba si hay un sprite que renderizar en la celda que se le pasa como argumento
// ------------------------------------

var isSpriteInTile = function(col,row) {

	// Declaración de variables
	var index;

	// 1. Averiguar el índice del elemento del array al que le corresponde la celda.
	index = tileToArrayIndex(col,row);

	// 2. Comprobar el valor del elemento del array es 0 . Si es 0, no hay un sprite en esa celda.
	if ( trackGrid[index] !== 0 ) {

		return true;
		

	}
	else {

		return false;

	}

};



// ****************************
// funciones actualizacion representacion interna 
// *****************************

// checkAndBounce(carX,carY) --> Comprueba si el coche ha golpeado contra algún obstáculo y hace que rebote.
// --------------------------------

var checkAndBounce = function(pixelX,pixelY) {

	// Declaración de variables
	var currentTile;

	// 1. Averiguar en qué celda de la cuadrícula se encuentra el pixel
	currentTile = pixelToTile(pixelX,pixelY);
	
	
	

	// 2. Comprobar si hay un sprite en esa cuadrícula
	if (isSpriteInTile(currentTile.col,currentTile.row)) {

		// 3. Si lo hay, gestionar el rebote

		// Declaracion variables 
		var previousTile;
		var previousTileX; 
		var previousTileY;
		var cornerbounce = true;

		// Calcular la celda en la que se encontraba el coche en el frame anterior.
		previousTileX = carX - carSpeedX;
		previousTileY = carY - carSpeedY;
		previousTile = pixelToTile(previousTileX,previousTileY);

		// Para el caso en que la pelota golpee un lado vertical del tile : cambia la columna
		if(previousTile.col !== currentTile.col) {

			// No puede golpear en un lado si hay un sprite en la celda adyacente
			if(!isSpriteInTile(previousTile.col,currentTile.row)) {

				carSpeedX *= -1;

				cornerbounce = false;

			}

		}

		// Para el caso en que el coche golpee el lado superior o inferior de un tile : cambia la fila
		if(previousTile.row !== currentTile.row) {

			// No puede golpear un lado vertical si hay un sprite en el tile superior o inferior del que
			// viene el coche ( el tile superior o inferior adyacente)
			if(!isSpriteInTile(currentTile.col,previousTile.row)) {

				carSpeedY *= -1;

				cornerbounce = false;
			}

		}

		// Para el caso de que golpee una esquina
		if(cornerbounce) {

			carSpeedY *= -1;
			carSpeedX *= -1;

		}
	}

};


// moveEverything --> Agrupa todas las operaciones que actualizan la representación interna del juego.
// --------------------------------

var moveEverything = function() {

	// Rebote si llega a los límites del canvas

	if (carX < 0) {
		carSpeedX *= -1;
	}
	if (carX > canvas.width) {
		carSpeedX *= -1;
	}
	if (carY < 0) {
		carSpeedY *= -1;
	}
	if (carY > canvas.height) {
		carReset();
	}

	// Gestión del rebote del coche
	checkAndBounce(carX,carY);

	// Actualizar coordenadas(x,y) del coche
	carX += carSpeedX;
	carY += carSpeedY;

};




// ****************************
// funciones de dibujo
// ****************************


// drawRect --> Dibuja un rectangulo
// ------------------------------------

//var drawRect = function(rectTopX,rectTopY, rectWidth,rectHeight, fillColor) {

	// Valores por defecto
//	fillColor = fillColor || "white";

	// Renderizar rectángulo
//	canvasContext.fillStyle = fillColor;
//	canvasContext.fillRect(rectTopX,rectTopY, rectWidth,rectHeight);

//};



var drawRect = function(rectTopX,rectTopY, rectWidth,rectHeight, fillColor) {

	// Valores por defecto
	fillColor = fillColor || "white";

	// Renderizar rectangulos
	canvasContext.fillStyle = fillColor; 
	canvasContext.fillRect(rectTopX,rectTopY, rectWidth,rectHeight);

};

// drawCircle --> Dibuja un circulo
// ------------------------------------

var drawCircle = function(circleX,circleY, radius, fillColor) {

	// Valores por defecto
	fillColor = fillColor || "white";

	// Draw circle
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(circleX,circleY, radius, 0,Math.PI*2, true);
	canvasContext.fill();

};


// drawGrid --> Dibuja lo sprites en los distintos tiles de la grid
// -------------------------------------


var drawGrid = function() {

	// Declaracion variables
	var col, row;
	var tileX,tileY;

	// Dibujar cuadricula
	for ( col = 0; col < TRACK_COLUMNS; col++ ) {

		for ( row = 0; row < TRACK_ROWS; row++ ) {

			// Coordenadas esquina superior izquierda
			tileX = col * TRACK_WIDTH;
			tileY = row * TRACK_HEIGHT;

			//  Dibujar cledas
			if (isSpriteInTile(col,row)) {

				drawRect(tileX,tileY, TRACK_WIDTH - TRACK_GAP, TRACK_HEIGHT - TRACK_GAP, "blue");

			}

		}
	}
};

//var drawGrid = function() {
//
//	// Declaracion de variables
//	var col, row, trackTileX,trackTileY;
//
//	// Dibujar cuadrícula

//	for ( row = 0; row < TRACK_ROWS; row++ ) {
//
//		for ( col = 0; col < TRACK_COLUMNS; col++ ) {
//
//			trackTileX = col * TRACK_WIDTH;
//			trackTileY = row * TRACK_HEIGHT;
//
//			drawRect(trackTileX,trackTileY, TRACK_WIDTH - TRACK_GAP, TRACK_HEIGHT - TRACK_GAP, "blue");
//
//		}
//	}
//};


//var drawBricks = function() {
//
//	var row, col;
//	var brickX,brickY;
//
//	for ( row = 0; row < BRICK_ROWS; row++ ) {
//
//		for ( col = 0; col < BRICK_COLUMNS; col++ ) {
//
//			// Comprobar si hay un brick la celda que corresponde a esa coordenada (col,row)
//			if (isBrickAtTileCoord(col,row)) {
//
//				// Calcular coordenadas (x,y) de los bricks
//				brickX = col * BRICK_WIDTH;
//				brickY = row * BRICK_HEIGHT;
//
//				//Dibujar el brick
//				drawRect(brickX,brickY, BRICK_WIDTH - BRICK_GAP,BRICK_HEIGHT - BRICK_GAP, "blue");
//
//			}
//
//
//		}
//
//	}
//
//};


// drawCar --> dibuja el sprite del coche
// ------------------------------------

var drawCar = function() {

	canvasContext.drawImage(carPic, carX - (carPic.width /2),carY - (carPic.height / 2));

};


// drawEverything --> Agrupa todas las operaciones de dibujo
// -------------------------------------

var drawEverything = function() {

	// Dibujar canvas
	drawRect(0,0, canvas.width,canvas.height, "black"); 	

	// Dibujar cuadrícula
	drawGrid();

	// Draw car
	//drawCar();
	
	drawCircle(carX,carY, 10, "red");
};

// EJECUCIÓN
// ****************************

carReset();

carPic.src ="player1.png";


setInterval(function() {

	moveEverything();
	drawEverything();

}, 1000 / frameRate);