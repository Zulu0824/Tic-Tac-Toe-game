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
        if(board[index] = "") return false;
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

const renderBoard = () => {
    gridBox.textContent = "";
    gameBoard.getBoard().forEach((cellValue, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("grid-item");
        cellDiv.dataset.cellIndex = index;
        cellDiv.textContent = cellValue;
        gridBox.appendChild(cellDiv);
    });
};

renderBoard();