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


