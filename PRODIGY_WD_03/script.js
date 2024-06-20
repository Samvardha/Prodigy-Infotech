document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('.grd');
    const statusText = document.querySelector('h2');
    const restartBtn = document.getElementById('restartBtn');
    const plyrSwtchBtn = document.getElementById('plyrSwtchBtn');
    const gridContainer = document.querySelector('.secondary');

    let currentPlayer = "X";
    let gameActive = true;
    let againstComputer = false;
    let board = ["", "", "", "", "", "", "", "", ""];

    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Function to update Text in Button
    function updateButtonText() {
        plyrSwtchBtn.textContent = againstComputer ? "Player v/s Player" : "Player v/s Computer";
    }

    // Fucntion to update the Game Mode
    function updateStatusText() {
        const playerText = againstComputer ? currentPlayer === "X" ? "Player" : "Computer" : currentPlayer === "X" ? "Player 1" : "Player 2";
        statusText.textContent = `Chance: ${playerText}`;
    }

    plyrSwtchBtn.addEventListener('click', () => {
        againstComputer = !againstComputer;
        updateButtonText();
        handleRestartGame();
    });

    // Function to handle Clicks
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

        if (board[clickedCellIndex] !== "" || !gameActive || (againstComputer && currentPlayer === "O")) return;

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

        if (againstComputer && gameActive && currentPlayer === "O") {
            disableCellClicks();
            setTimeout(makeComputerMove, 1000);
        }
    }

    // Function to make a move for the Computer
    function makeComputerMove() {
        const emptyCells = board.reduce((acc, val, index) => {
            if (val === "") acc.push(index);
            return acc;
        }, []);

        // Winning move check
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            const boardCopy = [...board];
            boardCopy[index] = currentPlayer;

            if (checkWin(boardCopy, currentPlayer)) {
                handleCellPlayed(cells[index], index);
                handleResultValidation();
                enableCellClicks();
                return;
            }
        }

        // Blocking move check
        const opponent = currentPlayer === "X" ? "O" : "X";
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            const boardCopy = [...board];
            boardCopy[index] = opponent;

            if (checkWin(boardCopy, opponent)) {
                handleCellPlayed(cells[index], index);
                handleResultValidation();
                enableCellClicks(); // Enable cell clicks after computer's move
                return;
            }
        }

        // Random move if neither of the above conditions are met
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCellIndex = emptyCells[randomIndex];
        const randomCell = cells[randomCellIndex];

        handleCellPlayed(randomCell, randomCellIndex);
        handleResultValidation();
        enableCellClicks();
    }

    // Function to check the Winner
    function checkWin(board, player) {
        return winningConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    // Function to handle Input
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
    }

    // Function to handle Player Changes
    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatusText();
    }

    // Function to track Result
    function handleResultValidation() {
        let roundWon = false;
        let winningCells = null;
        let winnerText;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }

        if (roundWon) {
            if (againstComputer) {
                winnerText = currentPlayer === "X" ? "Player" : "Computer";
            } else {
                winnerText = currentPlayer === "X" ? "Player 1" : "Player 2";
            }
            statusText.textContent = `${winnerText} Wins!`;
            gameActive = false;
            highlightWinningCells(winningCells);
            gridContainer.classList.add('game-over');
            disableCellClicks();
            return;
        }

        let roundDraw = !board.includes("");
        if (roundDraw) {
            statusText.textContent = `Game ended in a draw!`;
            gameActive = false;
            gridContainer.classList.add('game-over');
            disableCellClicks();
            return;
        }

        handlePlayerChange();
    }

    // Function to highlight the Winning Cells
    function highlightWinningCells(cells) {
        cells.forEach(cellIndex => {
            const cell = document.querySelector(`.grd:nth-child(${cellIndex + 1})`);
            cell.classList.add('winning-cell');
        });
    }

    // Function to disable Clicks when required
    function disableCellClicks() {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
            cell.style.pointerEvents = 'none';
        });
    }

    // Function to enable Clicks when required
    function enableCellClicks() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
            cell.style.pointerEvents = 'auto';
        });
    }

    // Function to restart the Game
    function handleRestartGame() {
        currentPlayer = "X";
        gameActive = true;
        board = ["", "", "", "", "", "", "", "", ""];
        updateStatusText();
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('winning-cell');
        });
        gridContainer.classList.remove('game-over');
        enableCellClicks();
    }

    updateButtonText();
    updateStatusText();

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', handleRestartGame);
});