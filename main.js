
class VisibleNode extends Node {
  constructor(x1,y1) {
    let divRef = document.getElementById("items")
    super(divRef,x1,y1)
    this.updateInnerHTML()
  }
  onMouseMove() {
    super.onMouseMove()
    for(let i in this.edges) {
      this.edges[i].onMouseMove()
    }
  }
  updateInnerHTML() {
    let ref = document.getElementById(this.id)
    ref.innerHTML = `
    <div style="background-color: #2f2ff1; border: 1px solid #1313d3; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;">
      <p style="color: white">${0}<p>
    </div> 
    `
  }
}
class VisibleEdge extends Edge {
  constructor(u,v,capacity=0,flow=0,isInverse=false,lowerBound=0) {
    super(u,v,capacity,flow,isInverse,lowerBound)
    let divRef = document.getElementById("items")
    divRef.innerHTML += this.createHTML()
    this.updateInnerHTML()
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
    let x = (this.u.x + this.v.x)/2
    let y = (this.u.y + this.v.y)/2+ Y_ADJUST
    let lineRef = document.getElementById(this.id)
    lineRef.innerHTML = `
    <svg width="${maxX}px" height="${maxY}px">
      <line x1=${this.u.x} y1=${this.u.y+Y_ADJUST} x2=${this.v.x} y2=${this.v.y+Y_ADJUST} stroke="red"/>
    </svg>
    <div style="position: absolute; top: ${y}px; left: ${x}px;">
      <p style="color: red">${this.lowerBound}/${this.flow}/${this.capacity}</p>
    <div>
    `
  }
  onMouseMove() {
    this.updateInnerHTML()
  }
  delete() {
    document.getElementById(this.id).remove();
    super.delete()
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
    else if(findIntersectingLine(mousePosX,mousePosY,Edge.edgeList)) {
      document.body.style.cursor = "pointer"
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
    let edge = findIntersectingLine(mousePosX,mousePosY,Edge.edgeList)
    if(edge!=null) {edge.delete()}
  }
  mouseMoveFunc = (e) => {
    // if the mouse is hovering over a node, set the cursor accordingly
    if(findIntersecting(mousePosX,mousePosY,Draggable.draggableList)) {
        document.body.style.cursor = "pointer"
    }
    // check if the mouse is hovering over an edge
    else if(findIntersectingLine(mousePosX,mousePosY,Edge.edgeList)) {
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
        new VisibleEdge(selectedNode,obj)
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

  function calcIntersect(x1,y1,x2,y2,x,y) {
    let m1 = (y2 - y1)/(x2 - x1)
    let m2 = -1/m1 
    let c1 = y1 - m1*x1 
    let c2 = y - m2*x 
    // y = m1*x + c1
    // y = m2*x + c2
    // m1*x + c1 = m2*x + c2
    // x = (c2 - c1)/(m1 - m2)
    let resultX = (c2 - c1)/(m1 - m2)
    let resultY = m1*resultX + c1
    return {x:resultX,y:resultY}
}
function dist(x1,y1,x2,y2) {
    return Math.pow(Math.pow(x2-x1,2) + Math.pow(y2-y1,2),0.5)
}

function calcDistanceFromLine(x1,y1,x2,y2,x,y) {
    let intersect = calcIntersect(x1,y1,x2,y2,x,y)
    interX = intersect.x 
    interY = intersect.y
    if(interX>=Math.min(x1,x2) && interY>=Math.min(y1,y2) && interX<=Math.max(x1,x2) && interY<=Math.max(y1,y2)) {
        return dist(interX,interY,x,y)
    }
    else {
        return Math.min(dist(x1,y1,x,y),dist(x2,y2,x,y))
    }
}
function calcDistanceFromEdge(edge,x,y) {
  if(edge.u.x<edge.v.x) {
    return calcDistanceFromLine(edge.u.x,edge.u.y,edge.v.x,edge.v.y,x,y)
  }
  else {
    return calcDistanceFromLine(edge.v.x,edge.v.y,edge.u.x,edge.u.y,x,y)
  }
}

function findIntersectingLine(x,y,lineList,margin=10) {
  // loop through objects
  for(let index in lineList) {
      // if object intersects coords, return object
      line = lineList[index]
      if(calcDistanceFromEdge(line,x,y)<=margin) {
        return line
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
    let obj = new VisibleNode(mousePosX,mousePosY)
    obj.onMouseDown()
    currentMode = MOVE_MODE
  }
  function createLine() {
    currentMode = LINE_MODE 
  }
  function setMoveMode() {
    currentMode = MOVE_MODE
  }
  function setDeleteMode() {
    currentMode = DELETE_MODE
  }