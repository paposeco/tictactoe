const gameboard = (function () {
  const currentBoard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const pickBoardSquare = function (square, player) {
    const playerPiece = player.getPlayerPiece();
    const picked = currentBoard.findIndex((element) => element === square);
    currentBoard[picked] = playerPiece;
    return displayCurrentBoard.updateDisplay();
  };
  return { currentBoard, pickBoardSquare };
})();

const player = function (name, playerPiece) {
  const getName = () => name;
  const getPlayerPiece = () => playerPiece;
  return { getName, getPlayerPiece };
};

const displayCurrentBoard = (function () {
  const divs = document.querySelectorAll(".square p");
  const divsarray = Array.from(divs, (div) => div);
  const currentBoard = gameboard.currentBoard;
  const updateDisplay = function () {
    for (i = 0; i < divsarray.length; i++) {
      divsarray[i].textContent = currentBoard[i];
    }
  };
  updateDisplay();
  return { updateDisplay };
})();

const gameStart = (function () {
  const firstplayer = player("firstplayer", "x");
  const otherplayer = player("otherplayer", "0");
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", function (event) {
      const squareID = event.target.getAttribute("id");

      gameboard.pickBoardSquare(squareID, firstplayer);
    });
  });
})();

// tenho de por isto dentro do gameboard acho eu para keep track de quem é que está a jogar
const switchPlayers = function (firstplayer, otherplayer) {
  if (switchPlayers === firstplayer) {
    return otherplayer;
  } else {
    return firstplayer;
  }
};
