// CodingTrain tutorials used as guidance

// Set canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 720;
canvas.height = 720;
document.body.appendChild(canvas);

canvas.style = "position:absolute; left: 50%; margin-left: -360px; margin-top: 30px";

//var color = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',';
}

var color = random_rgba(); 
var strokeColor = color + '1)';
var visitedColor = color + '0.3)';
var currentColor = color + '0.6)';

// Calculate number of columns and row that make up the grid
var widthOfCell = 30;
var heightOfCell = 30;
var numberOfColumns = Math.floor(canvas.width/widthOfCell);
var numberOfRows = Math.floor(canvas.height/heightOfCell);

// Function to allow us to easily draw a line for a wall
function drawWall(startX, startY, endX, endY) {
  ctx.strokeStyle = strokeColor;

  ctx.beginPath();

  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// For loop to draw each cell in the grid array
function drawMaze() {
  // Clear maze first
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var cellIndex = 0; cellIndex < grid.length; cellIndex++) {
    var xCoordinate = grid[cellIndex].column * widthOfCell;
    var yCoordinate = grid[cellIndex].row * heightOfCell;

    if(grid[cellIndex].visited) {
      ctx.fillStyle = visitedColor;
      ctx.fillRect(xCoordinate, yCoordinate, widthOfCell, heightOfCell);
    }
    if (grid[cellIndex].topWall)
      drawWall(xCoordinate, yCoordinate, xCoordinate + widthOfCell, yCoordinate);
  
    if (grid[cellIndex].rightWall)
      drawWall(xCoordinate + widthOfCell, yCoordinate, xCoordinate + widthOfCell, yCoordinate + heightOfCell);
  
    if (grid[cellIndex].bottomWall)
      drawWall(xCoordinate, yCoordinate + heightOfCell, xCoordinate + widthOfCell, yCoordinate + heightOfCell);
  
    if (grid[cellIndex].leftWall)
      drawWall(xCoordinate, yCoordinate, xCoordinate, yCoordinate + heightOfCell);
  }
}

function removeWall(current, neighbour) {
  var columnDifference = current.column - neighbour.column;
  
  if (columnDifference === 1) { // Neighbour is on the left
    current.leftWall = false;
    neighbour.rightWall = false;
  }
  else if (columnDifference === -1) { // Neighbour is on the right
    current.rightWall = false;
    neighbour.leftWall = false;
  }

  var rowDifference = current.row - neighbour.row; 
  if (rowDifference === 1) { // Neighbour is on the top
    current.topWall = false;
    neighbour.bottomWall = false;
  }
  else if (rowDifference === -1) { // Neightbour is on the bottom
    current.bottomWall = false;
    neighbour.topWall = false;
  }
}

// Constructor for a cell object
function Cell(row, column, top, right, bottom, left, visitedSatus) {
  this.row = row;
  this.column = column;

  this.topWall = top;
  this.rightWall = right;
  this.bottomWall = bottom;
  this.leftWall = left;

  this.visited = visitedSatus;

  this.highlight = function(highlightColor) {
    var xCoordinate = column * widthOfCell;
    var yCoordinate = row * heightOfCell;
    ctx.fillStyle = highlightColor;
    ctx.fillRect(xCoordinate, yCoordinate, widthOfCell, heightOfCell);
  }

  this.unhighlight = function() {
    var xCoordinate = column * widthOfCell;
    var yCoordinate = row * heightOfCell;
    ctx.fillStyle = visitedColor;
    ctx.fillRect(xCoordinate, yCoordinate, widthOfCell, heightOfCell);
  }
}

// Function to create the required amount of cells and places it into a grid array
function createGrid() {
  // Array to store the cells
  var grid = [];


  // Nested for loops to create each cell of the grid
  // Each cell is then pushed onto the grid array
  for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
      var cell = new Cell(rowIndex, columnIndex, true, true, true, true, false);
      grid.push(cell);
    }
  }

  return grid;
}

function index(column, row) {
  if (column < 0 || row < 0 || column > numberOfColumns - 1 || row > numberOfRows)
    return -1;

  return column + row * numberOfColumns;
}

// Returns true if there is an unvisited neighbour
function checkNeighbours(cell) {
  var unvisitedNeighbours = [];

  var topNeighbour  = grid[index(cell.column, cell.row - 1)];
  var rightNeighbour = grid[index(cell.column + 1, cell.row)];
  var bottomNeighbour = grid[index(cell.column, cell.row + 1)];
  var leftNeighbour = grid[index(cell.column - 1, cell.row)];

  if (topNeighbour && !topNeighbour.visited)
    unvisitedNeighbours.push(topNeighbour);

  if (rightNeighbour && !rightNeighbour.visited)
    unvisitedNeighbours.push(rightNeighbour);

  if (bottomNeighbour && !bottomNeighbour.visited)
   unvisitedNeighbours.push(bottomNeighbour);
  
  if (leftNeighbour && !leftNeighbour.visited)
    unvisitedNeighbours.push(leftNeighbour);

  return unvisitedNeighbours;
}

grid = createGrid();

// Variable to hold the current cell
var current;

// Stack structure to allow us to pop and push cells
var cellStack = [];

// Stack structure to allow us to pop and push cells
var cellStack2 = [];

// Keepting track of the number of unvisited cells, algorithm stops when all cells have been visited
var numberOfUnvisitedCells = numberOfColumns * numberOfRows;

drawMaze();

currentCell = grid[0];
currentCell.visited = true;
numberOfUnvisitedCells--;

currentCell2 = grid[23];
currentCell2.visited = true;
numberOfUnvisitedCells--;

const frame = setInterval(backTrack, 15);
const frame2 = setInterval(backTrack2, 15);

// Algorithm that facilitates the creation of a maze
function backTrack() {
  if(numberOfUnvisitedCells != 0) {
    var unvisitedNeighbours = checkNeighbours(currentCell);

    if (unvisitedNeighbours.length > 0) {
      var chosenCell = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
      cellStack.push(currentCell);
      removeWall(currentCell, chosenCell);
      currentCell = chosenCell;
      currentCell.visited = true;
      numberOfUnvisitedCells--;
    }
    else {
      currentCell = cellStack.pop();
    }
    drawMaze();
    currentCell.highlight('blue');
  }
  else
  {
    currentCell = {};
    drawMaze();
    clearInterval(frame);;
  }
}

// Algorithm that facilitates the creation of a maze
function backTrack2() {
  if(numberOfUnvisitedCells != 0) {
    var unvisitedNeighbours = checkNeighbours(currentCell2);

    if (unvisitedNeighbours.length > 0) {
      var chosenCell = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
      cellStack2.push(currentCell2);
      removeWall(currentCell2, chosenCell);
      currentCell2 = chosenCell;
      currentCell2.visited = true;
      numberOfUnvisitedCells--;
    }
    else {
      currentCell2 = cellStack2.pop();
    }
    drawMaze();
    currentCell2.highlight('red');
  }
  else
  {
    currentCell2 = {};
    drawMaze();
    clearInterval(frame2);;
  }
}






