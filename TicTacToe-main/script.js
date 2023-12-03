// ---------------------------------- VARIABLES AND ELEMENT REFERENCES
const statusDisplay = document.getElementById('status');
const countField = document.getElementById('numberTurns');
const startBox = document.getElementById('startBox');
const playField = document.getElementById('field');
const player1_name = document.getElementById('player1_name');
const player2_name = document.getElementById('player2_name');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// Game state variables
let gameActive = true;
let currentPlayer = 'X';
let gameState = [];
let cols, rows, steps, counter = 0;
let timer = 1;
let timerInterval;
let timeLeft = 30;
let stopperInterval;

// Messages
const winnMessage = (player) => `${player} has won!`;
const nobodyWinsMessage = () => `It's a draw!`;

// ----------------------------------  START GAME
// Function to validate input values and set them within a range
let checkInput = (input) => {
    input = +input;
    input = (input < 3)
        ? 3
        : (input > 10)
            ? 10
            : input;
    return input;
};

// Function to create an empty game matrix
let createMatrix = () => {
    let arr;
    for (let i = 0; i < rows; i++) {
        arr = [];
        for (let j = 0; j < cols; j++) {
            arr[j] = 0;
        }
        gameState[i] = arr;
    }
    console.log(gameState);
};

// Function to draw the game field dynamically
let drawField = () => {
    let cellSize = window.innerHeight * 0.5 / cols;
    let box = document.createElement('div');
    box.setAttribute('id', 'container');

    let cell, row;
    for (let i = 0; i < rows; i++) {
        row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < cols; j++) {
            cell = document.createElement('div');
            cell.setAttribute('id', `${i}_${j}`);
            cell.className = 'cell';
            cell.style.width =
                cell.style.height =
                cell.style.lineHeight = `${cellSize}px`;
            cell.style.fontSize = `${cellSize / 16}em`;
            row.appendChild(cell);
        }
        box.appendChild(row);
    }
    playField.appendChild(box);
};

// Function to handle the start of the game
let handleStart = () => {
    // Set player names and game parameters
    player1.innerHTML = player1_name.value === '' ? 'Player \'X\'' : player1_name.value;
    player2.innerHTML = player2_name.value === '' ? 'Player \'O\'' : player2_name.value;
    cols = checkInput(document.getElementById('columns').value);
    rows = checkInput(document.getElementById('rows').value);
    steps = checkInput(document.getElementById('steps').value);
    createMatrix();
    drawField();
    startBox.className = 'hidden';
    handlePlayerSwitch();
    // Add click event listeners to all cells
    document.querySelectorAll('.cell')
        .forEach(cell => cell.addEventListener('click', handleClick));
    // Reset and start the timer
    timer = 0;
    timeLeft = 30;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer += 1;
        timeLeft -= 1;
        document.getElementById("timer").innerHTML = `Timer : \n ${timer} sec`;
        document.getElementById("stopper").innerHTML = `Time Left : \n ${timeLeft} sec`;

        // End the game if the timer runs out
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            statusDisplay.innerHTML = winnMessage(currentPlayer === 'X' ? 'O' : 'X');
            statusDisplay.style.color = '#black';
            document.getElementById("stopper").innerHTML = "Time Left : \n 0 sec";
        }
    }, 1000);
};

// ---------------------------------- WINNER ALGORITHM
// Function to check if a player has won
let isWinning = (y, x) => {
    let winner = currentPlayer === 'X' ? 1 : 2,
        length = steps * 2 - 1,
        radius = steps - 1,
        countWinnMoves, winnCoordinates;

    // Horizontal
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y, j = x - radius, k = 0; k < length; k++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // Vertical
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x, k = 0; k < length; k++, i++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // Oblique to the right
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x - radius, k = 0; k < length; k++, i++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }

    // Oblique to the left
    countWinnMoves = 0;
    winnCoordinates = [];
    for (let i = y - radius, j = x + radius, k = 0; k < length; k++, i++, j--) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j];
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates);
                return;
            }
        } else {
            countWinnMoves = 0;
            winnCoordinates = [];
        }
    }
};

// ----------------------------------  GAME ONGOING
// Function to switch players and update styles
let handlePlayerSwitch = () => {
    if (currentPlayer === 'X') {
        player1.style.background = '#8458B3';
        player2.style.background = '#d0bdf4';
    } else {
        player1.style.background = '#d0bdf4';
        player2.style.background = '#8458B3';
    }
};

// Function to check if any moves are left
let isMovesLeft = () => {
    if (counter === cols * rows) {
        statusDisplay.innerHTML = nobodyWinsMessage();
        clearInterval(timerInterval);
        gameActive = false;
    }
};

// Function to handle cell click
let handleClick = (event) => {
    timeLeft = 30;

    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0];
    let j = +clickedIndex[1];

    // Check if the cell is already filled or the game is not active
    if (gameState[i][j] !== 0 || !gameActive)
        return;

    // Update game state and UI
    gameState[i][j] = (currentPlayer === 'X') ? 1 : 2;
    event.target.innerHTML = currentPlayer;
    countField.innerHTML = `${++counter}`;

    // Check for a winner or a draw
    isMovesLeft();
    isWinning(i, j);

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    handlePlayerSwitch();
};

// ----------------------------------  SHOW WINNING RESULTS
// Function to highlight winning cells and end the game
function winnActions(winner) {
    console.log(winner);

    clearInterval(timerInterval);
    gameActive = false;
    statusDisplay.innerHTML = winnMessage(currentPlayer);
    statusDisplay.style.color = '#black';

    // Highlight winning cells
    let cell;
    for (let i = 0; i < winner.length; i++) {
        cell = document.getElementById(`${winner[i][0]}_${winner[i][1]}`);
        cell.style.color = '#black';
    }
}

// ----------------------------------  RESET GAME
// Function to handle "Play Again" button click
let handlePlayAgain = () => {
    // Reset game state and UI
    gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    statusDisplay.style.color = 'black';
    player1.style.background = player2.style.background = '#d0bdf4';
    playField.removeChild(document.getElementById('container'));
    handleStart();
};

// Function to handle "Restart" button click
let handleRestart = () => {
    // Reset game state, UI, and input values
    gameActive = true;
    currentPlayer = 'X';
    counter = 0;
    countField.innerHTML = '0';
    statusDisplay.innerHTML = '';
    statusDisplay.style.color = 'black';
    player1.style.background = player2.style.background = '#d0bdf4';
    player1_name.value = player2_name.value = '';
    player1.innerHTML = player2.innerHTML = '-';
    startBox.className = 'sidebar';
    playField.removeChild(document.getElementById('container'));
    clearInterval(timerInterval);
    document.getElementById("stopper").innerHTML = "";
    document.getElementById("timer").innerHTML = "";
};

// Event listeners
document.querySelector('#start').addEventListener('click', handleStart);
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain);
document.querySelector('#restart').addEventListener('click', handleRestart);
