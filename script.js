var canvas = document.getElementById('bricksCanvas');
var ctx = canvas.getContext('2d');

var x = (canvas.width / 2) + Math.floor(Math.random()*41) - 20;
var y = (canvas.height - 30) + Math.floor(Math.random()*41) - 20;
var dx = 1;
var dy = -1;
var ballRadius = 10;
var gradientInnerRadius = 1;
var paddleHeight = 10;
var paddleWidth = 275;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var paused = false;
var bricks = [];

//  also it possible to change the ball and use image
// var ball = new Image();
// ball.scr = 'https://s20.postimg.org/cayyuwmal/ball.jpg';

const initBricks = () => {
	for (c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (r = 0; r < brickRowCount; r++) {
			bricks[c][r] = {
				x: 0,
				y: 0,
				status: 1
			};
		}
	}
}

initBricks();

const keyDownHandler = (e) => {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

const keyUpHandler = (e) => {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const drawBricks = () => {
	for(c = 0; c < brickColumnCount; c++) {
		for(r = 0; r < brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#ff2599 ';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const drawBall = () => {
	ctx.beginPath();
	var gradient = ctx.createRadialGradient(x, y, gradientInnerRadius, x, y, ballRadius);
	gradient.addColorStop(0, 'white');
	gradient.addColorStop(1, '#ff2599');
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = gradient;
	ctx.fill();
	ctx.closePath();

	// use Image instead of color
		// ctx.drawImage(ball, x, y, ballRadius, ballRadius);
}

const drawPaddle = () => {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#ff2599';
	ctx.fill();
	ctx.closePath();
}

const collisionDetection = () => {
	for(c = 0; c < brickColumnCount; c++){
		for(r = 0; r < brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status == 1) {
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount) {
						if(level === maxLevel) {
							alert('YOU WIN, CONGRADULATIONS!');
							document.location.reload();
						} else {
							level++;
							brickRowCount++;
							initBricks();
							score = 0;
							paddleWidth -= 50 ;
							dx += 1;
							dy = -dy;
							dy -= 1;
							x = (canvas.width / 2) + Math.floor(Math.random()*41) - 20;
							y = (canvas.height - 30) + Math.floor(Math.random()*41) - 20;
							paddleX = (canvas.width - paddleWidth) / 2;
							paused = true;
							ctx.beginPath();
							ctx.rect(0, 0, canvas.width, canvas.height);
							ctx.fillStyle = '#ff2599';
							ctx.fill();
							ctx.font = '16px Arial';
							ctx.fillStyle = '#ffffff';
							ctx.fillText(`Level: ${level - 1} completed, starting next level...`, 110, 150 );
							ctx.closePath();
							setTimeout(() => {
								paused = false;
								draw();
							}, 3000)
						}
					}
				}
			}
		}
	}
}

const drawScore = () => {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#ff2599';
	ctx.fillText('Score: '+score, 8, 20);
}

const drawLives = () => {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#ff2599';
	ctx.fillText('Lives: '+lives, canvas.width-65, 20);
}

const drawLevel = () => {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#ff2599';
	ctx.fillText('Level: '+level, 210, 20);
}

const draw = () => {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawBricks()
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	drawLevel();
	collisionDetection();

	if(y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height-ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if(!lives) {
				alert('GAME OVER!');
				document.location.reload();
			} else {
				x = (canvas.width / 2) + Math.floor(Math.random()*41) - 20;
				y = (canvas.height - 30) + Math.floor(Math.random()*41) - 20;
				paddleX = (canvas.width-paddleWidth) / 2;
			}
		}
	}
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 10;
	}
	else if(leftPressed && paddleX > 0) {
		paddleX -= 10;
	}

	x += dx;
	y += dy;
	if(!paused) {
		requestAnimationFrame(draw);
	}
}

// also we can add mouse handler to move paddle by moving mouse
// document.addEventListener('mousemove', mouseMoveHandler);

// const mouseMoveHandler = (e) => {
// 	var relativeX = e.clientX - canvas.offsetLeft;
// 	if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
// 		paddleX = relativeX - paddleWidth/2;
// 	}
// }

draw();