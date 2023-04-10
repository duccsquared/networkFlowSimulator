
// class that provides setters and getters for the coordinates of an element
// along with an element's width and height
class CoordObject {
  // pass in the ID of the element to modify the coordinates of
  constructor(id) {
      this.id = id
  }
  // function that accounts for the difference betweeen the two ways of getting the x and y coordinates
  bodyOffsetX() {
      return ((this.element.getBoundingClientRect().left - parseInt(this.element.style.left.replace("px",""))) || 0)
  }
  bodyOffsetY() {
      return ((this.element.getBoundingClientRect().top - parseInt(this.element.style.top.replace("px",""))) || 0)
  }
  // getters
  get element() {return document.getElementById(this.id)}
  get x1() {return this.element.getBoundingClientRect().left}
  get y1() {return this.element.getBoundingClientRect().top}
  get x2() {return this.x1 + this.width}
  get y2() {return this.y1 + this.height}
  get x() {return this.x1 + this.width/2}
  get y() {return this.y1 + this.height/2}
  get width() {return this.element.offsetWidth}
  get height() {return this.element.offsetHeight}

  // setters 
  set x1(x1) {this.element.style.left = `${x1 - this.bodyOffsetX()}px`} // sets x1 and automatically moves x2 accordinly
  set y1(y1) {this.element.style.top = `${y1 - this.bodyOffsetY()}px`} // sets y1 and automatically moves y2 accordingly
  set x2(x2) {this.x1 = x2 - this.width} // sets x2 by setting x1
  set y2(y2) {this.y1 = y2 - this.height} // sets y2 by setting y1
  set x(x) {this.x1 = x - this.width/2} // sets x by setting x1
  set y(y) {this.y1 = y - this.height/2} // sets y by setting y1
  set width(width) {this.element.style.width = `${width}px`;} // sets width and automatically moves x2 accordingly
  set height(height) {this.element.style.height = `${height}px`;} // sets height and automatically moves y2 accordingly
}



class Draggable extends CoordObject {
  static draggableList = []
  static selectedDraggable = null;
  constructor(ref,id,x1,y1,innerHTML) {
    super(id)
    this.id = id
    ref.innerHTML += `
    <div id="${id}" style="position: absolute">
      ${innerHTML}
    </div>`;
    this.x1 = x1; this.y1 = y1;

    this.offsetX = 0; this.offsetY = 0
    Draggable.draggableList.push(this)
    }
  onMouseDown(e) {
    // set selected draggable
    Draggable.selectedDraggable = this;
    let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
    
    // find difference between card and mouse position and set to offset
    this.offsetX = this.x1 - mousePosX 
    this.offsetY = this.y1 - mousePosY
  }
  onMouseMove(e) {
    let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
    this.x1 = mousePosX + this.offsetX
    this.y1 = mousePosY + this.offsetY
  }
  onMouseUp(e) {
    // get mouse position
    let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
    // deselect object
    Draggable.selectedDraggable = null 
  }
}


function getMousePosX(e) {return e.clientX}
function getMousePosY(e) {return e.clientY}

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
      let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
      // start dragging obj if an obj is selected
      let obj = findIntersecting(mousePosX,mousePosY,Draggable.draggableList)
      if(obj!=null) {
        obj.onMouseDown(e)
      }
  }
}

function onMouseMove(e) {
  // if a card is selected
  if(Draggable.selectedDraggable!=null) {
      // move card
      Draggable.selectedDraggable.onMouseMove(e);
  }
  // get mouse position
  let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
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
    Draggable.selectedDraggable.onMouseUp(e);
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
var total = 2
new Draggable(divRef,"beep",100,200,testHTML)
new Draggable(divRef,"beep2",100,300,testHTML)

function createNewDraggable() {
  total += 1
  new Draggable(divRef,"beep" + total,100,150,testHTML)
}