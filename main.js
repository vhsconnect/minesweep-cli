#!/usr/bin/env node

/*
Welcome to minesweep, a CLI based adventure based on the Windows 98 game.
*/

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let turnCount = 0
let theGrid = makeGrid(); // an array of board positions

assignBombs(theGrid);
assignNb(theGrid)
console.log(actualizeGrid(theGrid));

promptUser();



function promptUser() {
  rl.question("What move would you like to play next?", (ans) => {
    for (let each of theGrid) {
      if (each.position === ans) {
        each.isBomb ? terminate('lose') : (() => {
          each.flipped = true;
          console.log(`you picked ${ans}, pick a new tile`);
          console.log(actualizeGrid(theGrid));
          turnCount++;
          if (turnCount === 71) terminate();
          promptUser()
        })();
      }
    }
  })
}


function Tile(position, nb) {
  let tile = {};
  tile.position = position;
  tile.isBomb = false;
  tile.nb = nb;
  tile.nbCount = 0;
  tile.flipped = false;
  return tile;
}


function makeGrid() {
  let holder = 0;
  let rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  let cols = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let grid = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < cols.length; j++) {
      let position = rows[i] + cols[j];
      let nb = (() => { //create an array of neighboors
        let arr = [];
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            if (rows[x] + cols[y] === position) { continue; } //ignore self
            if (x >= 0 && x <= 8 && y >= 0 && y <= 8) { //check if neighboor exists
              arr.push(rows[x] + cols[y])
            }
          }
        }
        return arr;
      })()
      grid.push(Tile(position, nb))
    }
  }
  return grid;
}

//formats board from grid position array: theGrid
function actualizeGrid(arr) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    if (!(i % 9)) {
      str = str.concat('\n| ')
    }
    if (arr[i].flipped) str = str.concat(arr[i].nbCount + '  | ') //previously picked by user
    else str = str.concat(arr[i].position + ' | ') // unknown tile
  }
  return str;
}

function terminate(str = 'win') {
  str === 'lose' ? (() => {
    console.log('you LOSE, play again soon');
    rl.close()
  })() : (() => {
    console.log('You Win!')
  })()

}

//assigns bombs
function assignBombs(gridArr) {
  let bombs = 10;
  while (bombs !== 0) {
    for (let i = 0; i < gridArr.length; i++) {
      if (Math.floor(Math.random() * 10) === 7 && bombs) {
        gridArr[i].isBomb = true;
        bombs = bombs - 1;
      }
    }
  }
}

function assignNb(gridArr) {
  for (let each of gridArr) {
    checkNb(each)
  }
}

function checkNb(tile) {
  let bombCount = 0
  for (let each of theGrid) { //each obj in the grid
    for (let i = 0; i < tile.nb.length; i++) {
      if (each.position === tile.nb[i]) {
        if (each.isBomb) bombCount++;
      }
    }
  }
  tile.nbCount = bombCount;
}

