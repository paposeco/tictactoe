const playeridentities = (function () {
  const inputSubmit = document.getElementById("submitinput");
  const firstplayerNameInput = document.getElementById("firstplayer");
  const otherplayerNameInput = document.getElementById("otherplayer");
  let firstplayerName;
  let otherplayerName;
  inputSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    firstplayerName = firstplayerNameInput.value;
    otherplayerName = otherplayerNameInput.value;
  });
  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

const player = function (name, playerPiece) {
  const getName = () => name;
  const getPlayerPiece = () => playerPiece;
  return { getName, getPlayerPiece };
};

const gameboard = (function () {
  const currentBoard = [
    { 0: " " },
    { 1: " " },
    { 2: " " },
    { 3: " " },
    { 4: " " },
    { 5: " " },
    { 6: " " },
    { 7: " " },
    { 8: " " },
  ];
  const firstplayer = player("firstplayer", "x");
  const otherplayer = player("otherplayer", "0");
  let currentplayer = firstplayer;
  const switchPlayers = function (firstplayer, otherplayer, currentPlayer) {
    if (currentPlayer === firstplayer) {
      return otherplayer;
    } else {
      return firstplayer;
    }
  };
  const pickBoardSquare = function (square) {
    const playerPiece = currentplayer.getPlayerPiece();
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    currentBoard[picked][picked] = playerPiece;
    const winner = checkForWinner(
      square,
      currentBoard,
      playerPiece,
      currentplayer
    );
    const tie = checkForTie(currentBoard);
    currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);

    return displayCurrentBoard.updateDisplay(winner, tie);
  };
  return { currentBoard, pickBoardSquare };
})();

const getSelectedSquare = function (event) {
  let playerNames = playeridentities.selectedNames();
  if (playerNames[0] === undefined || playerNames[1] === undefined) {
    alert("Please pick your names before playing.");
    return "please pick your names first";
  }
  const squareID = event.target.getAttribute("id");
  if (event.target.textContent != " ") {
    return;
  }

  gameboard.pickBoardSquare(squareID);
};

const gameStart = (function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
})();

const displayCurrentBoard = (function () {
  const divs = document.querySelectorAll(".square p");
  const divsarray = Array.from(divs, (div) => div);
  const currentBoard = gameboard.currentBoard;
  const updateDisplay = function (winner, tie) {
    for (i = 0; i < divsarray.length; i++) {
      divsarray[i].textContent = currentBoard[i][i];
    }
    if (winner !== undefined) {
      divs.forEach(function (square) {
        square.removeEventListener("click", getSelectedSquare);
      });
    }
    if (tie === "It's a tie") {
      console.log(tie);
    }
  };
  updateDisplay(undefined, undefined);
  return { updateDisplay };
})();

const checkForTie = function (currentBoard) {
  let objectValues = [];
  currentBoard.forEach(function (obj) {
    objectValues.push(Object.values(obj));
  });
  let objectValuesExtracted = [];
  objectValues.forEach(function (array) {
    objectValuesExtracted.push(array[0]);
  });
  const emptySquares = objectValuesExtracted.includes(" ");
  if (!emptySquares) {
    return "It's a tie";
  }
};

const checkForWinner = function (
  currentSquareID,
  currentBoard,
  piece,
  currentplayer
) {
  const winningArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let miniArraysWithSquare = winningArray.filter((miniarray) =>
    miniarray.includes(Number(currentSquareID))
  );

  let winner;
  for (i = 0; i < miniArraysWithSquare.length; i++) {
    const currentArray = miniArraysWithSquare[i];
    let currentBoardValuesForThisArray = [
      currentBoard[currentArray[0]],
      currentBoard[currentArray[1]],
      currentBoard[currentArray[2]],
    ];

    let objectvaluesarray = [];
    currentBoardValuesForThisArray.forEach(function (obj) {
      objectvaluesarray.push(Object.values(obj));
    });
    let objectvalueOneArray = [
      objectvaluesarray[0][0],
      objectvaluesarray[1][0],
      objectvaluesarray[2][0],
    ];
    let numberPieces = objectvalueOneArray.filter(
      (element) => element === piece
    ).length;

    if (numberPieces === 3) {
      let playerNames = playeridentities.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      if (winner === "firstplayer") {
        playerNameWinner = playerNames[0];
      } else {
        playerNameWinner = playerNames[1];
      }
      console.log("we have a winner: " + playerNameWinner);
    }
  }
  return winner;
};
