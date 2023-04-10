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
  }
  delete() {
    super.delete()
    Node.nodeList.splice(Node.nodeList.indexOf(this), 1);
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

function setMoveMode() {
  currentMode = MOVE_MODE
}
function setDeleteMode() {
  currentMode = DELETE_MODE
}