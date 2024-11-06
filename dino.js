//BOARD PROPERTIES
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//CLOUD PROPERTIES
let cloudArray = [];

let cloudWidth = 100;
let cloudHeight = 70;
let cloudX = 900;
let cloudImg;


//DINO PROPERTIES
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

//DUCKING PROPERTIES
let dinoDuckHeight = 60;
let dinoDuckWidth = 110;
let dinoDuckY = boardHeight - dinoDuckHeight;
let dinoDuckX = 50
let dinoDuckImg;
let isDucking = false;

//SPAWN COOL DOWN PROPERTIES
let spawnCd = 0;

//setting dino as an object and creating its keys
let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//CACTUS PROPERTIES 
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 64;
let cactus3Width = 72;

let cactusHeight = 60;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//BIRD PROPERTIES 
let birdArray = [];

let birdWidth = 55;
let birdHeight = 45;

let birdX = 700;
let birdY = 131;

//physics
let velocityX = -6;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

///////////////////////////////////////////////////////////////////////////////////////

window.onload = function () {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    dinoImg = new Image();
    dinoImg.src = "./dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    //Load ducking img
    dinoDuckImg = new Image();
    dinoDuckImg.src = "./dino-duck1.png"

    //cloud images
    cloudImg = new Image();
    cloudImg.src = "./cloud1.png"

    //cacti images
    cactus1Img = new Image();
    cactus1Img.src = "./cactus1.png"

    cactus2Img = new Image();
    cactus2Img.src = "./cactus2.png"

    cactus3Img = new Image();
    cactus3Img.src = "./cactus3.png"

    //bird images
    birdImg = new Image();
    birdImg.src = "./bird1.png"

requestAnimationFrame(update); // dino is drawn over and over again every frame

//SETTING INTERVALS TO SPAWN THE OBJECTS
setInterval(placeBird, 1000)
setInterval(placeCactus, 1000)
setInterval(placeCloud, 1000)

document.addEventListener("keydown", moveDino); //whenever key is pressed, calls moveDino fn

//when down key is released
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowDown"){
        dino.height = dinoHeight; //resets
        dino.y = dinoY;
        dino.width = dinoWidth
        isDucking = false;
    }
})
}

///////////////////////////////////////////////////////////////////////////////////////

//UPDATE FUNCTION
function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return
    }

    context.clearRect(0, 0, board.width, board.height)
    //cloud
    for (let i = 0; i< cloudArray.length; i++){
        let cloud = cloudArray[i];
        cloud.x += velocityX;
        context.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
    }
    
    //cooldown 
    if (spawnCd > 0){
        spawnCd--;
    }

    //dino ducking
    if (!isDucking){  //applies gravity to current dino.y; dinoY is default Y position
        velocityY += gravity;
        dino.y = Math.min(dino.y + velocityY, dinoY);
    }

    if (isDucking == true){
        context.drawImage(dinoDuckImg, dino.x, dino.y, dino.width, dino.height);

    } else {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    
    //bird
    for (let i = 0; i < birdArray.length; i++){
        let bird = birdArray[i];
        bird.x += velocityX
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //sees if dino runs into cactus
    if (detectCollision(dino, bird) || (detectCollision(dino, bird) && isDucking == true)){
        gameOver = true;
        context.clearRect(dino.x, dino.y, dino.width, dino.height);
        dino.height = dinoHeight;
        dino.width = dinoWidth;
        dino.y = dinoY
        dinoImg.src = "./dino-dead.png";
        dinoImg.onload = function (){
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
        };
        return;
    }
}
    //cactus 
    for (let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x += velocityX
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

    //sees if dino runs into cactus
        if (detectCollision(dino, cactus) || (detectCollision(dino, cactus) && isDucking == true)){
            gameOver = true;
            context.clearRect(dino.x, dino.y, dino.width, dino.height);
            dino.height = dinoHeight;
            dino.width = dinoWidth;
            dino.y = dinoY
            dinoImg.src = "./dino-dead.png";
            dinoImg.onload = function (){
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
            };
            return;
        }  
    }
    if (score > 1000){
        velocityX = -7
    } else if (score > 2000){
        velocityX = -8
    } else if (score > 3000){
        velocityX = -11
    }
    
    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20)
}

//MOVE DINO
const moveDino = (e) => {
    if (gameOver){
        return;
    }
    if((e.code == "Space" || e.code == "ArrowUp") && dino.y === dinoY){//checks if dino is on ground so you can jump
        //jump
        velocityY = -10;
         
    }
    else if (e.code == "ArrowDown" && dino.y === dinoY){
        isDucking = true;
        dino.y = dinoDuckY;
        dino.height = dinoDuckHeight;
        dino.width = dinoDuckWidth;
        
    }
    
}

// PLACING CLOUDS
const placeCloud = () => {
    if(gameOver){
        return;
    }
    let randomY = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    let cloud = {
        img: cloudImg,
        x : cloudX,
        y : randomY,
        width : cloudWidth,
        height : cloudHeight
    }
    let placeCloudChance = Math.random();
    if (placeCloudChance > .50){
        cloudArray.push(cloud)
    }
    if (placeBirdChance.length > 5){
        cloudArray.shift();
    }
}


//PLACING BIRDS
const placeBird = () =>{
    if (gameOver || spawnCd > 0){
        return;
    }

    let bird = {
        img: birdImg,
        x : birdX,
        y : birdY,
        width : birdWidth,
        height : birdHeight
    }

    let placeBirdChance = Math.random();
    if (placeBirdChance > .65) {
        birdArray.push(bird)
        spawnCd = 90;
    }
    if (placeBirdChance.length > 5){
        birdArray.shift(); //removes 1st element from array
    }

}

//PLACING CACTUS
const placeCactus = () => {
    if (gameOver || spawnCd > 0){
        return
    }
    //every second, there's a chance that there will be a cactus
    let cactus = {
        img : null, 
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight
    }

    //chances for cacti to spawn
    let placeCactusChance = Math.random(); 
    if (placeCactusChance > .80) { //10% chance cactus3 will spawn
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
        spawnCd = 60;
    }
    else if (placeCactusChance > .60){ //30% chance cactus2 will spawn
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus)
        spawnCd = 60;
    }
    else if (placeCactusChance > .50) { //50% chance cactus1 will spawn
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
        spawnCd = 60;

    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //removes 1st element from array
    }
}

//COLLISION FUNCTION

const detectCollision = (a,b) => {
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&     //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&    // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;      // a's bottom left corner basses b's top left corner
}

