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
onMouseDown() {
    // set selected draggable
    Draggable.selectedDraggable = this;
    
    // find difference between card and mouse position and set to offset
    this.offsetX = this.x1 - mousePosX 
    this.offsetY = this.y1 - mousePosY
}
onMouseMove() {
    this.x1 = mousePosX + this.offsetX
    this.y1 = mousePosY + this.offsetY
}
onMouseUp() {
    // get mouse position
    // deselect object
    Draggable.selectedDraggable = null 
}
}
