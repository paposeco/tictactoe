let aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const betterai = (function (boardnewai) {
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

  const flattenArray = function (array) {
    let flattenedarray = [];
    for (let i = 0; i < array.length; i++) {
      let currentarray = array[i];
      let currentarrayL = currentarray.length;
      if (currentarrayL !== 9) {
        for (let j = 0; j < currentarrayL; j++) {
          flattenedarray.push(currentarray[j]);
        }
      } else {
        flattenedarray.push(currentarray);
      }
    }
    return flattenedarray;
  };

  const reducer = function (accumulator, currentValue) {
    if (currentValue !== 0) {
      ++accumulator;
    }
    return accumulator;
  };

  const transformMark = function (array) {
    const temparray = Array.from(array);
    for (let i = 0; i < temparray.length; i++) {
      if (
        temparray[i] === "w0" ||
        temparray[i] === "w2" ||
        temparray[i] === "w4" ||
        temparray[i] === "w6" ||
        temparray[i] === "w8"
      ) {
        temparray[i] = "x";
      } else if (temparray[i] === 0) {
        continue;
      } else if (
        temparray[i] === "w1" ||
        temparray[i] === "w3" ||
        temparray[i] === "w5" ||
        temparray[i] === "w7"
      ) {
        temparray[i] = "o";
      }
    }
    return temparray;
  };

  const available = function (array) {
    let availablearray = [];
    array.forEach(function (value, index) {
      if (value === 0) {
        availablearray.push(index);
      }
    });
    return availablearray;
  };

  const checkforThree = function (array, mark) {
    const temparray = Array.from(array);
    let transformedboardArray = transformMark(temparray);
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

  const entireboard = function (boardnewai, mark) {
    let selected;
    const availablespots = available(boardnewai);
    if (availablespots.length === 1) {
      selected = availablespots[0];
      return selected;
    }
    const tempboard = Array.from(boardnewai);
    const currentboard = transformMark(tempboard);

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

  const calculateValue = function (array, mark) {
    let othermark;
    if (mark === "x") {
      othermark = "o";
    } else {
      othermark = "x";
    }
    let ev = 0;
    for (let k = 0; k < winningArray.length; k++) {
      const currentarray = winningArray[k];
      const valueOnBoard = [
        array[currentarray[0]],
        array[currentarray[1]],
        array[currentarray[2]],
      ];
      if (valueOnBoard.every((element) => element === mark)) {
        ev += 10;
        break;
      } else if (valueOnBoard.every((element) => element === mark)) {
        ev += -10;
        break;
      } else {
        ev += 0;
      }
    }
    return ev;
  };

  const bestspot = function (boardnewai, mark) {
    let allcombos;
    if (mark === "x") {
      allcombos = combos(boardnewai);
    } else {
      allcombos = combosO(boardnewai);
    }
    const allcombosBackup = Array.from(allcombos);
    let goodboard;
    let goodspot;
    const numbercombos = allcombos.length;
    if (numbercombos === 9 && !Array.isArray(allcombos[0])) {
      goodboard = allcombos;
    } else {
      let winningBoards = [];
      for (let i = 0; i < allcombos.length; i++) {
        let ev;
        if (allcombos[i].length === 0) {
          continue;
        }
        const tempboard = Array.from(allcombos[i]);
        const tempboardFlat = tempboard.flat();
        const tempboardTransformed = transformMark(tempboardFlat);
        ev = calculateValue(tempboardTransformed, mark);
        if (ev === 10) {
          winningBoards.push(tempboardFlat);
          continue;
        }
      }
      if (winningBoards.length > 0) {
        let winningplacesOptions = winningBoards.length;
        let randomBoard = getRandomIntInclusive(0, winningplacesOptions - 1);
        goodboard = winningBoards[randomBoard];
      }
      if (goodboard === undefined) {
        for (let j = 0; j < allcombosBackup.length; j++) {
          let ev;
          const tempboard = Array.from(allcombosBackup[j]);
          const tempboardFlat = tempboard.flat();
          const tempboardTransformed = transformMark(tempboardFlat);
          ev = calculateValue(tempboardTransformed, mark);
          if (ev === 0) {
            goodboard = tempboardFlat;
            break;
          }
        }
      }
      if (winningBoards.length > 0) {
        //console.log(winningBoards);
      }
    }
    if (goodboard !== undefined) {
      const onlyZero = (currentValue) => currentValue === 0;
      if (boardnewai.every(onlyZero)) {
        goodspot = goodboard.findIndex((element) => element === "w0");
      } else {
        const arrayToSort = Array.from(boardnewai);
        arrayToSort.sort();
        const largestFilled = arrayToSort[arrayToSort.length - 1];
        const largestFilledNumber = Number(largestFilled.slice(1));
        goodspot = goodboard.findIndex(
          (element) => element === "w" + (largestFilledNumber + 1)
        );
      }
    }
    return goodspot;
  };

  const bestspotFinal = function (boardnewai, mark) {
    let allcombos;
    if (mark === "x") {
      allcombos = combos(boardnewai);
    } else {
      allcombos = combosO(boardnewai);
    }
    const allcombosBackup = Array.from(allcombos);
    let goodboard;
    let goodspot;
    const numbercombos = allcombos.length;
    if (numbercombos === 9 && !Array.isArray(allcombos[0])) {
      goodboard = allcombos;
    } else {
      let winningBoards = [];
      for (let i = 0; i < allcombos.length; i++) {
        let ev;
        const tempboard = Array.from(allcombos[i]);
        const tempboardFlat = tempboard.flat();
        const tempboardTransformed = transformMark(tempboardFlat);
        ev = calculateValue(tempboardTransformed, mark);
        if (ev === 10) {
          winningBoards.push(tempboardFlat);
          continue;
        }
      }
      if (winningBoards.length > 0) {
        let winningplacesOptions = winningBoards.length;
        let randomBoard = getRandomIntInclusive(0, winningplacesOptions - 1);
        goodboard = winningBoards[randomBoard];
      }
      if (goodboard === undefined) {
        let tieBoards = [];
        for (let j = 0; j < allcombosBackup.length; j++) {
          let ev;
          const tempboard = Array.from(allcombosBackup[j]);
          const tempboardFlat = tempboard.flat();
          const tempboardTransformed = transformMark(tempboardFlat);
          ev = calculateValue(tempboardTransformed, mark);

          if (ev === 0) {
            tieBoards.push(tempboardFlat);
            continue;
          }
        }
        if (tieBoards.length > 0) {
          let tieplacesOptions = tieBoards.length;
          let randomBoard = getRandomIntInclusive(0, tieplacesOptions - 1);
          goodboard = tieBoards[randomBoard];
        }
      }
    }

    if (goodboard !== undefined) {
      const onlyZero = (currentValue) => currentValue === 0;
      if (boardnewai.every(onlyZero)) {
        goodspot = goodboard.findIndex((element) => element === "w0");
      } else {
        const arrayToSort = Array.from(boardnewai);
        arrayToSort.sort();
        const largestFilled = arrayToSort[arrayToSort.length - 1];
        const largestFilledNumber = Number(largestFilled.slice(1));
        goodspot = goodboard.findIndex(
          (element) => element === "w" + (largestFilledNumber + 1)
        );
      }
    }
    return goodspot;
  };

  const combinationsForO = function (currentboard, newpositions) {
    let currentboardBackup = Array.from(currentboard);
    let workingboardBackup = Array.from(currentboard);
    let xiswinner = checkforThree(currentboardBackup, "x");
    if (xiswinner) {
      return currentboard;
    }
    let possible = [];
    const availablespaces = newpositions.length;
    if (availablespaces === 0) {
      return currentboard;
    }
    let tempBoard = Array.from(currentboard);
    let bestplace = bestspot(tempBoard, "o");
    if (bestplace !== -1 && bestplace !== undefined) {
      let workingboard = Array.from(currentboard);
      workingboard = fill(bestplace, workingboard);
      possible.push(workingboard);
      return possible;
    }
    for (let i = 0; i < availablespaces; i++) {
      let workingboard = Array.from(workingboardBackup);
      workingboard = fill(newpositions[i], workingboard);
      possible.push(workingboard);
    }
    return possible;
  };

  const combinationsForOForX = function (currentboard, newpositions) {
    let currentboardBackup = Array.from(currentboard);
    let oiswinner = checkforThree(currentboardBackup, "o");
    if (oiswinner) {
      return currentboard;
    }
    let possible = [];
    const availablespaces = newpositions.length;
    if (availablespaces === 0) {
      return currentboard;
    }
    let tempBoard = Array.from(currentboard);
    let bestplace = bestspot(tempBoard, "x");
    if (bestplace !== -1 && bestplace !== undefined) {
      let workingboard = Array.from(currentboard);
      workingboard = fill(bestplace, workingboard);
      possible.push(workingboard);
      return possible;
    }
    for (let i = 0; i < availablespaces; i++) {
      let workingboard = Array.from(currentboard);
      workingboard = fill(newpositions[i], workingboard);
      possible.push(workingboard);
    }
    return possible;
  };

  const combinationsForX = function (arraytest) {
    let emptyarray = [];
    if (arraytest.length === 9 && !Array.isArray(arraytest[0])) {
      let tempboard = Array.from(arraytest);
      let oiswinner = checkforThree(tempboard, "o");
      if (oiswinner) {
        return arraytest;
      }
    }
    for (let i = 0; i < arraytest.length; i++) {
      let boardarray = Array.from(arraytest[i]);
      let availablespots = available(boardarray);
      let tempBoardX = Array.from(boardarray);
      let bestplaceX = entireboard(tempBoardX, "x");
      if (bestplaceX !== undefined) {
        boardarray = fill(bestplaceX, boardarray);
        availablespots = available(boardarray);
        let tempboard = Array.from(boardarray);
        let xiswinner = checkforThree(tempboard, "x");
        let oiswinner = checkforThree(tempboard, "o");
        if (xiswinner) {
          emptyarray.push(boardarray);
          continue;
        } else if (oiswinner) {
          continue;
        } else {
          let newboardarray = combinationsForO(boardarray, availablespots);
          emptyarray.push(newboardarray);
          continue;
        }
      } else {
        for (let j = 0; j < availablespots.length; j++) {
          let freshboardarray = Array.from(boardarray);
          freshboardarray = fill(availablespots[j], freshboardarray);
          let newavailablespots = available(freshboardarray);
          let newboardarray = combinationsForO(
            freshboardarray,
            newavailablespots
          );
          emptyarray.push(newboardarray);
        }
      }
    }
    return emptyarray;
  };

  const combinationsForXForO = function (lastarray) {
    let emptyarray = [];
    if (lastarray.length === 9 && !Array.isArray(lastarray[0])) {
      let tempboard = Array.from(lastarray);
      let xiswinner = checkforThree(tempboard, "x");
      if (xiswinner) {
        return lastarray;
      }
    }
    for (let i = 0; i < lastarray.length; i++) {
      let boardarray = Array.from(lastarray[i]);
      let availablespots = available(boardarray);
      let tempBoardX = Array.from(boardarray);
      let bestplaceO = entireboard(tempBoardX, "o");
      if (bestplaceO !== undefined) {
        boardarray = fill(bestplaceO, boardarray);
        availablespots = available(boardarray);
        let tempboard = Array.from(boardarray);
        let oiswinner = checkforThree(tempboard, "o");
        let xiswinner = checkforThree(tempboard, "x");
        if (oiswinner) {
          emptyarray.push(boardarray);
          continue;
        } else if (xiswinner) {
          continue;
        } else {
          let newboardarray = combinationsForOForX(boardarray, availablespots);
          emptyarray.push(newboardarray);
          continue;
        }
      } else {
        for (let j = 0; j < availablespots.length; j++) {
          let freshboardarray = Array.from(boardarray);
          freshboardarray = fill(availablespots[j], freshboardarray);
          let newavailablespots = available(freshboardarray);
          let newboardarray = combinationsForOForX(
            freshboardarray,
            newavailablespots
          );
          emptyarray.push(newboardarray);
        }
      }
    }
    return emptyarray;
  };

  const combinationsSingle = function (array) {
    if (array.length === 9 && !Array.isArray(array[0])) {
      let tempboard = Array.from(array);
      let oiswinner = checkforThree(tempboard, "o");
      let xiswinner = checkforThree(tempboard, "x");
      if (oiswinner) {
        return array;
      }
      if (xiswinner) {
        return array;
      }
    }
    let emptyarray = [];
    let boardarray = Array.from(array);
    let boardarrayBackup = Array.from(array);
    let availablespots = available(boardarray);
    let bestplaceX = entireboard(boardarray, "x");

    if (bestplaceX !== undefined) {
      boardarrayBackup = fill(bestplaceX, boardarrayBackup);
      availablespots = available(boardarrayBackup);
      let tempboard = Array.from(boardarrayBackup);
      let xiswinner = checkforThree(tempboard, "x");
      let oiswinner = checkforThree(tempboard, "o");
      if (xiswinner) {
        return boardarrayBackup;
      } else if (oiswinner) {
        return;
      } else {
        let newboardarray = combinationsForO(boardarrayBackup, availablespots);
        emptyarray.push(newboardarray);
        return emptyarray;
      }
    } else {
      for (let i = 0; i < availablespots.length; i++) {
        let freshboardarray = Array.from(array);
        freshboardarray = fill(availablespots[i], freshboardarray);
        let newavailablespots = available(freshboardarray);
        let newboardarraySecond = combinationsForO(
          freshboardarray,
          newavailablespots
        );
        emptyarray.push(newboardarraySecond);
      }
    }
    return emptyarray;
  };

  const combinationsSingleForO = function (array) {
    if (array.length === 9 && !Array.isArray(array[0])) {
      let tempboard = Array.from(array);
      let xiswinner = checkforThree(tempboard, "x");
      let oiswinner = checkforThree(tempboard, "o");
      if (xiswinner) {
        return array;
      }
      if (oiswinner) {
        return array;
      }
    }
    let emptyarray = [];
    let boardarray = Array.from(array);
    let boardarrayBackup = Array.from(array);
    let availablespots = available(boardarray);
    let bestplaceO = entireboard(boardarray, "o");
    if (bestplaceO !== undefined) {
      boardarrayBackup = fill(bestplaceO, boardarrayBackup);
      availablespots = available(boardarrayBackup);
      if (availablespots.length === 0) {
        return boardarrayBackup;
      } else {
        let tempboard = Array.from(boardarrayBackup);
        let owinner = checkforThree(tempboard, "o");
        let xiswinner = checkforThree(tempboard, "x");
        if (owinner) {
          return boardarrayBackup;
        } else if (xiswinner) {
          return;
        } else {
          let newboardarray = combinationsForOForX(
            boardarrayBackup,
            availablespots
          );
          emptyarray.push(newboardarray);
          return emptyarray;
        }
      }
    } else {
      for (let i = 0; i < availablespots.length; i++) {
        let freshboardarray = Array.from(array);
        freshboardarray = fill(availablespots[i], freshboardarray);
        let newavailablespots = available(freshboardarray);
        if (newavailablespots.length === 0) {
          emptyarray.push(freshboardarray);
          continue;
        }
        let newboardarraySecond = combinationsForOForX(
          freshboardarray,
          newavailablespots
        );
        emptyarray.push(newboardarraySecond);
      }
    }
    return emptyarray;
  };

  const combos = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosTwo;
    let combosFour;
    let combosSix;
    let combosEight;
    if (initialfilledspots === 0) {
      let combosTwoTemp = [];
      for (let j = 0; j < 9; j++) {
        let workingboard = Array.from(thisboard);
        workingboard = fill(j, workingboard);
        let availablespots = available(workingboard);
        combosTwoTemp.push(combinationsForO(workingboard, availablespots));
      }
      combosTwo = flattenArray(combosTwoTemp);
      let combosFourTemp = combinationsForX(combosTwo);
      combosFour = flattenArray(combosFourTemp);
      let combosSixTemp = combinationsForX(combosFour);
      combosSix = flattenArray(combosSixTemp);
      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForX(combosSix);
    } else if (initialfilledspots === 2) {
      let combosFourTemp = combinationsSingle(thisboard);
      combosFour = flattenArray(combosFourTemp);
      let combosSixTemp = combinationsForX(combosFour);
      combosSix = flattenArray(combosSixTemp);
      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForX(combosSix);
    } else if (initialfilledspots === 4) {
      let combosSixTemp = combinationsSingle(thisboard);

      combosSix = flattenArray(combosSixTemp);
      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForX(combosSix);
    } else {
      combosEight = combinationsSingle(thisboard);
    }
    return combosEight;
  };

  const combosO = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosThree;
    let combosFive;
    let combosSeven;
    let combosNine;
    if (initialfilledspots === 1) {
      let combosThreeTemp = combinationsSingleForO(thisboard);
      combosThree = flattenArray(combosThreeTemp);
      let combosFiveTemp = combinationsForXForO(combosThree);
      combosFive = flattenArray(combosFiveTemp);
      let temparray = [];
      if (combosFive.length === 9 && !Array.isArray(combosFive[0])) {
        let isxwinner = checkforThree(combosFive, "x");
        if (isxwinner) {
          return;
        } else {
          return combosFive;
        }
      } else {
        for (let i = 0; i < combosFive.length; i++) {
          let aboard = combosFive[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosFive[i]);
          }
        }
      }
      combosFive = Array.from(temparray);
      let combosSevenTemp = combinationsForXForO(combosFive);
      combosSeven = flattenArray(combosSevenTemp);
      let temparray2 = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray2.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray2);
      combosNine = combinationsForXForO(combosSeven);
    } else if (initialfilledspots === 3) {
      let combosFiveTemp = combinationsSingleForO(thisboard);
      if (combosFiveTemp.length === 0) {
        return;
      }
      combosFive = flattenArray(combosFiveTemp);
      let temparray = [];
      if (combosFive.length === 9 && !Array.isArray(combosFive[0])) {
        let isxwinner = checkforThree(combosFive, "x");
        if (isxwinner) {
          return;
        } else {
          return combosFive;
        }
      } else {
        for (let i = 0; i < combosFive.length; i++) {
          let aboard = combosFive[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosFive[i]);
          }
        }
      }
      combosFive = Array.from(temparray);
      let combosSevenTemp = combinationsForXForO(combosFive);

      if (combosSevenTemp.length === 0) {
        return;
      }
      combosSeven = flattenArray(combosSevenTemp);
      let temparray2 = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
        return combosSeven;
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray2.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray2);
      combosNine = combinationsForXForO(combosSeven);
    } else if (initialfilledspots === 5) {
      let combosSevenTemp = combinationsSingleForO(thisboard);
      combosSeven = flattenArray(combosSevenTemp);
      let temparray = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray);
      combosNine = combinationsForXForO(combosSeven);
    } else {
      combosNine = combinationsSingleForO(thisboard);
    }
    return combosNine;
  };
  return { available, fill, bestspotFinal, combinationsSingle, combos };
})();

console.log(betterai.bestspotFinal(aiboard, "x"));
