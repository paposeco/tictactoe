const player = function (name, playerMark) {
  const getName = () => name;
  const getPlayerMark = () => playerMark;
  return { getName, getPlayerMark };
};

const gameboard = (function () {
  let currentBoard = [
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
  let playerNames;
  const restartgame = function () {
    currentBoard = [
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
    currentplayer = firstplayer;
    if (playersNames[0] === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(
          null,
          firstplayer,
          undefined,
          undefined,
          currentBoard
        ),
        300
      );
    }
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
  };
  const switchPlayers = function (firstplayer, otherplayer, currentPlayer) {
    if (currentPlayer === firstplayer) {
      return otherplayer;
    } else {
      return firstplayer;
    }
  };
  const pickBoardSquare = function (square) {
    playersNames = getPlayers.selectedNames();
    if (playersNames[1] === "secondplayerAI") {
      currentplayer = firstplayer;
    }
    if (playersNames[0] === "firstplayerAI") {
      currentplayer = otherplayer;
    }
    const playerMark = currentplayer.getPlayerMark();
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    currentBoard[picked][picked] = playerMark;
    const winner = checkForWinner(
      square,
      currentBoard,
      playerMark,
      currentplayer
    );
    const tie = checkForTie(currentBoard, winner);
    displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
    // after a play by a human, calls the AI player function if one is being used
    if (playersNames[0] === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(null, firstplayer, winner, tie, currentBoard),
        1000
      );
    }
    if (playersNames[1] === "secondplayerAI") {
      setTimeout(
        playerAIfunc.bind(null, otherplayer, winner, tie, currentBoard),
        1000
      );
    }
    currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);
  };

  return { currentBoard, pickBoardSquare, restartgame };
})();

// saves players names, and if the first player is AI, runs the AI player function
const getPlayers = (function () {
  const formAI = document.getElementById("playersinfoAI");
  let output = [];
  let firstplayerName;
  let otherplayerName;
  formAI.addEventListener("submit", function (e) {
    e.preventDefault();
    output = [];
    firstplayerName = undefined;
    otherplayerName = undefined;
    // nao esta a funcionar o restart
    gameboard.restartgame();
    let data = new FormData(formAI);
    for (const entry of data) {
      output.push(entry[1]);
    }
    if (output[0] === "firstplayer") {
      firstplayerName = window.prompt("Name of first player: ");
      gameStart();
    } else {
      firstplayerName = output[0];
    }
    if (output[1] === "secondplayer") {
      otherplayerName = window.prompt("Name of second player: ");
    } else {
      otherplayerName = output[1];
    }
    if (
      firstplayerName === "firstplayerAI" &&
      otherplayerName === "secondplayerAI"
    ) {
      return window.alert(
        "The computer doesn't like to play against itself. One human must always play."
      );
    }
    if (firstplayerName === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(
          null,
          undefined,
          undefined,
          undefined,
          gameboard.currentBoard
        ),
        300
      );
      setTimeout(gameStart, 400);
    }
    if (otherplayerName === "secondplayerAI") {
      gameStart();
    }
    const starttext = document.getElementById("gameReady");
    starttext.classList.remove("hide");
  });
  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

// handles events for humans
const getSelectedSquare = function (event) {
  const squareID = event.target.getAttribute("id");
  if (event.target.textContent != " ") {
    return;
  }
  const starttext = document.getElementById("gameReady");
  starttext.classList.add("hide");
  gameboard.pickBoardSquare(squareID);
  const currentBoard = gameboard.currentBoard;
};

const gameStart = function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
};

const displayCurrentBoard = (function () {
  const divs = document.querySelectorAll(".square p");
  const divsarray = Array.from(divs, (div) => div);
  const currentBoard = gameboard.currentBoard;
  const winnerPara = document.getElementById("winner");
  const updateDisplay = function (winner, tie, currentBoard) {
    for (i = 0; i < divsarray.length; i++) {
      divsarray[i].textContent = currentBoard[i][i];
    }
    if (winner !== undefined) {
      divs.forEach(function (square) {
        square.removeEventListener("click", getSelectedSquare);
      });
      let playersNames = getPlayers.selectedNames();
      if (winner === "firstplayer") {
        winnerPara.textContent = playersNames[0] + " is the winner!";
      } else {
        winnerPara.textContent = playersNames[1] + " is the winner!";
      }
    }
    if (tie === "It's a tie") {
      console.log(tie);
      winnerPara.textContent = "It's a tie!";
    }
  };
  updateDisplay(undefined, undefined, currentBoard);
  return { updateDisplay };
})();

const playerAIfunc = function (AIplayer, winner, tie, currentBoard) {
  if (winner != undefined) {
    return;
  }
  let availableSquares = [];
  currentBoard.forEach(function (obj) {
    if (Object.values(obj)[0] === " ") {
      availableSquares.push(obj);
    }
  });

  let playermark;
  let currentplayer;
  let bestIndex;
  let squareSelected;
  let indexSelected;

  // when the game first loads, player is undefined
  if (AIplayer === undefined) {
    playermark = "x";
    currentplayer = "";
  } else {
    // looks for a win or, if there isn't one, if the other player will win on the next round
    playermark = AIplayer.getPlayerMark();
    currentplayer = AIplayer;
    bestIndex = lookForAWinningLine(
      currentplayer,
      currentBoard,
      availableSquares
    );
  }
  if (bestIndex !== undefined) {
    squareSelected = [bestIndex];
  } else {
    //if there isn't a win for either player, picks a square randomly
    indexSelected = getRandomIntInclusive(0, availableSquares.length - 1);
    squareSelected = Object.getOwnPropertyNames(
      availableSquares[indexSelected]
    );
  }
  // updates board and check if there's a winner or a tie
  currentBoard[squareSelected[0]][squareSelected[0]] = playermark;
  winner = checkForWinner(
    squareSelected[0],
    currentBoard,
    playermark,
    currentplayer
  );
  if (winner === undefined) {
    tie = checkForTie(currentBoard, winner);
  }
  // updates page
  return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
};

const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const lookForAWinningLine = function (
  currentplayer,
  currentBoard,
  availableSquares
) {
  const playerMark = currentplayer.getPlayerMark();
  let otherplayerMark;
  if (currentplayer.getName() === "firstplayer") {
    otherplayerMark = "0";
  } else {
    otherplayerMark = "x";
  }
  console.log(otherplayerMark);
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
  let selectedSquare;
  for (i = 0; i < availableSquares.length; i++) {
    let indexObj = Number(Object.keys(availableSquares[i]));
    winningArray.forEach(function (miniarray) {
      if (miniarray.includes(indexObj)) {
        let boardValuesForMiniArray = [];
        for (j = 0; j < miniarray.length; j++) {
          boardValuesForMiniArray.push(
            Object.values(currentBoard[miniarray[j]]).toString()
          );
        }

        // check for 3 in line for either player
        let indexInMiniArray = miniarray.indexOf(indexObj);
        boardValuesForMiniArray[indexInMiniArray] = playerMark;
        if (
          boardValuesForMiniArray.every(
            (currentValue) => currentValue === playerMark
          )
        ) {
          selectedSquare = indexObj;
          return;
        }

        boardValuesForMiniArray[indexInMiniArray] = otherplayerMark;
        if (
          boardValuesForMiniArray.every(
            (currentValue) => currentValue === otherplayerMark
          )
        ) {
          selectedSquare = indexObj;
          return;
        }
      }
    });
  }
  return selectedSquare;
};

const checkForTie = function (currentBoard, winner) {
  if (winner !== undefined) {
    console.log(winner);
    return;
  }
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
  mark,
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
    let numberMarks = objectvalueOneArray.filter((element) => element === mark)
      .length;

    if (numberMarks === 3) {
      let playerNames = getPlayers.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      if (winner === "firstplayer") {
        playerNameWinner = playerNames[0];
      } else {
        playerNameWinner = playerNames[1];
      }
    }
  }
  return winner;
};

const restartgameListener = (function () {
  const restartbuttonB = document.getElementById("restartbutton");
  restartbuttonB.addEventListener("click", function () {
    gameboard.restartgame();
  });
})();

//restart nao esta bem para humanos
