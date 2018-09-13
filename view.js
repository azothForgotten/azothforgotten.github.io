function addValues() {
  var theDifficulty = document.getElementById("difficulty");
  var bomb = document.getElementById("bomb");
  var dimension = document.getElementById("dimension");
  if (theDifficulty.value == "beginner") {
    dimension.value = 8;
    bomb.value = 10;
  }
  if (theDifficulty.value == "intermediate") {
    dimension.value = 12;
    bomb.value = 25;
  }
  if (theDifficulty.value == "expert") {
    dimension.value = 16;
    bomb.value = 50;
  }
};
function saveSettings() {
  var bomb = document.getElementById("bomb");
  var dimension = document.getElementById("dimension");
  if (dimension.value < 1) {
    alert('There must be at least 1 square per side.');
  }
  else if ((bomb.value > (dimension.value*dimension.value)) || bomb.value < 0) {
    alert('Number of bombs must be between 0 and ' + (dimension.value*dimension.value));
  }
  else {
    localStorage.setBombs = bomb.value;
    localStorage.setDimensions = dimension.value;
    window.location.assign("randomgame.html");
  }
};
function createGrid() {
  var gameGrid = document.getElementById("gameGrid");
  var gameOver = document.getElementById("gameover");
  var dimension = Number(localStorage.setDimensions);
  var bomb = Number(localStorage.setBombs);
  var xGridSize = dimension;
  var yGridSize = dimension;
  var bombs = bomb;
  gameGrid.innerHTML = generateGrid(xGridSize,yGridSize);
  var gridder = new gameGridObj(xGridSize,yGridSize,bombs);
  addClickHandler(gridder);
  refreshModel(gridder);
  gameOver.innerHTML = "";
};
function goGameSettings() {
  window.location.assign('gamesettings.html');
};
function generateGrid(xLength,yLength){
  var returnHtml = "";
  var checker = false;
  var i = 0;
  var j = 0;
  for (i = 0; i < yLength; i++) {
    returnHtml += "<tr>";
    for (j = 0; j < xLength; j++) {
        returnHtml += "<td class=\"UnClicked Game\"></td>";
    }
    returnHtml += "</tr>";
  }
  returnHtml += "</table>";
  return returnHtml;
};
function refreshModel(gridder) {
  var displayBombs = document.getElementById("bombNumber");
  var displayFlags = document.getElementById("flagNumber");
  displayBombs.innerHTML = gridder.getBombs();
  displayFlags.innerHTML = gridder.getFlags();
  var cells = gridder.getCellArray();
  for (var col = 0; col < cells.length; col++) {
    for (var row = 0; row < cells[col].length; row++) {
      var cellObj = gridder.getCell(col,row);
      var cell = gameGrid.rows[row].cells[col];
      if (cellObj.isFlagged) {
        cell.innerHTML = '<img src="flag.png">';
      }
      if (!cellObj.isFlagged) {
        cell.innerHTML = "";
        if (cellObj.isClicked && !cellObj.isBomb) {
          cell.className = 'Game Clicked';
          if (cellObj.adjacentBombs > 0) {
            cell.innerHTML = cellObj.adjacentBombs;
          }
        }
        if (cellObj.isClicked && cellObj.isBomb) {
          cell.innerHTML = '<img src="bomb2.png">';
          cell.className = 'Game Clicked';
        }
      }
    }
  }
};
function checkEndGame(gridder) {
  var gameOver = document.getElementById('gameover');
  if (gridder.checkGameProgress()) {
    if (gridder.checkWin()) {
      gameOver.innerHTML = '<b>YOU WIN!</b>';
    }
    else {
      gameOver.innerHTML = '<b>Sorry... Game Over</b>';
    }
  }
};
function addClickHandler(gridder) {
  var cells = document.getElementsByTagName("td");
  var i = 0;
  for (i = 0; i < cells.length;i++) {
    if (!gridder.isOver
        && cells[i].id != 'bombLabel'
        && cells[i].id != 'bombRow'
        && cells[i].id != 'dimensionLabel'
        && cells[i].id != 'dimensionRow'
        && cells[i].id != 'displayBombs'
        && cells[i].id != 'displayFlags'
        ) {
      cells[i].onclick = function() {
        var col = this.cellIndex;
        var row = this.parentNode.rowIndex;
        var cellObj = gridder.getCell(col,row);
        cellObj.clickMe();
        refreshModel(gridder);
        if (cellObj.isBomb && !cellObj.isFlagged && !gridder.soundPlayed()) {
          document.getElementById('bombsound').play();
        }
        var displayDiv = document.getElementById("displayClickedCell");
        displayDiv.innerHTML = "Clicked Cell: (" + (col+1) + "," + (row+1) + ")";
        checkEndGame(gridder);
      }
      cells[i].oncontextmenu = function() {
        var col = this.cellIndex;
        var row = this.parentNode.rowIndex;
        var cellObj = gridder.getCell(col,row);
        cellObj.flagMe();
        refreshModel(gridder);
        checkEndGame(gridder);
      }
    }
  }
};
function makeTitle() {
  var newHeader = document.getElementById("newHeader");
  var showInput = document.getElementById("showInput");
  showInput.innerHTML = newHeader.value;
};
function createGridfromXML() {
  var gameGrid = document.getElementById("gameGrid");
  var description = document.getElementById("description");
  var gameOver = document.getElementById("gameover");
  gameGrid.innerHTML = generateGrid(8,8);
  var gridder = new gameGridObj(8,8,10);
  addClickHandler(gridder);
  var request = new XMLHttpRequest();
  request.open("GET", "game.xml", false);
  request.send(null);
  var gamexml = request.responseXML;
  var gamedescription = gamexml.getElementsByTagName("description")[0];
  description.innerHTML = "<br>" + gamedescription.firstChild.data + "<br>";
  gameOver.innerHTML = "";
  var gamecolumns = gamexml.getElementsByTagName("column");
  for (var col = 0; col < gamecolumns.length; col++) {
    var gamecolumn = gamecolumns[col];
    var gamerows = gamecolumn.getElementsByTagName("row");
    for (var row = 0; row < gamerows.length; row++) {
      var cell = gridder.getCell(col,row);
      var bomb = false;
      var aBombs = 0;
      var gamerow = gamerows[row];
      var rowbomb = gamerow.getElementsByTagName("bomb")[0];
      var rowaj = gamerow.getElementsByTagName("adjacentbombs")[0];
      if (rowbomb.firstChild.data == "true") {
        cell.makeBomb();
      } else cell.unMakeBomb();
      cell.setAdjacent(rowaj.firstChild.data);
    }
  }
  refreshModel(gridder);
};
