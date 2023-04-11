function rInt(a,b) {return Math.floor(Math.random() * (b+1-a)) + a}
function rChoice(list) {return list[Math.floor(Math.random() * list.length)];}

function genRandomID(length=12) {
  let result = ""
  for(let i = 0; i < length; i++) {
      result += String.fromCharCode(rChoice([rInt(48,57),rInt(65,90),rInt(97,122)]))
  }
  return result 
}

class Node extends Draggable {
  static nodeList = []
  static nodeHTML = `
    <div style="background-color: #2f2ff1; border: 1px solid #1313d3; width: 50px; height: 50px">
    </div> 
  `
  constructor(x1,y1) {
    let divRef = document.getElementById("items")
    super(divRef,"node"+genRandomID(),x1,y1,Node.nodeHTML)
    Node.nodeList.push(this)
    this.edges = []
  }
  delete() {
    super.delete()
    let edgeCopy = [...this.edges]
    for(let i in edgeCopy) {
      edgeCopy[i].delete()
    }
    Node.nodeList.splice(Node.nodeList.indexOf(this), 1);
  }
  onMouseMove() {
    super.onMouseMove()
    for(let i in this.edges) {
      this.edges[i].onMouseMove()
    }
  }
}
// ----------------------------------------------------
class Edge extends CoordObject {

  constructor(u,v) {
    let divRef = document.getElementById("items")
    super("edge"+genRandomID())
    this.u = u 
    this.v = v 
    divRef.innerHTML += this.createHTML()
    this.updateInnerHTML()
    this.u.edges.push(this)
    this.v.edges.push(this)
  }
  createHTML() {
    return `
    <div id=${this.id} style="position: absolute; z-index: -1">
    </div>
    `
  }
  updateInnerHTML() {
    let Y_ADJUST = -110 // needed to ensure that the line aligns properly
    let maxX = Math.max(this.u.x,this.v.x)
    let maxY = Math.max(this.u.y,this.v.y) + Y_ADJUST
    let lineRef = document.getElementById(this.id)
    lineRef.innerHTML = `
    <svg width="${maxX}px" height="${maxY}px">
      <line x1=${this.u.x} y1=${this.u.y+Y_ADJUST} x2=${this.v.x} y2=${this.v.y+Y_ADJUST} stroke="red"/>
    </svg>
    `
  }
  onMouseMove() {
    this.updateInnerHTML()
  }

  delete() {
    document.getElementById(this.id).remove();
    this.u.edges.splice(this.u.edges.indexOf(this), 1);
    this.v.edges.splice(this.v.edges.indexOf(this), 1);
  }
}


// ----------------------------------------------------

class Mode {
  constructor(id,onMouseDown=(e)=>{},onMouseMove=(e)=>{},onMouseUp=(e)=>{}) {
    modeDict[id] = this 
    this.onMouseDown = onMouseDown
    this.onMouseMove = onMouseMove
    this.onMouseUp = onMouseUp
  }
  onMouseDown(e) {
    this.onMouseDown(e)
  }
  onMouseMove(e) {
    this.onMouseMove(e)
  }
  onMouseUp(e) {
    this.onMouseUp(e)
  }
}
let mouseDownFunc = null; let mouseMoveFunc = null; let mouseUpFunc = null; 


// ----------------------------------------------------

mouseDownFunc = (e) => {
  // only run if nothing is selected
  if(Draggable.selectedDraggable==null) {
    // get mouse position
    // start dragging obj if an obj is selected
    let obj = findIntersecting(mousePosX,mousePosY,Draggable.draggableList)
    if(obj!=null) {
      obj.onMouseDown()
    }
  }
}
mouseMoveFunc = (e) => {
  // if a card is selected, move it
  if(Draggable.selectedDraggable!=null) {
    Draggable.selectedDraggable.onMouseMove();
  }
  // if the mouse is hovering over a card, set the cursor accordingly
  if(findIntersecting(mousePosX,mousePosY,Draggable.draggableList)) {
    document.body.style.cursor = "move"
  }
}
mouseUpFunc = (e) => {
  // release card
  if(Draggable.selectedDraggable!=null) {
    Draggable.selectedDraggable.onMouseUp();
  }
}
new Mode(MOVE_MODE,mouseDownFunc,mouseMoveFunc,mouseUpFunc)

// ----------------------------------------------------

mouseDownFunc = (e) => {
  let obj = findIntersecting(mousePosX,mousePosY,Draggable.draggableList)
  if(obj!=null) {obj.delete()}
}
mouseMoveFunc = (e) => {
  // if the mouse is hovering over a card, set the cursor accordingly
  if(findIntersecting(mousePosX,mousePosY,Draggable.draggableList)) {
      document.body.style.cursor = "pointer"
  }
}

new Mode(DELETE_MODE,mouseDownFunc,mouseMoveFunc)

// ----------------------------------------------------
mouseDownFunc = (e) => {
  let obj = findIntersecting(mousePosX,mousePosY,Draggable.draggableList)
  if(obj!=null) 
  {
    if(selectedNode==null) {
      selectedNode = obj 
    }
    else {
      new Edge(selectedNode,obj)
      selectedNode = null 
    }
  }
}
mouseMoveFunc = (e) => {
  // if the mouse is hovering over a card, set the cursor accordingly
  if(findIntersecting(mousePosX,mousePosY,Draggable.draggableList)) {
      document.body.style.cursor = "crosshair"
  }
}
new Mode(LINE_MODE,mouseDownFunc,mouseMoveFunc)
// ----------------------------------------------------

function pointIntersects(x,y,obj) {
  return x>=obj.x1 && y>=obj.y1 && x<=obj.x2 && y<=obj.y2
}
function findIntersecting(x,y,objList) {
  // loop through objects
  for(let index in objList) {
      // if object intersects coords, return object
      if(pointIntersects(x,y,objList[index])) {
        return objList[index]
      }
  }
  return null
}

// ----------------------------------------------------

function onMouseDown(e) {
  // do something based on mode
  modeDict[currentMode].onMouseDown(e)
}

function onMouseMove(e) {
  // update current mouse position
  mousePosX = e.clientX
  mousePosY = e.clientY
  // set default mouse 
  document.body.style.cursor = "auto"
  // do something based on mode
  modeDict[currentMode].onMouseMove(e)
}

function onMouseUp(e) {
  // do something based on mode
  modeDict[currentMode].onMouseUp(e)
}

// set event listeners
document.onmousedown = onMouseDown;
document.onmousemove = onMouseMove;
document.onmouseup = onMouseUp;


function createNewDraggable() {
  let obj = new Node(mousePosX,mousePosY)
  obj.onMouseDown()
  currentMode = MOVE_MODE
}
function createLine() {
  //new Edge(Node.nodeList[0],Node.nodeList[1])
  currentMode = LINE_MODE 
}
function setMoveMode() {
  currentMode = MOVE_MODE
}
function setDeleteMode() {
  currentMode = DELETE_MODE
}