var canvas;
var canvasContext;

var ballX = 50;
var ballY = 10;

var ballSpeedX = 16;
var ballSpeedY = 16;

var paddle1Y = 1;
var paddle2Y = 10;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

var player1Score = 0;
var player2Score = 0;

const WINNING_SCORE = 5;

var showingWinScreen = false;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
window.onload = function () {
  canvas = document.getElementById("playArea");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};
function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  function computerMovement() {
    var paddle2Center = paddle2Y + PADDLE_HEIGHT / 2;
    if (paddle2Center < ballY - 35) {
      paddle2Y += 6;
    } else if (paddle2Center > ballY + 35) {
      paddle2Y -= 6;
    }
  }
  computerMovement();
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    drawRect(canvas.width / 2 - 1, i, 2, 20, "#fff");
  }
}

function drawEverything() {
  // canvas updated with black background on every refresh
  drawRect(0, 0, canvas.width, canvas.height, "#000");

  if (showingWinScreen) {
    canvasContext.fillStyle = "#fff";

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You win!!!", 350, 400);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Computer wins", 350, 400);
    }

    canvasContext.fillText("Click to Continue", 320, 100);
    return;
  }

  drawNet();

  // ball
  drawCircle(ballX, ballY, 10, "#fff");
  // paddle for player
  drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  // paddle for computer
  drawRect(
    canvas.width - PADDLE_WIDTH,
    paddle2Y,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    "#fff"
  );

  //score
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function drawCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function drawRect(x, y, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(x, y, width, height);
}
