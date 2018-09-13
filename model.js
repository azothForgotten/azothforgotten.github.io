var gameGridObj = function(xLength, yLength, bombs) {
    this.x = xLength;
    this.y = yLength;
    this.bombs = bombs;
    this.flags = 0;
    this.isOver = false;
    this.cellArray = [];
    this.sound = false;
    this.createGridArray();
    this.plantBombs();
};
gameGridObj.prototype.createGridArray = function() {
    this.i = 0;
    this.j = 0;
    for (this.i = 0; this.i < this.y; this.i++) {
      this.cellArray[this.i] = [];
      for (this.j = 0; this.j < this.x; this.j++) {
        this.cellArray[this.i][this.j] = new cellObj(this.j,this.i,this);
      }
    }
};
gameGridObj.prototype.getCellArray = function() {
  return this.cellArray;
};
gameGridObj.prototype.getCell = function(x,y) {
  if (x < this.x && y < this.y) {
    return this.cellArray[y][x];
  }
};
gameGridObj.prototype.getFlags = function() {
  return this.flags;
};
gameGridObj.prototype.getBombs = function() {
  return this.bombs;
};
gameGridObj.prototype.soundPlayed = function() {
  if (!this.sound) {
    this.sound = true;
    return false;
  } else return this.sound;
};
gameGridObj.prototype.checkGameProgress = function() {
  var returnValue = true;
  for (this.i = 0; this.i < this.y; this.i++) {
    for (this.j = 0; this.j < this.x; this.j++) {
      var cell = this.cellArray[this.i][this.j];
      if (cell.isBomb && cell.isClicked) {
        return true;
      }
      else if (cell.isBomb && !cell.isFlagged) {
        returnValue = false;
      } else if (!cell.isClicked && !cell.isFlagged) {
        returnValue = false;
      } else if (cell.isFlagged && !cell.isBomb) {
        returnValue = false;
      }
    }
  }
  this.isOver = returnValue;
  return returnValue;
};
gameGridObj.prototype.checkWin = function() {
  for (this.i = 0; this.i < this.y; this.i++) {
    for (this.j = 0; this.j < this.x; this.j++) {
      var cell = this.cellArray[this.i][this.j];
      if (cell.isBomb && cell.isClicked) {
        return false;
      }
    }
  }
  return true;
};
gameGridObj.prototype.plantBombs = function() {
  var count = this.bombs;
  while (count != 0) {
      var randomX = Math.floor((Math.random()*this.x));
      var randomY = Math.floor((Math.random()*this.y));
      var cellObj = this.getCell(randomX,randomY);
      if (!cellObj.isBomb) {
          count--;
          cellObj.makeBomb();
          var adjacentCells = this.getAdjacentCells(randomX,randomY);
          for (var i = 0; i < adjacentCells.length; i++) {
            var adjacentCell = adjacentCells[i];
            if (adjacentCell != null) {
              adjacentCell.addBomb();
            }
          }
      }
  }
};
gameGridObj.prototype.getAdjacentCells = function(x,y) {
  var adjacentCells = new Array();
  if (x-1 >= 0) {
    adjacentCells.push(this.getCell(x-1,y));
    if (y-1 >= 0) {
      adjacentCells.push(this.getCell(x-1,y-1));
    }
    if (y+1 <= this.y) {
      adjacentCells.push(this.getCell(x-1,y+1));
    }
  }
  if (x+1 <= this.x) {
    adjacentCells.push(this.getCell(x+1,y));
    if (y-1 >= 0) {
      adjacentCells.push(this.getCell(x+1,y-1));
    }
    if (y+1 <= this.y) {
      adjacentCells.push(this.getCell(x+1,y+1));
    }
  }
  if (y-1 >= 0) {
    adjacentCells.push(this.getCell(x,y-1));
  }
  if (y+1 <= this.y) {
    adjacentCells.push(this.getCell(x,y+1));
  }
  return adjacentCells;
};
gameGridObj.prototype.addFlag = function() {
  this.flags += 1;
};
gameGridObj.prototype.removeFlag = function() {
  this.flags -= 1;
};
var cellObj = function(x,y,grid) {
    this.x = x;
    this.y = y;
    this.isFlagged = false;
    this.isBomb = false;
    this.isClicked = false;
    this.adjacentBombs = 0;
    this.gameGrid = grid;
    this.makeBomb = function() {
      this.isBomb = true;
    };
    this.unMakeBomb = function() {
      this.isBomb = false;
    };
    this.setAdjacent = function(bombs) {
      this.adjacentBombs = bombs;
    };
    this.addBomb = function() {
      this.adjacentBombs += 1;
    };
    this.flagMe = function() {
      if (!this.gameGrid.isOver && !this.isClicked) {
        if (this.isFlagged) {
          this.isFlagged = false;
          this.gameGrid.removeFlag();
        } else {
          this.isFlagged = true;
          this.gameGrid.addFlag();
        }
      }
    };
    this.clickMe = function() {
      if (!this.isFlagged && !this.gameGrid.isOver) {
        this.isClicked = true;
        if (this.adjacentBombs == 0 && !this.isBomb) {
          var adjacentCells = this.gameGrid.getAdjacentCells(this.x,this.y);
          for (var i = 0; i < adjacentCells.length; i++) {
            var adjacentCell = adjacentCells[i];
            if (adjacentCell != null && !adjacentCell.isClicked) {
              adjacentCell.clickMe();
            }
          }
        } else if (this.isBomb && !this.gameGrid.isOver) {
          this.gameGrid.isOver = true;
        }
      }
    };
};
