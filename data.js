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
    divRef = document.getElementById("items")
    super(divRef,"node"+genRandomID(),x1,y1,Node.nodeHTML)
    Node.nodeList.push(this)
  }
}

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

function onMouseDown(e) {
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

function onMouseMove(e) {
  // if a card is selected
  if(Draggable.selectedDraggable!=null) {
      // move card
      Draggable.selectedDraggable.onMouseMove();
  }
  // update current mouse position
  mousePosX = e.clientX
  mousePosY = e.clientY
  // if the mouse is hovering over a card, set the cursor accordingly
  if(findIntersecting(mousePosX,mousePosY,Draggable.draggableList)) {
      document.body.style.cursor = "move"
  }
  else {
      document.body.style.cursor = "auto"
  }
}

function onMouseUp(e) {
  // release card
  if(Draggable.selectedDraggable!=null) {
    Draggable.selectedDraggable.onMouseUp();
  }
}

// set event listeners
document.onmousedown = onMouseDown;
document.onmousemove = onMouseMove;
document.onmouseup = onMouseUp;

divRef = document.getElementById("items")

var testHTML = `
<div style="background-color: #2f2ff1; border: 1px solid #1313d3; width: 50px; height: 50px">
</div> 
`


function createNewDraggable() {
  let obj = new Node(mousePosX,mousePosY)
  obj.onMouseDown()
}