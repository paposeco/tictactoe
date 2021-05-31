const player = function (name, playerMark) {
  const getName = () => name;
  const getPlayerMark = () => playerMark;
  return { getName, getPlayerMark };
};

let aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// saves players names, and if the first player is AI, runs the AI player function
const getPlayers = (function () {
  const formAI = document.getElementById("playersinfoAI");
  let output = [];
  let firstplayerName;
  let otherplayerName;
  formAI.addEventListener("submit", function (e) {
    e.preventDefault();
    output = [];
    let data = new FormData(formAI);
    for (const entry of data) {
      output.push(entry[1]);
    }
    if (output.length === 0) {
      alert("You must select the players first.");
      return;
    }
    //output[0] is firstplayer for humans and firstplayerAI for computer;
    if (output[0] === "firstplayer") {
      firstplayerName = window.prompt("Name of first player: ", "Player X");
      // on cancel return
      if (firstplayerName === null) {
        return;
      } else {
        gameStart();
      }
    } else {
      firstplayerName = output[0];
    }
    if (output[1] === "secondplayer") {
      otherplayerName = window.prompt("Name of second player: ", "Player O");
      if (otherplayerName === null) {
        return;
      }
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
    // resets game if the user wants to change players
    const freshboard = gameboard.resetPlayers();
    if (firstplayerName === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(null, undefined, undefined, undefined, freshboard),
        650
      );
      setTimeout(gameStart, 700);
    }
    // at the start of the game displays information about the game
    const starttext = document.getElementById("gameStatus");
    const subtitle = document.createElement("h3");
    const para1 = document.createElement("p");
    const para2 = document.createElement("p");
    subtitle.textContent = "Game is ready!";
    para1.textContent =
      "Player 1 picks a square. Player 2 picks next. If you are playing against the computer, it will play automatically.";
    para2.textContent =
      "Continue until one player fills a line with 3 crosses or circles.";
    starttext.appendChild(subtitle);
    starttext.appendChild(para1);
    starttext.appendChild(para2);
  });

  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

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

  const firstplayer = player("firstplayer", "×");
  const otherplayer = player("otherplayer", "o");
  let currentplayer = firstplayer;
  let playerNames;
  let winner;
  let tie;
  // restarts game and maintains players
  const restartgame = function () {
    playerNames = getPlayers.selectedNames();
    winner = undefined;
    tie = undefined;
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
    // removes "O" mark class (that colors "O" in a different color) where it was applied before and removes winner/tie text
    const squaresPara = document.querySelectorAll(".markO");
    squaresPara.forEach((square) => square.classList.remove("markO"));
    const subtitle = document.querySelector("#gameStatus h3");
    const starttext = document.querySelector("#gameStatus");
    if (starttext.contains(subtitle)) {
      starttext.removeChild(subtitle);
    }
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
      setTimeout(gameStart, 400);
    } else {
      gameStart();
    }
    drawOnCanvas.clearCanvas();
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
  };
  // similar to restart function but resets players too; function runs after clicking the start button for a second time
  const resetPlayers = function () {
    winner = undefined;
    tie = undefined;
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
    const squaresPara = document.querySelectorAll(".markO");
    squaresPara.forEach((square) => square.classList.remove("markO"));
    const subtitle = document.querySelector("#gameStatus h3");
    const starttext = document.querySelector("#gameStatus");
    if (starttext.contains(subtitle)) {
      starttext.removeChild(subtitle);
    }
    currentplayer = firstplayer;
    drawOnCanvas.clearCanvas();
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
    return currentBoard;
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
    // switches players for AI; humans are switched with the switchPlayers function
    if (playersNames[1] === "secondplayerAI") {
      currentplayer = firstplayer;
    }
    if (playersNames[0] === "firstplayerAI") {
      currentplayer = otherplayer;
    }
    const currentSquare = document.getElementById(square);
    const playerMark = currentplayer.getPlayerMark();
    // colors mark "O" differently than "X"
    if (playerMark === "o") {
      currentSquare.classList.add("markO");
    }
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    // updates currentBoard objects, checks for winner or tie and updates display
    currentBoard[picked][picked] = playerMark;
    winner = checkForWinner(square, currentBoard, playerMark, currentplayer);
    tie = checkForTie(currentBoard, winner);
    displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
    // after a play by a human, calls the AI player function if one is being used
    if (
      playersNames[0] === "firstplayerAI" &&
      winner === undefined &&
      tie === undefined
    ) {
      setTimeout(
        playerAIfunc.bind(null, firstplayer, winner, tie, currentBoard),
        300
      );
    }
    if (
      playersNames[1] === "secondplayerAI" &&
      winner === undefined &&
      tie === undefined
    ) {
      setTimeout(
        playerAIfunc.bind(null, otherplayer, winner, tie, currentBoard),
        300
      );
    }
    currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);
  };

  return { currentBoard, pickBoardSquare, restartgame, resetPlayers };
})();

// handles click events on gameboard for humans
const getSelectedSquare = function (event) {
  const squareID = event.target.getAttribute("id");
  if (event.target.textContent != " ") {
    return;
  }
  // removes text after the first play
  const starttext = document.getElementById("gameStatus");
  const subtitle = document.querySelector("#gameStatus h3");
  const paraS = document.querySelectorAll("#gameStatus p");
  if (starttext.contains(subtitle)) {
    starttext.removeChild(subtitle);
    paraS.forEach((para) => starttext.removeChild(para));
  }
  //removes hover coloring if the square isn't available
  const div = event.target.closest("div");
  div.classList.remove("availablesquare");
  const availableplaces = betterai.available(aiboard).length;
  const order = 9 - Number(availableplaces);
  aiboard[squareID] = "w" + order;
  gameboard.pickBoardSquare(squareID);
};

const gameStart = function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
  const divs = document.querySelectorAll(".square");
  divs.forEach((div) => div.classList.add("availablesquare"));
};

const displayCurrentBoard = (function () {
  const paragraphs = document.querySelectorAll(".square p");
  const paraArray = Array.from(paragraphs, (para) => para);
  const currentBoard = gameboard.currentBoard;
  // displays the current board, by updating the textcontent of each p
  const updateDisplay = function (winner, tie, currentBoard) {
    const gameStatus = document.getElementById("gameStatus");
    const winnerPara = document.createElement("h3");
    for (i = 0; i < paraArray.length; i++) {
      paraArray[i].textContent = currentBoard[i][i];
    }
    //if a winner is found, removes listeners from squares and displays the winner's name
    if (winner !== undefined) {
      paragraphs.forEach(function (square) {
        square.removeEventListener("click", getSelectedSquare);
      });
      let playersNames = getPlayers.selectedNames();
      if (winner === "firstplayer") {
        if (playersNames[0] === "firstplayerAI") {
          winnerPara.textContent = "Computer is the winner!";
          gameStatus.appendChild(winnerPara);
        } else {
          winnerPara.textContent = playersNames[0] + " is the winner!";
          gameStatus.appendChild(winnerPara);
        }
      } else {
        if (playersNames[1] === "secondplayerAI") {
          winnerPara.textContent = "Computer is the winner!";
          gameStatus.appendChild(winnerPara);
        } else {
          winnerPara.textContent = playersNames[1] + " is the winner!";
          gameStatus.appendChild(winnerPara);
        }
      }
    }
    if (tie === "It's a tie") {
      winnerPara.textContent = "It's a tie!";
      gameStatus.appendChild(winnerPara);
    }
  };
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
    playermark = "×";
    currentplayer = "";
  } else {
    // looks for a win or, if there isn't one, if the other player will win on the next round
    playermark = AIplayer.getPlayerMark();
    currentplayer = AIplayer;
  }
  // bestIndex = lookForAWinningLine(
  //   currentplayer,
  //   currentBoard,
  //   availableSquares
  // );

  console.log(aiboard);

  bestIndex = betterai.stopLooking(aiboard);
  console.log("bestindex: " + bestIndex);
  squareSelected = [bestIndex];
  paraSelectedID = bestIndex;

  // if (bestIndex !== undefined) {
  //   squareSelected = [bestIndex];
  //   paraSelectedID = bestIndex;
  // } else {
  //   //if there isn't a win for either player, picks a square randomly

  //   let tempArray = Array.from(currentBoard, (obj) =>
  //     Object.values(obj).toString()
  //   );
  //   indexSelected = betterai(tempArray);
  //   paraSelectedID = indexSelected;
  //   squareSelected = [indexSelected];
  // }
  const paraID = squareSelected[0];
  const paraSelected = document.getElementById(paraID);

  // colors "O" differently
  if (playermark === "o") {
    paraSelected.classList.add("markO");
  }
  //removes hover coloring if the square isn't available
  const div = paraSelected.closest("div");
  div.classList.remove("availablesquare");

  // updates board with the selected square and checks if there's a winner or a tie

  const availableplaces = betterai.available(aiboard).length;
  const order = 9 - Number(availableplaces);
  //console.log(availableplaces);
  aiboard[bestIndex] = "w" + order;

  console.log(aiboard);
  currentBoard[squareSelected[0]][squareSelected[0]] = playermark;

  winner = checkForWinner(
    squareSelected[0],
    currentBoard,
    playermark,
    currentplayer
  );

  // updates game display
  return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
};

const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const betterai = (function (board) {
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

  const available = function (array) {
    let availablearray = [];
    array.forEach(function (value, index) {
      if (value === 0) {
        availablearray.push(index);
      }
    });
    return availablearray;
  };

  const fill = function (index, currentboard) {
    let availableplaces = available(currentboard).length;
    const order = 9 - Number(availableplaces);
    currentboard[index] = "w" + order;
    availableplaces = available(currentboard).length;
    if (availableplaces === 1) {
      let temporaryboard = Array.from(currentboard);
      let winner = checkforThree(temporaryboard, "o");
      if (!winner) {
        let lastspot = currentboard.indexOf(0);
        currentboard[lastspot] = "w8";
      }
    }
    return currentboard;
  };

  const combinationsForO = function (currentboard, newpositions) {
    let possible = [];
    const availablespaces = newpositions.length;
    for (let i = 0; i < availablespaces; i++) {
      let workingboard = Array.from(currentboard);
      let tempBoard = Array.from(workingboard);
      let bestplace = entireboard(tempBoard, "o");
      if (bestplace !== undefined) {
        workingboard = fill(bestplace, workingboard);
        possible.push(workingboard);
        break;
      } else {
        workingboard = fill(newpositions[i], workingboard);
        possible.push(workingboard);
      }
    }
    return possible;
  };

  const combinationsForX = function (lastarray) {
    let emptyarray = [];
    for (let i = 0; i < lastarray.length; i++) {
      let boardarray = Array.from(lastarray[i]);
      let availablespots = available(boardarray);
      for (let j = 0; j < availablespots.length; j++) {
        let boardarrayBackup = Array.from(boardarray);
        let tempBoardX = Array.from(boardarray);
        let bestplaceX = entireboard(tempBoardX, "x");
        let transformedBoard;
        if (bestplaceX !== undefined) {
          boardarrayBackup = fill(bestplaceX, boardarrayBackup);
          availablespots = available(boardarrayBackup);
          let tempboard = Array.from(boardarrayBackup);
          let xiswinner = checkforThree(tempboard, "x");
          if (!xiswinner) {
            let newboardarray = combinationsForO(
              boardarrayBackup,
              availablespots
            );
            emptyarray.push(newboardarray);
            continue;
          } else {
            emptyarray.push(boardarrayBackup);
            break;
          }
        } else {
          boardarrayBackup = fill(availablespots[j], boardarrayBackup);
          availablespots = available(boardarrayBackup);
          let newboardarray = combinationsForO(
            boardarrayBackup,
            availablespots
          );
          emptyarray.push(newboardarray);
        }
      }
    }
    return emptyarray;
  };

  const combinationsSingle = function (array) {
    let emptyarray = [];
    let boardarray = Array.from(array);
    let availablespots = available(boardarray);
    for (let k = 0; k < availablespots.length; k++) {
      let boardarraySingle = Array.from(boardarray);
      let tempBoardX = Array.from(boardarraySingle);
      let bestplaceX = entireboard(tempBoardX, "x");
      let transformedBoard;
      if (bestplaceX !== undefined) {
        boardarraySingle = fill(bestplaceX, boardarraySingle);
        availablespots = available(boardarraySingle);
        let tempboard = Array.from(boardarraySingle);
        let xiswinner = checkforThree(tempboard, "x");
        if (!xiswinner) {
          let newboardarray = combinationsForO(
            boardarraySingle,
            availablespots
          );
          emptyarray.push(newboardarray);
          continue;
        }
      } else {
        boardarraySingle = fill(availablespots[k], boardarraySingle);
        availablespots = available(boardarraySingle);
        let newboardarraySecond = combinationsForO(
          boardarraySingle,
          availablespots
        );
        emptyarray.push(newboardarraySecond);
      }
    }

    return emptyarray;
  };

  const reducer = function (accumulator, currentValue) {
    if (currentValue !== 0) {
      ++accumulator;
    }
    return accumulator;
  };

  const combos = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosFour;
    let combosSix;
    let combosNine;
    if (initialfilledspots === 0) {
      let combosTwo = [];
      for (let j = 0; j < 9; j++) {
        let workingboard = Array.from(thisboard);
        workingboard = fill(j, workingboard);
        let availablespots = available(workingboard);
        combosTwo.push(combinationsForO(workingboard, availablespots));
      }
      combosFour = combinationsForX(combosTwo.flat());
      combosSix = combinationsForX(combosFour.flat());
      combosNine = combinationsForX(combosSix.flat());
    } else if (initialfilledspots === 2) {
      combosFour = combinationsSingle(thisboard).flat();
      combosSix = combinationsForX(combosFour).flat();
      combosNine = combinationsForX(combosSix);
    } else if (initialfilledspots === 4) {
      combosSix = combinationsSingle(thisboard).flat();
      combosNine = combinationsForX(combosSix);
    } else {
      combosNine = combinationsSingle(thisboard).flat();
    }
    return combosNine;
  };

  const transformMark = function (array) {
    for (let i = 0; i < array.length; i++) {
      if (
        array[i] === "w0" ||
        array[i] === "w2" ||
        array[i] === "w4" ||
        array[i] === "w6" ||
        array[i] === "w8"
      ) {
        array[i] = "x";
      } else if (array[i] === 0) {
        continue;
      } else if (
        array[i] === "w1" ||
        array[i] === "w3" ||
        array[i] === "w5" ||
        array[i] === "w7"
      ) {
        array[i] = "o";
      }
    }
    return array;
  };

  const entireboard = function (board, mark) {
    const currentboard = transformMark(board);
    let selected;
    if (mark === "o") {
      let checkForTwoO = checkForTwo(currentboard, "o", "x");
      if (checkForTwoO !== undefined && checkForTwoO[0] === true) {
        selected = checkForTwoO[1];
        return selected;
      } else {
        let checkForTwoX = checkForTwo(currentboard, "x", "o");
        if (checkForTwoX !== undefined && checkForTwoX[0] === true) {
          selected = checkForTwoX[1];
          return selected;
        }
      }
    } else {
      let checkForTwoX = checkForTwo(currentboard, "x", "o");
      if (checkForTwoX !== undefined && checkForTwoX[0] === true) {
        selected = checkForTwoX[1];
        return selected;
      } else {
        let checkForTwoO = checkForTwo(currentboard, "o", "x");
        if (checkForTwoO !== undefined && checkForTwoO[0] === true) {
          selected = checkForTwoO[1];
          return selected;
        }
      }
    }
  };

  const checkForTwo = function (array, firstmark, secondmark) {
    let goodindex;
    let zeroLocation;
    for (let i = 0; i < winningArray.length; i++) {
      let arrayIndexes = [];
      const currentarray = winningArray[i];
      const valueOnBoard = [
        array[currentarray[0]],
        array[currentarray[1]],
        array[currentarray[2]],
      ];
      if (valueOnBoard.includes(0)) {
        valueOnBoard.forEach(function (element, index) {
          if (element !== 0) {
            arrayIndexes.push(index);
          }
        });
      } else {
        continue;
      }
      if (arrayIndexes.length === 2) {
        let newarray = [
          valueOnBoard[arrayIndexes[0]],
          valueOnBoard[arrayIndexes[1]],
        ];
        if (newarray.every((element) => element === firstmark)) {
          zeroLocation = valueOnBoard.findIndex((element) => element === 0);
          goodindex = currentarray[zeroLocation];
          return [true, goodindex];
        } else {
          continue;
        }
      }
    }
    for (let j = 0; j < winningArray.length; j++) {
      let arrayIndexes = [];
      const currentarray = winningArray[j];
      const valueOnBoard = [
        array[currentarray[0]],
        array[currentarray[1]],
        array[currentarray[2]],
      ];
      if (valueOnBoard.includes(0)) {
        valueOnBoard.forEach(function (element, index) {
          if (element !== 0) {
            arrayIndexes.push(index);
          }
        });
      } else {
        continue;
      }
      if (arrayIndexes.length === 2) {
        let newarray = [
          valueOnBoard[arrayIndexes[0]],
          valueOnBoard[arrayIndexes[1]],
        ];
        if (newarray.every((element) => element === secondmark)) {
          zeroLocation = valueOnBoard.findIndex((element) => element === 0);
          goodindex = currentarray[zeroLocation];
          return [true, goodindex];
        } else {
          continue;
        }
      }
    }
  };

  const checkforThree = function (array, mark) {
    let transformedboardArray = transformMark(array);
    let winner;
    for (let k = 0; k < winningArray.length; k++) {
      const currentarray = winningArray[k];
      const valueOnBoard = [
        transformedboardArray[currentarray[0]],
        transformedboardArray[currentarray[1]],
        transformedboardArray[currentarray[2]],
      ];
      if (valueOnBoard.every((element) => element === mark)) {
        winner = true;
        break;
      } else {
        winner = false;
      }
    }
    return winner;
  };

  const calculateValue = function (array) {
    let ev = 0;
    for (let k = 0; k < winningArray.length; k++) {
      const currentarray = winningArray[k];
      const valueOnBoard = [
        array[currentarray[0]],
        array[currentarray[1]],
        array[currentarray[2]],
      ];
      if (valueOnBoard.every((element) => element === "x")) {
        ev += 10;
        break;
      } else if (valueOnBoard.every((element) => element === "o")) {
        ev += -10;
        break;
      } else {
        ev += 0;
      }
    }
    return ev;
  };

  const stopLooking = function (board) {
    const allcombos = combos(board);
    //console.log(allcombos);
    let goodboard;
    for (let i = 0; i < allcombos.length; i++) {
      let ev;
      const tempboard = Array.from(allcombos[i]);
      const boardStop = transformMark(allcombos[i]);
      ev = calculateValue(boardStop);
      if (ev === 10) {
        goodboard = tempboard;
        break;
      }
    }
    if (goodboard === undefined) {
      const freshAllCombos = combos(board);
      for (let j = 0; j < freshAllCombos.length; j++) {
        let ev;
        const newtempboard = Array.from(freshAllCombos[j]);
        const newboard = transformMark(freshAllCombos[j]);
        ev = calculateValue(newboard);
        if (ev === 0) {
          console.log("tie");
          goodboard = newtempboard;
          break;
        }
      }
    }
    const onlyZero = (currentValue) => currentValue === 0;
    let goodspot;
    if (aiboard.every(onlyZero)) {
      goodspot = goodboard.findIndex((element) => element === "w0");
    } else {
      const arrayToSort = Array.from(aiboard);
      arrayToSort.sort();
      const largestFilled = arrayToSort[arrayToSort.length - 1];
      const largestFilledNumber = largestFilled.slice(1);
      const goodspot = goodboard.findIndex(
        (element) => element === "w" + (largestFilledNumber + 1)
      );
    }
    return goodspot;
  };

  return { available, fill, stopLooking };
})();

//mudar a forma como escreve order
// o w8 nao esta a funcionar acho eu

//console.log(betterai([0, "o", "x", "x", 0, 0, 0, 0, "o"]));

const lookForAWinningLine = function (
  currentplayer,
  currentBoard,
  availableSquares
) {
  const playerMark = currentplayer.getPlayerMark();
  let otherplayerMark;
  if (currentplayer.getName() === "firstplayer") {
    otherplayerMark = "o";
  } else {
    otherplayerMark = "×";
  }
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
  //checks for possible 3 in line for current AI;
  for (let i = 0; i < availableSquares.length; i++) {
    // get square ID that corresponds to the available square being evaluated
    let indexObj = Number(Object.keys(availableSquares[i]));
    for (let j = 0; j < winningArray.length; j++) {
      // for each array of square IDs that corresponds to a win, checks if it includes the square ID determined before
      let miniarray = winningArray[j];
      if (miniarray.includes(indexObj)) {
        //fills an array with the existing marks on squares with the IDs of the array being evaluated
        let boardValuesForMiniArray = [];
        for (let k = 0; k < miniarray.length; k++) {
          boardValuesForMiniArray.push(
            Object.values(currentBoard[miniarray[k]]).toString()
          );
        }
        let indexInMiniArray = miniarray.indexOf(indexObj);
        // fills the index on the new array that corresponds to the square ID, with the playerMark
        boardValuesForMiniArray[indexInMiniArray] = playerMark;
        if (
          boardValuesForMiniArray.every(
            (currentValue) => currentValue === playerMark
          )
        ) {
          // if there are 3 marks of the current player, the square gets selected
          selectedSquare = indexObj;
          break;
        }
      }
    }
    if (selectedSquare !== undefined) {
      return selectedSquare;
    }
  }

  // if a square wasn't selected on the previous step, repeats the same thing for the other player
  for (let i = 0; i < availableSquares.length; i++) {
    let indexObj = Number(Object.keys(availableSquares[i]));
    for (let l = 0; l < winningArray.length; l++) {
      let miniarray = winningArray[l];
      if (miniarray.includes(indexObj)) {
        let boardValuesForMiniArray = [];
        for (let m = 0; m < miniarray.length; m++) {
          boardValuesForMiniArray.push(
            Object.values(currentBoard[miniarray[m]]).toString()
          );
        }
        let indexInMiniArray = miniarray.indexOf(indexObj);
        boardValuesForMiniArray[indexInMiniArray] = otherplayerMark;
        if (
          boardValuesForMiniArray.every(
            (currentValue) => currentValue === otherplayerMark
          )
        ) {
          selectedSquare = indexObj;
          break;
        }
      }
    }
    if (selectedSquare !== undefined) {
      return selectedSquare;
    }
  }
};

// if after checking for winners, the board is full and a winner isn't found, it's a tie
const checkForTie = function (currentBoard, winner) {
  if (winner !== undefined) {
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
  //function is called every time a square is filled; creates array with every winning combination that includes the current square
  let miniArraysWithSquare = winningArray.filter((miniarray) =>
    miniarray.includes(Number(currentSquareID))
  );

  let winner;
  for (let i = 0; i < miniArraysWithSquare.length; i++) {
    const currentArray = miniArraysWithSquare[i];
    //gets objects for each index of the winning combination selected previously
    let currentBoardValuesForThisArray = [
      currentBoard[currentArray[0]],
      currentBoard[currentArray[1]],
      currentBoard[currentArray[2]],
    ];

    let objectvaluesarray = [];
    currentBoardValuesForThisArray.forEach(function (obj) {
      objectvaluesarray.push(Object.values(obj));
    });
    // gets values of objects
    let objectvalueOneArray = [
      objectvaluesarray[0][0],
      objectvaluesarray[1][0],
      objectvaluesarray[2][0],
    ];
    //checks if all marks on the winning combination are equal to current player mark
    let numberMarks = objectvalueOneArray.filter((element) => element === mark)
      .length;

    // if there are 3 players, sets the winner and draws line on canvas of the 3 in line
    if (numberMarks === 3) {
      let playerNames = getPlayers.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      drawOnCanvas.drawLine(currentArray, winner);
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

const drawOnCanvas = (function () {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const drawLine = function (array, winner) {
    canvas.style.zIndex = "1";
    ctx.beginPath();
    if (winner === "firstplayer") {
      ctx.strokeStyle = "#2a3e39";
    } else {
      ctx.strokeStyle = "#2e7b67";
    }
    ctx.lineWidth = 8;
    const startingPoint = array[0];
    // draws a line starting at the lowest number of the winning combination
    switch (startingPoint) {
      case 0:
        if (array[1] === 1) {
          ctx.moveTo(15, 61);
          ctx.lineTo(345, 61);
        } else if (array[1] === 3) {
          ctx.moveTo(61, 15);
          ctx.lineTo(61, 345);
        } else {
          ctx.moveTo(15, 15);
          ctx.lineTo(345, 345);
        }
        break;
      case 3:
        ctx.moveTo(15, 183);
        ctx.lineTo(345, 183);
        break;
      case 6:
        ctx.moveTo(15, 305);
        ctx.lineTo(345, 305);
        break;
      case 1:
        ctx.moveTo(183, 15);
        ctx.lineTo(183, 345);
        break;
      case 2:
        if (array[1] === 5) {
          ctx.moveTo(305, 15);
          ctx.lineTo(305, 345);
        } else {
          ctx.moveTo(345, 15);
          ctx.lineTo(15, 345);
        }
        break;
    }
    ctx.stroke();
  };
  const clearCanvas = function () {
    canvas.style.zIndex = "-1";
    ctx.clearRect(0, 0, 360, 366);
  };
  return { drawLine, clearCanvas };
})();

//restart button sem jogadores nao deixa joga r
