const url = 'data/map.json'
const urlImg = 'images/tiles4.png'
let player1 = []
let bomba = []

let movX = 64
let movY = 64

let lifes=5

let anticipadoRight = 0
let anticipadoDown = 0
let anticipadoUp = 0
let anticipadoLeft = 0

let mapRight = 1

let contRight = 15
let contDown = 15
let contUp = 3
let contLeft = 6
let contBomba = 0
let contDead = 11

let bombaX = 0
let bombaY = 0
let bombaCentro = 0

let bombaRight = 0
let bombaLeft = 0
let bombaUp = 0
let bombaDown = 0

let estancia = 1
let posPlayer = 0

let walkRight = false
let walkDown = false
let walkUp = false
let walkLeft = false
let bombaAct = false
let explocion = false

let imageTile
let Map

let enemysAct = true



/////////
let enemys = []
let imageEnemy = []

function preload () {
	Map = loadJSON(url)
	imageTile = loadImage(urlImg)

	
	for(let i = 0; i<= 17; i++){
		player1[i] = loadImage(`images/Personaje1/${i}.png`)
		bomba[i] = loadImage(`images/Bombas/${i}.png`)	
	}

	imageEnemy = loadImage(`images/Creep/0.png`)
	loadEnemys()
}

function setup() {
	frameRate(10)
	createCanvas(windowWidth, windowHeight);
	Map['getTile'] = function (col, row) {
		return this.tiles[row * this.cols + col]
	}
	
}

function draw() {
	background(`#808000`)
	
	posPlayer=Map.posPlayer

	render()
	movePlayer()
	
	if(enemysAct===true){
		moveEnemy()
	}else{

	}

	

	resume()


	switch(estancia){


		case 1://Estancia neutral
			image(player1[15],movX,movY,64,64)
		break;

		case 2://Estacia derecha
			image(player1[contRight],movX,movY,64,64)
			
			if (movX<anticipadoRight) {
				movX+=32
			}
			if(movX===anticipadoRight){
				walkRight=false
				contRight = 15
			}	

		break;

		case 3://Estancia Abajo
			image(player1[contDown],movX,movY,64,64)
			
			if (movY<anticipadoDown) {
				movY+=32
			}
			if(movY === anticipadoDown){
				walkDown = false
				contDown = 0
			}	

		break;

		case 4://Estancia arriba
			image(player1[contUp],movX,movY,64,64)
			
			if (movY>anticipadoUp) {
				movY-=32
			}
			if(movY === anticipadoUp){
				walkUp = false
				contUp = 3
			}	

		break;
		case 5://Estancia Izquierda
			image(player1[contLeft],movX,movY,64,64)
			
			if (movX>anticipadoLeft) {
				movX-=32
			}
			if(movX === anticipadoLeft){
				walkLeft = false
				contLeft = 6
			}	

		break;

		case 6://Estancia dead
			image(player1[contDead],movX,movY,64,64)
			contDead++
			if (contDead===14) {
				loseLife()
			}
		break;


	}

	//Control de conts y estancias
	if(walkRight === true){
		contRight++
	}else{
		contRight = 15
		walkRight = false
	}
	if(walkDown === true){
		contDown++
	}else{
		contDown = 0
		walkDown = false
	}
	if(walkUp === true){
		contUp++
	}else{
		contUp = 3
		walkUp = false
	}
	if(walkLeft === true){
		contLeft++
	}else{
		contLeft = 6
		walkLeft = false
	}

	
	if(contDead===14){
		contDead=11
		estancia=1
		
	}

	if(bombaAct === true){
		image(bomba[contBomba],bombaX,bombaY,64,64)
		if(explocion===true){
			if(Map.tiles[(bombaCentro+1)] === 3 || Map.tiles[(bombaCentro+1)] === 1){
				image(bomba[contBomba],bombaX+64,bombaY,64,64)
				if (Map.tiles[(bombaCentro+1)] === 1) {Map.tiles[bombaCentro+1]=3}
				
			}
			if(Map.tiles[bombaCentro-1] === 3 || Map.tiles[(bombaCentro-1)] === 1){
				image(bomba[contBomba],bombaX-64,bombaY,64,64)
				if (Map.tiles[(bombaCentro-1)] === 1) {Map.tiles[bombaCentro-1]=3}
			}
			if(Map.tiles[bombaCentro+19] === 3 || Map.tiles[(bombaCentro+19)] === 1){
				image(bomba[contBomba],bombaX,bombaY+64,64,64)
				if (Map.tiles[(bombaCentro+19)] === 1) {Map.tiles[bombaCentro+19]=3}
			}
			if(Map.tiles[bombaCentro-19] === 3 || Map.tiles[(bombaCentro-19)] === 1){
				image(bomba[contBomba],bombaX,bombaY-64,64,64)
				if (Map.tiles[(bombaCentro-19)] === 1) {Map.tiles[bombaCentro-19]=3}
			}
			
			bombaRight = bombaCentro+1
			bombaLeft = bombaCentro-1
			bombaUp = bombaCentro-19
			bombaDown = bombaCentro+19

			if(posPlayer === bombaCentro || posPlayer === bombaRight || posPlayer === bombaLeft || posPlayer === bombaUp || posPlayer === bombaDown){
				loseLife()
				bombaCentro=0
				bombaRigh = 0
				bombaLeft = 0
				bombaUp = 0
				bombaDown = 0
			}

			
			
		}else{

			explocion = false
		}
		contBomba++
	}else{
		contBomba = 0
		bombaCentro=0
		bombaRigh = 0
		bombaLeft = 0
		bombaUp = 0
		bombaDown = 0
		bombaAct = false
		explocion = false
	}

	if (lifes===0) {
		clear()
	}

}

 
function movePlayer(){

	//Movimiento de teclado
	if(keyIsDown(RIGHT_ARROW) && Map.tiles[posPlayer+1] === 3 && walkDown===false && walkUp===false && walkLeft===false && walkRight===false){//DERECHA
		
		walkRight = true
		anticipadoRight = movX+64
		estancia = 2 
		Map.posPlayer++

	}else if(keyIsDown(LEFT_ARROW) && Map.tiles[posPlayer-1] === 3 && walkDown===false && walkUp===false && walkLeft===false && walkRight===false){//IZQUIERDA
		walkLeft = true
		anticipadoLeft = movX-64
		estancia = 5
		Map.posPlayer--
	}else if(keyIsDown(UP_ARROW)&& Map.tiles[posPlayer-19] === 3 && walkDown===false && walkUp===false && walkLeft===false && walkRight===false){//ARRIBA
		
		walkUp = true
		anticipadoUp = movY-64
		estancia = 4 
		Map.posPlayer-=19

	}else if(keyIsDown(DOWN_ARROW)&& Map.tiles[posPlayer+19] === 3 && (Map.posPlayer+1) && walkDown===false && walkUp===false && walkLeft===false && walkRight===false){//ABAJO
		walkDown = true
		anticipadoDown = movY+64
		estancia = 3
		Map.posPlayer+=19

	}else if(keyIsDown(13) && bombaAct === false && walkDown===false && walkUp===false && walkLeft===false && walkRight===false){
		bombaAct = true
		bombaCentro = posPlayer

		bombaX = movX
		bombaY = movY

		

	}




	//Contador de imagenes
	if(contRight >= 18){
		contRight = 15
	}
	if(contDown >= 4){
		contDown = 0
	}
	if(contUp >= 6){
		contUp = 3
	}	
	if(contLeft >= 9){
		contLeft = 6
	}
	if(contBomba >= 18){
		contBomba = 0
		bombaAct = false
	}
	if(contBomba === 9){
		explocion = true
		
	}




}


const render = function () {

	for (var i = 0; i < Map.cols; i++) {
		for (var j = 0; j < Map.rows; j++) {
			


			let tile = Map.getTile(i, j)
			
			image(imageTile,
				i * Map.size,
				j * Map.size,
				Map.size,
				Map.size,
				(tile - 1) * Map.size,
				0,
				Map.size,
				Map.size,
				)

			
			//rect(i * Map.size,j * Map.size,64,64)
		}
	}
}


function resume()
{
	textSize(30);
	text("Vidas "+lifes, windowWidth-130, 80); 
}

function loadEnemys(){
	
	let varposEnemy=184
	let drawEnemyX=64*13
	let drawEnemyY=64*9

	for(let y=0; y<3; y++)
	{
		let enemy = {
			//cordenadas del enemigo
			posEnemy: varposEnemy,
			posDrawEnemyX: drawEnemyX,
			posDrawEnemyY: drawEnemyY,
			//tamaño del enemigo
			sizeY: 64,
			visivility:1,
			sizeX: 64,
		}
		enemys.push(enemy)
		
		if(y==0)
		{
			varposEnemy=26
			drawEnemyX=64*7
			drawEnemyY=64
		}
		else
		{
			varposEnemy=35
			drawEnemyX=64*16
			drawEnemyY=64
		}
	}
}

function moveEnemy()
{
	let repet

	for(let i=0; i<enemys.length; i++) 
	{
		do
		{
			repet=false


			if (bombaUp === enemys[i].posEnemy || bombaDown === enemys[i].posEnemy || bombaRight === enemys[i].posEnemy || bombaLeft === enemys[i].posEnemy) {
					
				enemys[i].visivility=0
			}
			if (enemys[i].visivility===1) {
				image(imageEnemy, enemys[i].posDrawEnemyX, enemys[i].posDrawEnemyY, enemys[i].sizeX, enemys[i].sizeY)

			
				if(Map.posPlayer==enemys[i].posEnemy)
					estancia = 6

				switch(Math.floor((Math.random()*5)+1))
				{
					case 1:
						if(Map.tiles[enemys[i].posEnemy+1]==3 && enemys[i].visivility===1)
						{
							enemys[i].posEnemy++
							enemys[i].posDrawEnemyX+=64
						}
						else
							repet=true
					break;

					case 2:
						if(Map.tiles[enemys[i].posEnemy-1]==3)
						{
							enemys[i].posEnemy--
							enemys[i].posDrawEnemyX-=64
						}
						else
							repet=true
					break;

					case 3:
						if(Map.tiles[enemys[i].posEnemy+Map.cols]==3)
						{
							enemys[i].posEnemy+=Map.cols
							enemys[i].posDrawEnemyY+=64
						}
						else
							repet=true
					break;

					case 4:
						if(Map.tiles[enemys[i].posEnemy-Map.cols]==3)
						{
							enemys[i].posEnemy-=Map.cols
							enemys[i].posDrawEnemyY-=64
						}
						else
							repet=true
					break;
					case 5:
						if(Map.tiles[enemys[i].posEnemy]==3)
						{
							enemys[i].posEnemy
							enemys[i].posDrawEnemyY
						}
						else
							repet=true
					break;

				}
			}	
		}while(repet==true)
	}
}

function loseLife()
{
	lifes--
	Map.posPlayer=20
	movX=64
	movY=64
	Map.posXBomb=1
	Map.posYBomb=1
	
	estancia=1
	anticipadoRight = 0
	anticipadoDown = 0
	anticipadoUp = 0
	anticipadoLeft = 0

	contRight = 15
	contDown = 15
	contUp = 3
	contLeft = 6

	estancia = 1

	walkRight = false
	walkDown = false
	walkUp = false
	walkLeft = false
}