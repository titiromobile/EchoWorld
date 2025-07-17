class EchoWorldGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 1;
        
        // Player
        this.player = {
            x: 50,
            y: 300,
            width: 30,
            height: 30,
            speed: 5,
            color: '#00ff88'
        };
        
        // Game objects
        this.echoes = [];
        this.obstacles = [];
        this.enemies = [];
        this.portal = null;
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Animation
        this.lastTime = 0;
        this.animationId = null;
        
        this.initializeLevel();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startBtn').textContent = 'Restart';
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 1;
        this.player.x = 50;
        this.player.y = 300;
        this.gameState = 'menu';
        this.initializeLevel();
        this.updateUI();
        document.getElementById('startBtn').textContent = 'Start Game';
    }
    
    initializeLevel() {
        this.echoes = [];
        this.obstacles = [];
        this.enemies = [];
        this.particles = [];
        
        // Generate echoes
        for (let i = 0; i < 5 + this.level; i++) {
            this.echoes.push({
                x: Math.random() * (this.canvas.width - 200) + 200,
                y: Math.random() * (this.canvas.height - 40) + 20,
                width: 20,
                height: 20,
                collected: false,
                pulse: 0
            });
        }
        
        // Generate obstacles
        for (let i = 0; i < 3 + Math.floor(this.level / 2); i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 300) + 200,
                y: Math.random() * (this.canvas.height - 50) + 25,
                width: 40,
                height: 40,
                color: '#ff4444'
            });
        }
        
        // Generate enemies
        for (let i = 0; i < Math.floor(this.level / 2); i++) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 300) + 200,
                y: Math.random() * (this.canvas.height - 30) + 15,
                width: 25,
                height: 25,
                speedX: (Math.random() - 0.5) * 4,
                speedY: (Math.random() - 0.5) * 4,
                color: '#ff6666'
            });
        }
        
        // Create portal
        this.portal = {
            x: this.canvas.width - 60,
            y: this.canvas.height / 2 - 25,
            width: 50,
            height: 50,
            rotation: 0,
            active: false
        };
    }
    
    handleInput() {
        if (this.gameState !== 'playing') return;
        
        const speed = this.player.speed;
        
        // Movement controls (WASD or Arrow keys)
        if (this.keys['arrowup'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - speed);
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + speed);
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - speed);
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + speed);
        }
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.handleInput();
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.x += enemy.speedX * this.gameSpeed;
            enemy.y += enemy.speedY * this.gameSpeed;
            
            // Bounce off walls
            if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                enemy.speedX *= -1;
            }
            if (enemy.y <= 0 || enemy.y >= this.canvas.height - enemy.height) {
                enemy.speedY *= -1;
            }
        });
        
        // Update echo pulse animation
        this.echoes.forEach(echo => {
            echo.pulse += deltaTime * 0.005;
        });
        
        // Update portal rotation
        this.portal.rotation += deltaTime * 0.003;
        
        // Check if all echoes are collected
        const remainingEchoes = this.echoes.filter(echo => !echo.collected);
        this.portal.active = remainingEchoes.length === 0;
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            return particle.life > 0;
        });
        
        this.checkCollisions();
    }
    
    checkCollisions() {
        // Check echo collection
        this.echoes.forEach(echo => {
            if (!echo.collected && this.isColliding(this.player, echo)) {
                echo.collected = true;
                this.score += 100;
                this.createParticles(echo.x + echo.width/2, echo.y + echo.height/2, '#ffff00');
                this.updateUI();
            }
        });
        
        // Check obstacle collision
        this.obstacles.forEach(obstacle => {
            if (this.isColliding(this.player, obstacle)) {
                this.playerHit();
            }
        });
        
        // Check enemy collision
        this.enemies.forEach(enemy => {
            if (this.isColliding(this.player, enemy)) {
                this.playerHit();
            }
        });
        
        // Check portal collision
        if (this.portal.active && this.isColliding(this.player, this.portal)) {
            this.nextLevel();
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    playerHit() {
        this.lives--;
        this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#ff0000');
        
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
        } else {
            // Reset player position
            this.player.x = 50;
            this.player.y = 300;
        }
        this.updateUI();
    }
    
    nextLevel() {
        this.level++;
        this.gameSpeed += 0.2;
        this.score += this.level * 500;
        this.player.x = 50;
        this.player.y = 300;
        this.initializeLevel();
        this.updateUI();
        this.createParticles(this.canvas.width/2, this.canvas.height/2, '#00ff00');
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 500,
                color: color
            });
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid background
        this.drawGrid();
        
        if (this.gameState === 'menu') {
            this.drawMenu();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOver();
        } else {
            this.drawGameObjects();
            
            if (this.gameState === 'paused') {
                this.drawPauseOverlay();
            }
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawGameObjects() {
        // Draw echoes
        this.echoes.forEach(echo => {
            if (!echo.collected) {
                const pulse = Math.sin(echo.pulse) * 0.3 + 1;
                this.ctx.save();
                this.ctx.translate(echo.x + echo.width/2, echo.y + echo.height/2);
                this.ctx.scale(pulse, pulse);
                this.ctx.fillStyle = '#ffff00';
                this.ctx.shadowColor = '#ffff00';
                this.ctx.shadowBlur = 10;
                this.ctx.fillRect(-echo.width/2, -echo.height/2, echo.width, echo.height);
                this.ctx.restore();
                
                // Draw star shape
                this.drawStar(echo.x + echo.width/2, echo.y + echo.height/2, 8, '#ffff00');
            }
        });
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.shadowColor = obstacle.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.shadowColor = enemy.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw portal
        if (this.portal.active) {
            this.ctx.save();
            this.ctx.translate(this.portal.x + this.portal.width/2, this.portal.y + this.portal.height/2);
            this.ctx.rotate(this.portal.rotation);
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 15;
            
            for (let i = 0; i < 6; i++) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 15 + i * 3, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 500;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawStar(x, y, radius, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * 144 - 90) * Math.PI / 180;
            const x1 = Math.cos(angle) * radius;
            const y1 = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawMenu() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('EchoWorld', this.canvas.width/2, this.canvas.height/2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press Start Game to begin!', this.canvas.width/2, this.canvas.height/2 + 50);
    }
    
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2 - 50);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 20);
        this.ctx.fillText('Press Reset to play again', this.canvas.width/2, this.canvas.height/2 + 60);
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EchoWorldGame();
});