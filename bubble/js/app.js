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
let timePerQuestion = 30;
let timerInterval = null;
let currentTime = timePerQuestion;
let selectedBubbles = [];
let currentBubbles = [];
let questionsAttempted = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let skippedAnswers = 0;
let selectedDifficulty = null;
let realTestQuestionPool = [];
let currentQuestionDifficulty = null;

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
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const difficultyDisplay = document.getElementById('difficultyDisplay');
const difficultyIndicator = document.querySelector('.difficulty-indicator');

// Difficulty Selection
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selected class from all buttons
        difficultyBtns.forEach(b => b.classList.remove('selected'));
        // Add selected class to clicked button
        btn.classList.add('selected');
        // Store selected difficulty
        selectedDifficulty = btn.dataset.difficulty;
        // Enable start button
        startBtn.disabled = false;
    });
});

// ============================================
// EASY MODE: Whole numbers only
// ============================================
function generateEasyExpression() {
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

// ============================================
// MEDIUM MODE: Fractions
// ============================================
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function simplifyFraction(num, den) {
    if (den === 0) return { num: 0, den: 1 };
    const divisor = gcd(num, den);
    return { num: num / divisor, den: den / divisor };
}

function formatFraction(num, den) {
    const simplified = simplifyFraction(num, den);
    if (simplified.den === 1) {
        return `${simplified.num}`;
    }
    return `(${simplified.num}/${simplified.den})`;
}

function generateMediumExpression() {
    const types = ['fraction+fraction', 'fraction+whole', 'whole/whole', 'fraction*whole'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let expression, result;
    
    switch (type) {
        case 'fraction+fraction': {
            // (a/b) + (c/d) or (a/b) - (c/d)
            const ops = ['+', '-'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const num1 = Math.floor(Math.random() * 8) + 1;
            const den1 = Math.floor(Math.random() * 6) + 2;
            const num2 = Math.floor(Math.random() * 8) + 1;
            const den2 = Math.floor(Math.random() * 6) + 2;
            
            const frac1 = num1 / den1;
            const frac2 = num2 / den2;
            
            if (op === '+') {
                result = frac1 + frac2;
            } else {
                result = frac1 - frac2;
            }
            
            expression = `${formatFraction(num1, den1)} ${op} ${formatFraction(num2, den2)}`;
            break;
        }
        case 'fraction+whole': {
            // (a/b) + c or (a/b) - c
            const ops = ['+', '-'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const num1 = Math.floor(Math.random() * 8) + 1;
            const den1 = Math.floor(Math.random() * 6) + 2;
            const whole = Math.floor(Math.random() * 10) + 1;
            
            const frac1 = num1 / den1;
            
            if (op === '+') {
                result = frac1 + whole;
            } else {
                result = frac1 - whole;
            }
            
            expression = `${formatFraction(num1, den1)} ${op} ${whole}`;
            break;
        }
        case 'whole/whole': {
            // a / b where result is not whole
            const num1 = Math.floor(Math.random() * 20) + 5;
            let den1 = Math.floor(Math.random() * 8) + 2;
            // Ensure it's not a whole number result
            while (num1 % den1 === 0) {
                den1 = Math.floor(Math.random() * 8) + 2;
            }
            result = num1 / den1;
            expression = `${num1} / ${den1}`;
            break;
        }
        case 'fraction*whole': {
            // (a/b) * c
            const num1 = Math.floor(Math.random() * 6) + 1;
            const den1 = Math.floor(Math.random() * 6) + 2;
            const whole = Math.floor(Math.random() * 10) + 2;
            
            result = (num1 / den1) * whole;
            expression = `${formatFraction(num1, den1)} × ${whole}`;
            break;
        }
    }
    
    // Round result to avoid floating point issues in comparison
    result = Math.round(result * 10000) / 10000;
    
    return {
        expression: expression,
        result: result
    };
}

// ============================================
// HARD MODE: Square roots
// ============================================
function generateHardExpression() {
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
    const types = ['sqrt_only', 'sqrt+num', 'sqrt-num', 'sqrt/num', 'sqrt*num'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let expression, result;
    const sqNum = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
    const sqrtValue = Math.sqrt(sqNum);
    
    switch (type) {
        case 'sqrt_only': {
            result = sqrtValue;
            expression = `√${sqNum}`;
            break;
        }
        case 'sqrt+num': {
            const addNum = Math.floor(Math.random() * 10) + 1;
            result = sqrtValue + addNum;
            expression = `√${sqNum} + ${addNum}`;
            break;
        }
        case 'sqrt-num': {
            const subNum = Math.floor(Math.random() * Math.floor(sqrtValue)) + 1;
            result = sqrtValue - subNum;
            expression = `√${sqNum} - ${subNum}`;
            break;
        }
        case 'sqrt/num': {
            const divNum = Math.floor(Math.random() * 4) + 2;
            result = sqrtValue / divNum;
            expression = `√${sqNum} / ${divNum}`;
            break;
        }
        case 'sqrt*num': {
            const mulNum = Math.floor(Math.random() * 5) + 2;
            result = sqrtValue * mulNum;
            expression = `√${sqNum} × ${mulNum}`;
            break;
        }
    }
    
    // Round result to avoid floating point issues
    result = Math.round(result * 10000) / 10000;
    
    return {
        expression: expression,
        result: result
    };
}

// ============================================
// Expression Generator based on difficulty
// ============================================
function generateExpression(difficulty = selectedDifficulty) {
    switch (difficulty) {
        case 'easy':
            return generateEasyExpression();
        case 'medium':
            return generateMediumExpression();
        case 'hard':
            return generateHardExpression();
        default:
            return generateEasyExpression();
    }
}

// ============================================
// Real Test Question Pool Generator
// ============================================
function generateRealTestPool() {
    const pool = [];
    const difficulties = ['easy', 'medium', 'hard'];
    
    // Generate 8 questions for each difficulty in order
    // First 8 Easy, then 8 Medium, then 8 Hard
    difficulties.forEach(difficulty => {
        for (let i = 0; i < 8; i++) {
            pool.push({
                difficulty: difficulty,
                index: pool.length
            });
        }
    });
    
    return pool;
}

function generateUniqueBubbles(difficulty = selectedDifficulty) {
    const bubbles = [];
    const usedResults = new Set();
    const tolerance = 0.001; // For floating point comparison
    
    const isResultUsed = (result) => {
        for (let used of usedResults) {
            if (Math.abs(used - result) < tolerance) {
                return true;
            }
        }
        return false;
    };

    let attempts = 0;
    const maxAttempts = 100;
    
    while (bubbles.length < 3 && attempts < maxAttempts) {
        attempts++;
        const bubble = generateExpression(difficulty);
        if (!isResultUsed(bubble.result)) {
            usedResults.add(bubble.result);
            bubbles.push(bubble);
        }
    }
    
    // Fallback if we couldn't generate unique bubbles
    while (bubbles.length < 3) {
        const bubble = generateExpression(difficulty);
        bubbles.push(bubble);
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
    currentQuestionDifficulty = null;
    
    // Initialize Real Test pool if needed
    if (selectedDifficulty === 'realtest') {
        realTestQuestionPool = generateRealTestPool();
    } else {
        realTestQuestionPool = [];
    }
    
    // Update difficulty display
    const displayName = selectedDifficulty === 'realtest' ? 'Real Test' : 
        selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    difficultyDisplay.textContent = displayName;
    difficultyIndicator.className = 'stat-item difficulty-indicator ' + selectedDifficulty;
    
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
    
    // Handle Real Test mode - get difficulty from pool
    if (selectedDifficulty === 'realtest') {
        const questionInfo = realTestQuestionPool[currentQuestion - 1];
        currentQuestionDifficulty = questionInfo.difficulty;
        currentBubbles = generateUniqueBubbles(currentQuestionDifficulty);
    } else {
        currentQuestionDifficulty = selectedDifficulty;
        currentBubbles = generateUniqueBubbles();
    }
    
    updateUI();
    updateQuestionDifficultyBadge();
    renderBubbles();
    startTimer();
}

// Update the question difficulty badge
function updateQuestionDifficultyBadge() {
    const badge = document.getElementById('questionDifficultyBadge');
    
    if (selectedDifficulty === 'realtest' && currentQuestionDifficulty) {
        const difficultyLabel = currentQuestionDifficulty.charAt(0).toUpperCase() + currentQuestionDifficulty.slice(1);
        badge.innerHTML = `<span class="badge ${currentQuestionDifficulty}">${difficultyLabel}</span>`;
        badge.classList.add('visible');
    } else {
        badge.innerHTML = '';
        badge.classList.remove('visible');
    }
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

    // Display the difficulty played
    const difficultyNames = {
        'easy': 'Easy',
        'medium': 'Medium',
        'hard': 'Hard',
        'realtest': 'Real Test'
    };
    const resultDifficultyEl = document.getElementById('resultDifficulty');
    const resultDifficultyBadge = document.getElementById('resultDifficultyBadge');
    if (resultDifficultyEl && selectedDifficulty) {
        resultDifficultyEl.textContent = difficultyNames[selectedDifficulty] || selectedDifficulty;
        resultDifficultyBadge.className = `result-difficulty-badge difficulty-${selectedDifficulty}`;
    }
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
    realTestQuestionPool = [];
    currentQuestionDifficulty = null;
    
    // Reset difficulty selection
    selectedDifficulty = null;
    difficultyBtns.forEach(b => b.classList.remove('selected'));
    startBtn.disabled = true;
    
    // Hide question difficulty badge
    const badge = document.getElementById('questionDifficultyBadge');
    if (badge) {
        badge.classList.remove('visible');
        badge.innerHTML = '';
    }
    
    showScreen(startScreen);
}

// Event Listeners
startBtn.addEventListener('click', startCountdown);
exitBtn.addEventListener('click', exitGame);
restartBtn.addEventListener('click', resetGame);

// Initialize
showScreen(startScreen);
