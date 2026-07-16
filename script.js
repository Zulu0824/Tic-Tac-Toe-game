const playerInfo = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getMark, getName}   
}

const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const gameBoard = (() => {
    const board = Array(9).fill("");
    const getBoard = () => board;

    const placeMark = (index, mark) => {
        if(board[index] !== "") return false;
        board[index] = mark;
        return true;
    };

    const checkWin = (mark) => {
        for (let i = 0; i < winCondition.length; i++) {
            const condition = winCondition[i];

            if(board[condition[0]] === mark && board[condition[1]] === mark && board[condition[2]] === mark) {
                return true;
            }
        } return false;
    };

    const checkTie = () => {
        for (let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                return false;
            }
        }
        return true;
    };

    const reset = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };
    
    return {reset, checkTie, getBoard, placeMark, checkWin}
})();

const gridBox = document.getElementById("grid-container");
const statusText = document.getElementById("status-text");

const renderBoard = () => {
    gridBox.textContent = "";
    gameBoard.getBoard().forEach((cellValue, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("grid-item");
        cellDiv.dataset.cellIndex = index;
        cellDiv.dataset.mark = cellValue;
        cellDiv.textContent = cellValue;
        gridBox.appendChild(cellDiv);
    });
};

const game = (() => {
    let player1 = playerInfo("Player One", "X");
    let player2 = playerInfo("Player Two", "O");
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    const setPlayers = (name1, name2) => {
        player1 = playerInfo(name1 || "Player One", "X");
        player2 = playerInfo(name2 || "Player Two", "O");
        currentPlayer = player1;
    };

    const updateStatusText = () => {
        statusText.textContent = `It's ${currentPlayer.getName()}'s (${currentPlayer.getMark()}) Turn`;
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        updateStatusText();
    };

    let gameOver = false;
    const isGameOver = () => gameOver;
    const endGame = () => {
        gameOver = true;
    };

    const resetGame = () => {
        gameBoard.reset();
        currentPlayer = player1;
        gameOver = false;
        updateStatusText();
        renderBoard();
    };

    return {resetGame, endGame, isGameOver, getCurrentPlayer, switchTurn, setPlayers, updateStatusText};
})();

renderBoard();
game.updateStatusText();

gridBox.addEventListener("click", (e) => {
    if(game.isGameOver()) return;
    if(!e.target.classList.contains("grid-item")) return;

    const index = e.target.dataset.cellIndex;
    const currentPlayer = game.getCurrentPlayer();
    const currentMark = currentPlayer.getMark();
    const placed = gameBoard.placeMark(index, currentMark);

    if(!placed) return;

    renderBoard();

    if(gameBoard.checkWin(currentMark)) {
        statusText.textContent = `${currentPlayer.getName()} Wins!`;
        game.endGame();
        return;
    }

    if(gameBoard.checkTie()) {
        statusText.textContent = "It's a Tie";
        game.endGame();
        return;
    }
    game.switchTurn();
});

const container = document.getElementById("container");
const dialog = document.getElementById("player-info-dialog");

const clickHandlers = {
    "new-game-button": () => dialog.showModal(),
    "reset-button": () => game.resetGame(),
    "cancel-button": () => dialog.close(),
};

container.addEventListener("click", (e) => {
    const handler = clickHandlers[e.target.id];
    if (handler) handler();
});

container.addEventListener("submit", (e) => {
    if (e.target.id === "player-info-form") {
        e.preventDefault();

        const name1 = document.getElementById("player_one_name").value.trim();
        const name2 = document.getElementById("player_two_name").value.trim();

        game.setPlayers(name1, name2);
        game.resetGame();
        dialog.close();
    }
});