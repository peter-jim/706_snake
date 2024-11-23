const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('scoreValue');

// 设置画布大小
canvas.width = 400;
canvas.height = 400;

// 游戏参数
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// 蛇的初始位置和速度
let snake = [
    { x: 5, y: 5 }
];
let velocityX = 0;
let velocityY = 0;

// 食物位置
let foodX;
let foodY;

// 游戏状态
let gameRunning = false;

// 生成随机食物位置
function generateFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
}

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(function() {
        requestAnimationFrame(gameLoop);
    }, 1000/10); // 控制游戏速度

    // 移动蛇
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === foodX && head.y === foodY) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    // 检查游戏结束条件
    if (gameOver()) {
        gameRunning = false;
        alert('游戏结束！得分：' + score);
        resetGame();
        return;
    }

    // 绘制游戏画面
    draw();
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = 'rgba(10, 46, 56, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = 'rgba(10, 175, 230, 0.2)';
    for(let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // 绘制蛇
    snake.forEach((segment, index) => {
        // 蛇头
        if (index === 0) {
            ctx.fillStyle = '#0aafe6';
            ctx.shadowColor = '#0aafe6';
            ctx.shadowBlur = 20;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        } 
        // 蛇身
        else {
            ctx.shadowBlur = 0;
            const gradient = ctx.createLinearGradient(
                segment.x * gridSize, 
                segment.y * gridSize, 
                (segment.x + 1) * gridSize, 
                (segment.y + 1) * gridSize
            );
            gradient.addColorStop(0, '#0aafe6');
            gradient.addColorStop(1, '#0a2e38');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });

    // 绘制食物
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        foodX * gridSize + gridSize/2, 
        foodY * gridSize + gridSize/2, 
        gridSize/2 - 2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

// 检查游戏结束条件
function gameOver() {
    const head = snake[0];
    
    // 撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // 撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// 重置游戏
function resetGame() {
    snake = [{ x: 5, y: 5 }];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    startButton.textContent = '开始游戏';
    gameRunning = false;
}

// 开始游戏
startButton.addEventListener('click', function() {
    if (!gameRunning) {
        gameRunning = true;
        generateFood();
        startButton.textContent = '重新开始';
        gameLoop();
    } else {
        resetGame();
    }
});

// 键盘控制
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
});

// 初始化游戏
resetGame(); 