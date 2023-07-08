
class VisibleNode extends Node {
  static visibleNodeList = []
  constructor(x1,y1) {
    let divRef = document.getElementById("items")
    super(divRef,x1,y1)
    VisibleNode.visibleNodeList.push(this)
    this.updateInnerHTML()
  }
  onMouseMove() {
    super.onMouseMove()
    for(let i in this.edges) {
      if(this.edges[i] instanceof VisibleEdge) {
        this.edges[i].onMouseMove()
      }
    }
  }
  updateInnerHTML() {
    let ref = document.getElementById(this.id)
    ref.innerHTML = `
    <div style="${this.getBackgroundStyle()} width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;">
      <p style="color: white">${this.demand}<p>
    </div> 
    `
  }

  delete() {
    VisibleNode.visibleNodeList.splice(VisibleNode.visibleNodeList.indexOf(this), 1);
    super.delete()
  }

  getBackgroundStyle() {
    if(this.isFullFlow()) {
      return "background-color: #2fe12f; border: 1px solid #13c313;"
    }
    else {
      return "background-color: #2f2fe1; border: 1px solid #1313d3;"
    }
  }

  get demand() {return super.demand}
  set demand(demand) {super.demand = demand; this.updateInnerHTML()}
}
class VisibleEdge extends Edge {
  static visibleEdgeList = []
  constructor(u,v,capacity=0,flow=0,isInverse=false,lowerBound=0) {
    super(u,v,capacity,flow,isInverse,lowerBound)
    VisibleEdge.visibleEdgeList.push(this)
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
    <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="red" />
        </marker>
      </defs>
      <line x1=${this.u.x} y1=${this.u.y+Y_ADJUST} x2=${this.v.x} y2=${this.v.y+Y_ADJUST} stroke="red" marker-end="url(#arrow)"/>
      <line x1="${this.u.x}" y1="${this.u.y+Y_ADJUST}" x2="${x}" y2="${y}" stroke="red" marker-end="url(#arrow)" />
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
    VisibleEdge.visibleEdgeList.splice(VisibleEdge.visibleEdgeList.indexOf(this), 1);
    super.delete()
  }
  set flow(flow) {super.flow = flow; this.updateInnerHTML()}
  set capacity(capacity) {super.capacity = capacity; this.updateInnerHTML()}
  set lowerBound(lowerBound) {super.lowerBound = lowerBound; this.updateInnerHTML()}

  get flow() {return super.flow;}
  get capacity() {return super.capacity;}
  get lowerBound() {return super.lowerBound;}
}
// ----------------------------------------------------

class SubMenu extends Draggable {
  static subMenuList = []
  constructor() {
    let divRef = document.getElementById("items")
    super(divRef,"SubMenu"+genRandomID(),0,200,'')
    SubMenu.subMenuList.push(this)
    this.updateInnerHTML() 
  }
  static findSubMenuByID(id) {
    for(let i in this.subMenuList) {
      let subMenu = this.subMenuList[i]
      if(id==subMenu.id) {
        return subMenu
      }
    }
    return null
  }
  static deleteSubMenu(val) {
    SubMenu.findSubMenuByID(val).delete()
  }
  updateInnerHTML(dataHTML="") {
    let menuRef = document.getElementById(this.id)
    menuRef.innerHTML += `
      <div class="card">
        <div class="card-body">
        <div style="display: flex; justify-content: flex-end">
          <button id="${this.id+"button"}" class="transparentIcon">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
          ${dataHTML}
        </div>
      </div>
    `
    let menu = this
    document.getElementById(this.id+"button").addEventListener("click", function(){ menu.delete() });
  }
  delete() {
    super.delete()
    SubMenu.subMenuList.splice(SubMenu.subMenuList.indexOf(this), 1);
  }
}

class NodeSubMenu extends SubMenu {
  constructor(node) {
    super()
    this.node = node
    this.setStartValues()
  }
  updateInnerHTML() {
    let html = `
      <p>Node</p>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Demand</span>
        <input id="${this.id + "inputDemand"}" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
    `
    super.updateInnerHTML(html)
    document.getElementById(this.id + "inputDemand").addEventListener('change', (e) => this.node.demand = Number(document.getElementById(this.id + "inputDemand").value))
    
  }
  setStartValues() {
    document.getElementById(this.id + "inputDemand").value = this.node.demand
  }
}

class EdgeSubMenu extends SubMenu {
  constructor(edge) {
    super() 
    this.edge = edge
    this.setStartValues()
  }
  updateInnerHTML() {
    let html = `
      <p>Edge</p>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Lower Bound</span>
        <input id="${this.id + "inputLowerBound"}" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
        </input>
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Capacity</span>
        <input id="${this.id + "inputCapacity"}" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
      </div>
    `
    super.updateInnerHTML(html)
    document.getElementById(this.id + "inputLowerBound").addEventListener('change', (e) => this.edge.lowerBound = Number(document.getElementById(this.id + "inputLowerBound").value))
    document.getElementById(this.id + "inputCapacity").addEventListener('change', (e) => this.edge.capacity = Number(document.getElementById(this.id + "inputCapacity").value))
  }
  setStartValues() {
    document.getElementById(this.id + "inputLowerBound").value = this.edge.lowerBound
    document.getElementById(this.id + "inputCapacity").value = this.edge.capacity
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
      // start dragging obj if an obj is selected
      let obj = findIntersecting(mousePosX,mousePosY,SubMenu.subMenuList)
      if(obj!=null) {obj.onMouseDown()}
    }
    // if the mouse isn't hovering over an existing submenu
    if(findIntersecting(mousePosX,mousePosY,SubMenu.subMenuList)==null) {
      // open menu if clicked
      let node = findIntersecting(mousePosX,mousePosY,Node.nodeList)
      let edge = findIntersectingLine(mousePosX,mousePosY,VisibleEdge.visibleEdgeList)
      // only one menu at a time
      if(node!=null || edge!=null) {
        if(SubMenu.subMenuList.length>0) {
          SubMenu.subMenuList[0].delete()
        }
      }
      if(node!=null) {new NodeSubMenu(node)}
      else if(edge!=null) {new EdgeSubMenu(edge)}
    }

  }
  mouseMoveFunc = (e) => {
    // if a card is selected, move it
    if(Draggable.selectedDraggable!=null) {
      Draggable.selectedDraggable.onMouseMove();
    }
    // show nodes and edges as selectable
    if(findIntersecting(mousePosX,mousePosY,Node.nodeList)) {
      document.body.style.cursor = "pointer"
    }
    else if(findIntersectingLine(mousePosX,mousePosY,VisibleEdge.visibleEdgeList)) {
      document.body.style.cursor = "pointer"
    }
  }
  mouseUpFunc = (e) => {
    // release card
    if(Draggable.selectedDraggable!=null) {
      Draggable.selectedDraggable.onMouseUp();
    }
  }
  new Mode(SELECT_MODE,mouseDownFunc,mouseMoveFunc,mouseUpFunc)
  // ---------------------------------------------------
  
  mouseDownFunc = (e) => {
    // only run if nothing is selected
    if(Draggable.selectedDraggable==null) {
      // start dragging obj if an obj is selected
      let obj = findIntersecting(mousePosX,mousePosY,Draggable.draggableList)
      if(obj!=null) {obj.onMouseDown()}
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
    let obj = findIntersecting(mousePosX,mousePosY,Node.nodeList)
    if(obj!=null) {obj.delete()}
    let edge = findIntersectingLine(mousePosX,mousePosY,VisibleEdge.visibleEdgeList)
    if(edge!=null) {edge.delete()}
  }
  mouseMoveFunc = (e) => {
    // if the mouse is hovering over a node, set the cursor accordingly
    if(findIntersecting(mousePosX,mousePosY,Node.nodeList)) {
        document.body.style.cursor = "pointer"
    }
    // check if the mouse is hovering over an edge
    else if(findIntersectingLine(mousePosX,mousePosY,VisibleEdge.visibleEdgeList)) {
      document.body.style.cursor = "pointer"
    }
  }
  
  new Mode(DELETE_MODE,mouseDownFunc,mouseMoveFunc)
  
  // ----------------------------------------------------
  mouseDownFunc = (e) => {
    let obj = findIntersecting(mousePosX,mousePosY,Node.nodeList)
    if(obj!=null) 
    {
      if(selectedNode==null) {
        selectedNode = obj 
      }
      else {
        new VisibleEdge(selectedNode,obj,defaultCapacity,0,false,defaultLowerBound)
        selectedNode = null 
      }
    }
  }
  mouseMoveFunc = (e) => {
    // if the mouse is hovering over a card, set the cursor accordingly
    if(findIntersecting(mousePosX,mousePosY,Node.nodeList)) {
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
function simulate() {
  g = new Graph()
  g.fordFulkerson()
  for(let node of VisibleNode.visibleNodeList) {
    node.updateInnerHTML()
  }
}
function setSelectMode() {
  currentMode = SELECT_MODE 
}
function createNewDraggable() {
  let obj = new VisibleNode(mousePosX,mousePosY)
  obj.demand = defaultDemand
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

let settings = document.getElementById("settings")
let settingsDemand = document.getElementById("settingsDemand")
let settingsCapacity = document.getElementById("settingsCapacity")
let settingsLowerBound = document.getElementById("settingsLowerBound")

function toggleSettingsVisiblity() {
  if(settings.style.visibility == "hidden") {showSettings()}
  else {hideSettings()}
}

function showSettings() {
  settings.style.visibility = "visible"
  
}
function hideSettings() {
  settings.style.visibility = "hidden"
}

hideSettings()

settingsDemand.value = defaultDemand
settingsCapacity.value = defaultCapacity
settingsLowerBound.value = defaultLowerBound

settingsDemand.addEventListener('change', (e) => defaultDemand = Number(settingsDemand.value))
settingsCapacity.addEventListener('change', (e) => defaultCapacity = Number(settingsCapacity.value))
settingsLowerBound.addEventListener('change', (e) => defaultLowerBound = Number(settingsLowerBound.value))


// generate tooltips
let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

function generateTestData() {
  u1 = new VisibleNode(150,100)
  u2 = new VisibleNode(100,200)
  u3 = new VisibleNode(200,200)
  u4 = new VisibleNode(150,300)
  u5 = new VisibleNode(50,300)
  e1 = new VisibleEdge(u1,u2,3)
  e2 = new VisibleEdge(u1,u3,3)
  e3 = new VisibleEdge(u2,u3,2)
  e4 = new VisibleEdge(u2,u4,3)
  e5 = new VisibleEdge(u3,u4,2)
  e6 = new VisibleEdge(u4,u5,2)
  e7 = new VisibleEdge(u5,u2,2)

  u1.demand = -4
  u2.demand = -3
  u3.demand = 2
  u4.demand = 5
}

function generateTestData2() {
  u1 = new VisibleNode(200,100)
  u2 = new VisibleNode(100,300)
  u3 = new VisibleNode(300,300)
  u4 = new VisibleNode(200,500)

  e1 = new VisibleEdge(u1,u2,3,0,false,1)
  e2 = new VisibleEdge(u1,u3,3,0,false,1)
  e3 = new VisibleEdge(u2,u3,2,0,false,1)
  e4 = new VisibleEdge(u2,u4,3,0,false,1)
  e5 = new VisibleEdge(u3,u4,2,0,false,1)


  u1.demand = -4
  u2.demand = -3
  u3.demand = 2
  u4.demand = 5

}

generateTestData2()