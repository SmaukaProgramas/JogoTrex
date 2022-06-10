var trex ,trex_correndo ,trexcollide;
var solo, pngsolo, soloinvisivel;
var pngnuvem, pngcacto1, pngcacto2, pngcacto3, pngcacto4, pngcacto5, pngcacto6;
var gpcacto, gpnuvem;
var score = 0;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var gameoverpng, restartpng, gameover, restart;
var saltomp3, mortemp3, checkpointmp3;
//Função para carregar as animações
function preload(){
  
  pngnuvem = loadImage("cloud.png");
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  pngsolo = loadImage("ground2.png");
  pngcacto1 = loadImage("obstacle1.png");
  pngcacto2 = loadImage("obstacle2.png");
  pngcacto3 = loadImage("obstacle3.png");
  pngcacto4 = loadImage("obstacle4.png");
  pngcacto5 = loadImage("obstacle5.png");
  pngcacto6 = loadImage("obstacle6.png");
  trexcollide = loadImage("trex_collided.png");
  gameoverpng = loadImage("gameOver.png");
  restartpng = loadImage("restart.png");
  saltomp3 = loadSound("jump.mp3");
  mortemp3 = loadSound("die.mp3");
  checkpointmp3 = loadSound("checkpoint.mp3");
}


//Função para configuração padrão do jogo
function setup(){
  
  createCanvas(windowWidth,windowHeight);

  //criar um sprite do trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.scale = 0.5;
  trex.x = 50;
  trex.addImage("collide", trexcollide)

  solo = createSprite(width/2,height-20,width,20);
  solo.velocityX = -5;
  solo.addImage("ground", pngsolo);
  solo.x = solo.width/2;
  //criando solo invisível 
  soloinvisivel = createSprite(width/2,height-10,width,20); 
  soloinvisivel.visible = false;
  
  gameover = createSprite(width/2, height/2);
  gameover.addImage("perdeu", gameoverpng);
  gameover.scale = 0.8;

  restart = createSprite(width/2, height/2 + 40);
  restart.addImage("tente novamente", restartpng);
  restart.scale = 0.5;

  


  gpcacto = new Group();

  gpnuvem = new Group();
//spectro do trex
// trex.debug = true;
trex.setCollider("circle",0,0,40);


}

//Função desenho 
function draw(){
 background("white");
 
 text(score,width-100,50);
  
  
  if (gamestate === PLAY){
    score = score + Math.round(frameRate()/60);
    if(score > 0 && score%100 === 0){
      checkpointmp3.play();
    }
    
    if(keyDown("space")|| touches.length > 0 && trex.y > height-50){
      trex.velocityY = -13; 
      saltomp3.play();
      touches = [];
     }

    // gravidade para o trex voltar ao solo
    trex.velocityY = trex.velocityY + 0.8;
    
    solo.velocityX = -(5 + 3*score/100 );

    gameover.visible = false;
    restart.visible = false;

    

    //reinicialização do solo (solo infinito)  
    if(solo.x < 0){
      solo.x = solo.width/2;         
    }
    spawnClouds();
 
    spawnObstacles();

    if (trex.isTouching(gpcacto)){
      gamestate = END;
      mortemp3.play();
    }
    
   

  }
  else if(gamestate === END){
    solo.velocityX = 0;
    
    gpcacto.setVelocityXEach(0);
    
    gpnuvem.setVelocityXEach(0);

    gpcacto.setLifetimeEach(-1);
    
    gpnuvem.setLifetimeEach(-1);
     
    trex.velocityY = 0; 
    trex.changeAnimation("collide", trexcollide);

    gameover.visible = true;
    restart.visible = true;

  }  

  trex.collide(soloinvisivel);
  
  if(mousePressedOver(restart)){
    reset();
  }

  drawSprites();
   
}

function reset(){
  gamestate = PLAY;
  gpcacto.destroyEach();
  gpnuvem.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_correndo);
}


function spawnClouds(){
//criar uma nuvem a cada 60 frames
 if(frameCount % 60 === 0) { 
  var nuvem = createSprite(width,100,40,10);
  nuvem.velocityX = -3;
  //console.log(frameCount);
  nuvem.addImage ("Cloud", pngnuvem);
  nuvem.scale = 0.5;
//posição da nuvem em Y de forma aleatória entre 10 e 60, sendo somentes números exatos
  nuvem.y = Math.round(random(10,60));
//ajustando a profundidade da nuvem e o trex
  nuvem.depth = trex.depth;
  trex.depth = trex.depth + 1;
  nuvem.lifetime = width/nuvem.velocityX;
  gpnuvem.add(nuvem);
 }


}

function spawnObstacles(){
  //criar um obtáculo a cada 60 frames
  if(frameCount % 60 === 0) { 
    var obstacles = createSprite(width,height-40,10,40);
    obstacles.velocityX = -(6 + score/300);
    obstacles.scale = 0.6;
    obstacles.lifetime = width/obstacles.velocityX;
  //posição do obstáculo em Y de forma aleatória entre 10 e 60, sendo somentes números exatos
   var cacto = Math.round(random(1,6));
   switch(cacto) { 
     case 1: obstacles.addImage(pngcacto1);
     break;

     case 2: obstacles.addImage(pngcacto2);
     break;
     
     case 3: obstacles.addImage(pngcacto3);
     break;
     
     case 4: obstacles.addImage(pngcacto4);
     break;
     
     case 5: obstacles.addImage(pngcacto5);
     break;
      
     case 6: obstacles.addImage(pngcacto6);
     break;
     default : break;
   }
   gpcacto.add(obstacles);
  }
  
  }









