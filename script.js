const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameRunning = true;

// Winning combinations
const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Human move
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

        if(board[index] !== "" || !gameRunning) return;

        makeMove(index, human);

        if(checkWinner(board, human)) {
            statusText.textContent = "You Win!";
            gameRunning = false;
            return;
        }

        if(isDraw()) {
            statusText.textContent = "Draw!";
            gameRunning = false;
            return;
        }

        statusText.textContent = "AI Thinking...";

        setTimeout(() => {
            aiMove();

            if(checkWinner(board, ai)) {
                statusText.textContent = "AI Wins!";
                gameRunning = false;
                return;
            }

            if(isDraw()) {
                statusText.textContent = "Draw!";
                gameRunning = false;
                return;
            }

            statusText.textContent = "Your Turn (X)";
        }, 500);
    });
});

// Make move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

// AI Move using Minimax
function aiMove() {
    let bestScore = -Infinity;
    let move;

    for(let i = 0; i < board.length; i++) {
        if(board[i] === "") {
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = "";

            if(score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, ai);
}

// Minimax Algorithm
function minimax(newBoard, depth, isMaximizing) {

    if(checkWinner(newBoard, ai)) return 10 - depth;
    if(checkWinner(newBoard, human)) return depth - 10;
    if(newBoard.every(cell => cell !== "")) return 0;

    if(isMaximizing) {
        let bestScore = -Infinity;

        for(let i = 0; i < newBoard.length; i++) {
            if(newBoard[i] === "") {
                newBoard[i] = ai;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for(let i = 0; i < newBoard.length; i++) {
            if(newBoard[i] === "") {
                newBoard[i] = human;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

// Check Winner
function checkWinner(currentBoard, player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return currentBoard[index] === player;
        });
    });
}

// Check Draw
function isDraw() {
    return board.every(cell => cell !== "");
}

// Restart Game
restartBtn.addEventListener("click", restartGame);

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameRunning = true;

    cells.forEach(cell => {
        cell.textContent = "";
    });

    statusText.textContent = "Your Turn (X)";
}