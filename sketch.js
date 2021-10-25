var INICIAL = 1;
var FINAL = 2;
var EstadoJogo = INICIAL;

var trex, trex_correndo, trex_colidindo;
var solo, terreno;
var soloInvisivel;
var nuvem, nuvemCeu;
var pedra, pedra1, pedra2, pedra3, pedra4, pedra5, pedra6;
var pontos;

var GrupoDePedra;
var GruopoDaNuvem;

var morte;
var reiniciar;

var som_pulo, som_morte, som_tempo;

function preload() {
  //Chama as animacoes e imagens
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidindo = loadAnimation("trex_collided.png");

  terreno = loadImage("ground2.png");

  nuvemCeu = loadImage("cloud.png");

  pedra1 = loadImage("obstacle1.png");
  pedra2 = loadImage("obstacle2.png");
  pedra3 = loadImage("obstacle3.png");
  pedra4 = loadImage("obstacle4.png");
  pedra5 = loadImage("obstacle5.png");
  pedra6 = loadImage("obstacle6.png");

  reiniciar = loadImage("restart.png");
  fim = loadImage("gameOver.png");

  imgreiniciar = loadImage("restart.png");
  imgfim = loadImage("gameOver.png");

  som_pulo = loadSound("jump.mp3");
  som_morte = loadSound("die.mp3");
  som_tempo = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  //criar um sprite do trex
  trex = createSprite(50, 140, 20, 50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidindo", trex_colidindo);
  trex.scale = 0.8;

  //cria um sprite do  solo
  solo = createSprite(300, 185, 600, 30);
  solo.addImage("terreno", terreno);
  solo.x = solo.width / 2;

  soloInvisivel = createSprite(300, 190, 600, 30);
  soloInvisivel.visible = false;

  pontos = 0;

  trex.setCollider("circle", 0, 0, 25);
  trex.debug = true;

  fim = createSprite(300, 100);
  fim.addImage(imgfim);

  reiniciar = createSprite(300, 140);
  reiniciar.addImage(imgreiniciar);

  fim.scale = 0.5;
  reiniciar.scale = 0.5;

  GrupoDePedra = createGroup();
  GrupoDaNuvem = createGroup();
}

function draw() {
  background("white");

  text(" Score " + pontos, 520, 30);

  if (EstadoJogo === INICIAL) {
    Obstaculos();

    CriarNuvens();

    trex.velocityY = trex.velocityY + 2;

    solo.velocityX = -(3 + pontos / 500);

    pontos = pontos + Math.round(frameCount / 60);

    fim.visible = false;
    reiniciar.visible = false;

    SomMarcacao();

    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }

    if (keyDown("space") && trex.y >= 150) {
      trex.velocityY = -18;
      som_pulo.play();
    }

    if (GrupoDePedra.isTouching(trex)) {
      EstadoJogo = FINAL;
      som_morte.play();
      //trex.velocityY = -20;
      //som_pulo.play();
    }
  } else if (EstadoJogo === FINAL) {
    solo.velocityX = 0;

    fim.visible = true;
    reiniciar.visible = true;

    GrupoDaNuvem.setLifetimeEach(-1);
    GrupoDePedra.setLifetimeEach(-1);

    if (mousePressedOver(reiniciar)) {
      Reset();
    }

    GrupoDePedra.setVelocityXEach(0);
    GrupoDaNuvem.setVelocityXEach(0);

    trex.changeAnimation("colidindo", trex_colidindo);
  }

  //Cria uma gravidade adicionando velocidade Y para baixo ao trex

  // Faz o trex se colidir com o solo
  trex.collide(soloInvisivel);

  //Desenha na tela
  drawSprites();
}

function CriarNuvens() {
  if (frameCount % 80 === 0) {
    nuvem = createSprite(600, 50, 50, 50);
    nuvem.addImage(nuvemCeu);
    nuvem.velocityX = -3;
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(10, 150));

    nuvem.lifetime = 220;

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    GrupoDaNuvem.add(nuvem);
  }
}

function Obstaculos() {
  if (frameCount % 100 === 0) {
    pedra = createSprite(600, 170, 25, 25);
    pedra.velocityX = -(8 + pontos / 500);

    var aleatoria = Math.round(random(1, 6));
    switch (aleatoria) {
      case 1:
        pedra.addImage(pedra1);
        break;

      case 2:
        pedra.addImage(pedra2);
        break;

      case 3:
        pedra.addImage(pedra3);
        break;

      case 4:
        pedra.addImage(pedra4);
        break;

      case 5:
        pedra.addImage(pedra5);
        break;

      case 6:
        pedra.addImage(pedra6);
        break;

      default:
        break;
    }

    pedra.scale = 0.5;

    pedra.lifetime = 220;

    GrupoDePedra.add(pedra);
  }
}

function SomMarcacao() {
  if (pontos % 500 === 0 && pontos > 0) {
    som_tempo.play();
  }
}

function Reset() {
  EstadoJogo = INICIAL;
  pontos = 0;
  trex.changeAnimation("correndo", trex_correndo);
  GrupoDaNuvem.destroyEach();
  GrupoDePedra.destroyEach();
}
