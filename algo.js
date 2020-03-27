class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //Separate variables for print coordinates & mouse tracking
    this.printX = x * DRAWFACTOR;
    this.printY = y * DRAWFACTOR;
    this.isVisited = false;
    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    //In Dijkstra's algorithm, every node initializes with a distance of infinity
    this.distance = INFINITY;
    this.previous = undefined;
    this.isPath = false;
  }
}

class Grid {
  constructor() {
    this.startAlgo = false;
    this.array = [];
    for (let i = 0; i < NUMCOLS; i++) {
      this.array[i] = [];
      for (let j = 0; j < NUMROWS; j++) {
        this.array[i][j] = new Node(i, j);
      }
    }
    this.endFound = false;
    this.pathDrawn = false;
    this.impossible = false;
    this.startNode = this.array[8][12];
    this.startNode.isStart = true;
    this.endNode = this.array[30][18];
    this.endNode.isEnd = true;
    this.unvisited = [];

    this.startTime = undefined;
    this.time = undefined;
    this.timeFound = false;

    this.startNodePickedUp = false;
    this.endNodePickedUp = false;

    this.nowNode = undefined;

    for (let i = 0; i < NUMCOLS; i++) {
      for (let j = 0; j < NUMROWS; j++) {
        append(this.unvisited, this.array[i][j]);
      }
    }

    this.startNode.distance = 0;
    //REMOVE CURRENT NODE FROM ARRAY (tentatively done)

    this.currentNode = this.startNode;
    this.neighbours = [];
  }

  drawGrid() {
    fill(249, 200, 200);
    rectMode(CENTER);
    rect(width/2, 20, 900, 100);
    fill(62, 2, 2);
    text("Pathfinding Algorithm Visualization", width/2, 50);
    push();
    //Translating to center everything
    translate(TRANSLATEFACTOR, TRANSLATEFACTOR);
    noStroke();
    for (let i = 0; i < NUMCOLS; i++) {
      for (let j = 0; j < NUMROWS; j++) {
        if (this.array[i][j].isStart) {
          fill(221, 95, 108, DRAWOPACITY);
        } else if (this.array[i][j].isEnd) {
          fill(245, 131, 70, DRAWOPACITY);
        } else if(this.array[i][j].isWall){
          fill(68, 139, 167, DRAWOPACITY);
        }else if (this.array[i][j].isVisited) {
          fill(178, 224, 230, DRAWOPACITY/2);
        } else {
          fill(240, DRAWOPACITY);
        }

        if (this.array[i][j].isPath) {
          fill(252, 215, 137);
        }
        rectMode(CENTER);
        rect(this.array[i][j].printX, this.array[i][j].printY, DRAWFACTOR, DRAWFACTOR);
      }
    }
    pop();
  }
  doDijkstra() {
    for(let it = 0; it < 3; it++){
      if (this.unvisited.length > 0) {
        if(this.currentNode.isEnd){
          this.endFound = true;
          this.nowNode = this.endNode.previous;
          break;
        }else if(this.currentNode.isWall){
          this.currentNode = this.unvisited.shift();
          continue;
        }else if(this.currentNode.distance == INFINITY){
          this.impossible = true;
          continue;
        }
        this.currentNode.isVisited = true;

        if (this.currentNode.x + 1 < 40) {
          append(this.neighbours, this.array[this.currentNode.x + 1][this.currentNode.y]);
        }
        if (this.currentNode.y + 1 < 30) {
          append(this.neighbours, this.array[this.currentNode.x][this.currentNode.y + 1]);
        }
        if (this.currentNode.x - 1 >= 0) {
          append(this.neighbours, this.array[this.currentNode.x - 1][this.currentNode.y]);
        }
        if (this.currentNode.y - 1 >= 0) {
          append(this.neighbours, this.array[this.currentNode.x][this.currentNode.y - 1]);
        }
        for (let i = 0; i < this.neighbours.length; i++) {
          let temp = this.currentNode.distance + 1;
          if (temp < this.neighbours[i].distance) {
            this.neighbours[i].distance = temp;
            this.neighbours[i].previous = this.currentNode;
          }
        }
        this.neighbours = [];
        this.sortUnvisited();
        this.currentNode = this.unvisited.shift();
      }
    }
  }
  sortUnvisited() {
    this.unvisited.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  findPath(){
    if(this.nowNode != this.startNode){
      this.nowNode.isPath = true;
      this.nowNode = this.nowNode.previous;
    }else{
      this.pathDrawn = true;
    }
  }
  setStart(node){
    console.log("HI");
    this.startNode = node;
    node.isStart = true;
    node.distance = 0;
    this.currentNode = node;
  }setEnd(node){
    this.endNode = node;
    node.isEnd = true;
  }
}
