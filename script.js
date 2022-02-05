/*
Universidade Federal do Ceará
Sistemas e Mídias Digitais
Autoração e Multimídia 2
Av - 2
Amanda Maria Lima Rodrigues 0433703
Egberto Alves Nogueira Junior 497193
Eric Façanha do Nascimento 493957
João VIctor Martins Barbosa 504290
Victor Lima Marques 504290
*/

var player;
var jogando = false;
var obstaculos = [];
var pontuacao = 0;
var showPontuacao;
var fase = 1;
var showFase;
const MAX_Y = 330;
const MIN_Y = 60;
const corfase = ['purple', 'grey', 'snow']
var vida = 0;
var showVida;
//cima, baixo, direita, esquerda;
var listaAcoes = [false, false, false, false];

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//função prioritária do jogo
function initGame(fase = 1) {
  player = new jogador(30, 300, 30);
  this.fase = fase;
  obstaculos = [];
  jogando = true;
  pontuacao = 0;
  showPontuacao = new textFunc(470, 20, "20px", 'right');
  showVida = new textFunc(270, 80, "20px", 'right');
  showFase = new textFunc(10, 20, "20px", 'left');
  area.start();
}

//Função de movimentação de player
function keyDownAction(e) {
  if (jogando) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        listaAcoes[0] = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        listaAcoes[1] = true;
        break;

    }
  }
}
document.addEventListener('keydown', keyDownAction);

function keyUpAction(e) {
  if (jogando) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        listaAcoes[0] = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        listaAcoes[1] = false;
        break;

    }
  }
}
document.addEventListener('keyup', keyUpAction);


function movimentarPlayer() {
  if (listaAcoes[0]) {
    player.cima();
  }
  if (listaAcoes[1]) {
    player.baixo();
  }
}



//Carrega a área do jogo
var area = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.className = "fase" + fase;
    this.canvas.width = 480;
    this.canvas.height = 360;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(refreshJogo, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

//Função de jogador
function jogador(x, y, size) {
  this.x = x;
  this.y = y;
  this.width = size;
  this.height = size;
  this.cima = function () {
    var limitHeight = MIN_Y;
    this.y = (this.y - 5 > limitHeight) ? this.y - 5 : limitHeight;
  }
  this.baixo = function () {
    //var limitHeight = area.canvas.height - player.height + (-30);
    var limitHeight = MAX_Y;
    this.y = (this.y + 5 < limitHeight) ? this.y + 5 : limitHeight;
  }
  this.refresh = function () {
    ctx = area.context;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.colisionTest = function (objeto) {
    var posicao_x = this.x;
    var posicao_x_completo = this.x + (this.width);
    var posicao_y = this.y;
    var posicao_y_completo = this.y + (this.height);
    var posicao_x_objeto = objeto.x;
    var posicao_x_completo_objeto = objeto.x + (objeto.width);
    var posicao_y_objeto = objeto.y;
    var posicao_y_completo_objeto = objeto.y + (objeto.height);
    var bateu = true;
    if ((posicao_y_completo < posicao_y_objeto) || (posicao_y > posicao_y_completo_objeto) || (posicao_x_completo < posicao_x_objeto) || (posicao_x > posicao_x_completo_objeto)) {
      bateu = false;
    }
    return bateu;
  }
  
    this.passouObstaculo = function(objeto){
        var objectleft = objeto.x;
        var objectright = objeto.x + (objeto.width);
        var objecttop = objeto.y;
        var objectbottom = objeto.y + (objeto.height);
        if(this.x > objectright && !objeto.obstaculoPassado){
          return true;
        }
        return false;
    }
}

//Função de texto na tela
function textFunc(x, y, size, align = 'left') {
  this.size = size;
  this.color = 'black';
  this.x = x;
  this.y = y;
  this.refresh = function () {
    ctx.textAlign = align;
    ctx.font = this.size + " " + this.height;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }
}

//Obstáculos
function obstaculo(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.obstaculoPassado = false;
  this.refresh = function () {
    ctx = area.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

//Tela de derrota
function showDerrota() {
  area.clear();
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Você perdeu!", area.canvas.width / 2, 100);
  ctx.font = "20px Arial";
  ctx.fillText("Clique para recomeçar", area.canvas.width / 2, 300)
}

//Tela de vitória
function showVitoria() {
  area.clear();
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Você Venceu!", area.canvas.width / 2, 100); ctx.fillText("Você Venceu!", area.canvas.width / 2, 00);
  ctx.font = "20px Arial";
  ctx.fillText("Clique para jogar novamente", area.canvas.width / 2, 300)
}

//Clique para reiniciar jogo
document.onmousedown = function (e) {
  if (!jogando) {
    repetir();
  }
};

//Reiniciar jogo
function repetir() {
  clearInterval(area.interval);
  initGame();
}

//Passar pra próxima fase
function proximaFase() {
  clearInterval(area.interval);
  initGame(fase + 1);
}

//função de refresh de tela
function refreshJogo() {
  movimentarPlayer();
  var x, y;

  for (i = 0; i < obstaculos.length; i += 1) {        
    if (player.colisionTest(obstaculos[i])) {
      if(pontuacao != 0){
        obstaculos[i].x = -10000;
        obstaculos[i].obstaculoPassado = true;
        pontuacao--;
      }else{
        jogando = false;
        showDerrota();
        return;
      }
    } 
    else if (player.passouObstaculo(obstaculos[i])) {
      obstaculos[i].obstaculoPassado = true;
      pontuacao++;
    }
  }
  if (pontuacao == 10){//} || pontuacao == 20 || pontuacao == 30){
    vida = vida+1;
  }

  area.clear();
  area.frameNo += 1;

  if (pontuacao  > 10) {
    if (fase == 3) {
      jogando = false;
      showVitoria();
    } else {
      proximaFase();
    }
    return;
  }
  //frequencia de obstaculo
  if (area.frameNo == 1 || frameCounter(Math.floor(Math.random() * (70 - 60) + 60) / fase)) {
    x = area.canvas.width;
    height = 35;
    //y = 295;
    y = random(MIN_Y, MAX_Y);
    obstaculos.push(new obstaculo(height, height, "blue", x, y));

  }
  for (i = 0; i < obstaculos.length; i += 1) {
    obstaculos[i].x += -3 * (1 + fase / 2);
    obstaculos[i].refresh();
  }
  player.refresh();
  //pontuacao += frameCounter(60) ? 1 : 0;
  showPontuacao.text = "SCORE:" + pontuacao
  showPontuacao.refresh();
  showFase.text = "Fase: " + fase;
  showFase.refresh();
  showVida.text = "VIDA:" + vida
  showPontuacao.refresh();
}
function frameCounter(n) {
  if ((area.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}