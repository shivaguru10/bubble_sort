// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const themeThumb = document.getElementById('themeThumb');
let isDarkTheme = true;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    
    if (isDarkTheme) {
        themeLabel.textContent = 'Dark';
        themeThumb.textContent = '🌙';
    } else {
        themeLabel.textContent = 'Light';
        themeThumb.textContent = '☀️';
    }
    
    // Save preference
    localStorage.setItem('bubbleMathTheme', isDarkTheme ? 'dark' : 'light');
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('bubbleMathTheme');
    if (savedTheme === 'light') {
        isDarkTheme = false;
        document.body.classList.add('light-theme');
        themeLabel.textContent = 'Light';
        themeThumb.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', toggleTheme);
loadThemePreference();

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const colors = ['#a855f7', '#6366f1', '#22c55e', '#3b82f6'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (3 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// Game State
let currentQuestion = 0;
let score = 0;
let totalQuestions = 24;
let timePerQuestion = 15;
let timerInterval = null;
let currentTime = timePerQuestion;
let selectedBubbles = [];
let currentBubbles = [];
let questionsAttempted = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let skippedAnswers = 0;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const countdownScreen = document.getElementById('countdownScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const exitBtn = document.getElementById('exitBtn');
const restartBtn = document.getElementById('restartBtn');
const countdownNumber = document.getElementById('countdownNumber');
const bubblesContainer = document.getElementById('bubblesContainer');
const timerBar = document.getElementById('timerBar');
const timerText = document.getElementById('timerText');
const currentQuestionEl = document.getElementById('currentQuestion');
const currentScoreEl = document.getElementById('currentScore');

// Math Expression Generator
function generateExpression() {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, result;

    switch (operator) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            result = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 20;
            num2 = Math.floor(Math.random() * 20) + 1;
            result = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 12) + 2;
            num2 = Math.floor(Math.random() * 12) + 2;
            result = num1 * num2;
            break;
        case '/':
            num2 = Math.floor(Math.random() * 10) + 2;
            result = Math.floor(Math.random() * 15) + 2;
            num1 = num2 * result;
            break;
    }

    return {
        expression: `${num1} ${operator} ${num2}`,
        result: result
    };
}

function generateUniqueBubbles() {
    const bubbles = [];
    const usedResults = new Set();

    while (bubbles.length < 3) {
        const bubble = generateExpression();
        if (!usedResults.has(bubble.result)) {
            usedResults.add(bubble.result);
            bubbles.push(bubble);
        }
    }

    return bubbles;
}

// Screen Management
function showScreen(screen) {
    startScreen.classList.add('hidden');
    countdownScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    
    screen.classList.remove('hidden');
    screen.style.display = 'flex';
}

// Countdown
function startCountdown() {
    showScreen(countdownScreen);
    let count = 3;
    countdownNumber.textContent = count;
    const countdownLabel = document.querySelector('.countdown-label');

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = 'none';
            setTimeout(() => {
                countdownNumber.style.animation = 'countdownPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 10);
        } else if (count === 0) {
            countdownNumber.textContent = 'Go!';
            countdownLabel.textContent = 'Starting...';
            countdownNumber.style.animation = 'none';
            setTimeout(() => {
                countdownNumber.style.animation = 'countdownPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 10);
        } else {
            clearInterval(countdownInterval);
            countdownLabel.textContent = 'Get Ready';
            startGame();
        }
    }, 1000);
}

// Game Logic
function startGame() {
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    skippedAnswers = 0;
    questionsAttempted = 0;
    showScreen(gameScreen);
    loadNextQuestion();
}

function loadNextQuestion() {
    if (currentQuestion >= totalQuestions) {
        endGame();
        return;
    }

    currentQuestion++;
    selectedBubbles = [];
    currentBubbles = generateUniqueBubbles();
    
    updateUI();
    renderBubbles();
    startTimer();
}

function updateUI() {
    currentQuestionEl.textContent = currentQuestion;
    currentScoreEl.textContent = score;
}

function renderBubbles() {
    bubblesContainer.innerHTML = '';
    
    currentBubbles.forEach((bubble, index) => {
        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'bubble';
        bubbleEl.dataset.index = index;
        bubbleEl.innerHTML = `
            <span class="bubble-content">${bubble.expression}</span>
            <span class="bubble-order"></span>
        `;
        bubbleEl.addEventListener('click', () => handleBubbleClick(index));
        bubblesContainer.appendChild(bubbleEl);
    });
}

function handleBubbleClick(index) {
    const bubbleEl = bubblesContainer.children[index];
    
    if (bubbleEl.classList.contains('disabled')) {
        return;
    }

    // If already selected, unselect it
    if (bubbleEl.classList.contains('selected')) {
        const position = selectedBubbles.indexOf(index);
        selectedBubbles.splice(position, 1);
        bubbleEl.classList.remove('selected');
        bubbleEl.querySelector('.bubble-order').textContent = '';
        
        // Update order numbers for remaining selected bubbles
        selectedBubbles.forEach((bubbleIndex, i) => {
            const bubble = bubblesContainer.children[bubbleIndex];
            bubble.querySelector('.bubble-order').textContent = i + 1;
        });
        return;
    }

    selectedBubbles.push(index);
    bubbleEl.classList.add('selected');
    bubbleEl.querySelector('.bubble-order').textContent = selectedBubbles.length;

    if (selectedBubbles.length === 3) {
        validateAnswer();
    }
}

function validateAnswer() {
    clearInterval(timerInterval);
    questionsAttempted++;

    // Get the correct order (indices sorted by result ascending)
    const correctOrder = [...currentBubbles]
        .map((bubble, index) => ({ index, result: bubble.result }))
        .sort((a, b) => a.result - b.result)
        .map(item => item.index);

    // Check if user's selection matches correct order
    const isCorrect = selectedBubbles.every((selected, i) => selected === correctOrder[i]);

    if (isCorrect) {
        score++;
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    // Brief delay before next question
    setTimeout(() => {
        loadNextQuestion();
    }, 500);
}

function startTimer() {
    currentTime = timePerQuestion;
    timerText.textContent = currentTime;
    timerBar.style.width = '100%';
    timerBar.classList.remove('warning');

    timerInterval = setInterval(() => {
        currentTime -= 0.1;
        
        const percentage = (currentTime / timePerQuestion) * 100;
        timerBar.style.width = `${percentage}%`;
        
        if (currentTime <= 5) {
            timerBar.classList.add('warning');
        }
        
        timerText.textContent = Math.ceil(currentTime);

        if (currentTime <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 100);
}

function handleTimeout() {
    questionsAttempted++;
    skippedAnswers++;
    
    // Disable all bubbles
    Array.from(bubblesContainer.children).forEach(bubble => {
        bubble.classList.add('disabled');
    });

    setTimeout(() => {
        loadNextQuestion();
    }, 500);
}

function endGame() {
    clearInterval(timerInterval);
    showScreen(resultScreen);

    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestions').textContent = questionsAttempted || totalQuestions;
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('wrongAnswers').textContent = wrongAnswers;
    document.getElementById('skippedAnswers').textContent = skippedAnswers;

    const accuracyValue = questionsAttempted > 0 
        ? Math.round((correctAnswers / questionsAttempted) * 100) 
        : 0;
    document.getElementById('accuracy').textContent = `${accuracyValue}%`;
}

function exitGame() {
    clearInterval(timerInterval);
    endGame();
}

function resetGame() {
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    skippedAnswers = 0;
    questionsAttempted = 0;
    selectedBubbles = [];
    currentBubbles = [];
    showScreen(startScreen);
}

// Event Listeners
startBtn.addEventListener('click', startCountdown);
exitBtn.addEventListener('click', exitGame);
restartBtn.addEventListener('click', resetGame);

// Initialize
showScreen(startScreen);
