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
  
  constructor(x1,y1) {
    let divRef = document.getElementById("items")
    super(divRef,"node"+genRandomID(),x1,y1,"")
    Node.nodeList.push(this)
    this.edges = []
    this.sourceEdge = null // edge from source to this vertex
    this.sinkEdge = null // edge from this vertex to the sink
    this.visited = false // has this vertex been visited this iteration?
    this.prevEdge = null // inflow edge from a ford fulkerson iteration for backtracking
    this.updateInnerHTML()
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
  getDemand() {

  }
  setDemand(demand) {

  }
  changeDemand(demand,modifyFlow=false) {

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
// ----------------------------------------------------
class Edge extends CoordObject {

  constructor(u,v,capacity=0,flow=0,isInverse=false,lowerBound=0) {
    let divRef = document.getElementById("items")
    super("edge"+genRandomID())
    this.u = u 
    this.v = v 
    this.flow = flow
    this.capacity = capacity // highest flow allowed
    this.isInverse = isInverse // is this an inverse edge?
    this.invEdge = null // this edges' counterpart
    this.lowerBound = lowerBound // lowest flow allowed
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
    this.u.edges.splice(this.u.edges.indexOf(this), 1);
    this.v.edges.splice(this.v.edges.indexOf(this), 1);
  }
  setCapacity(capacity) {

  }
  getResidual() {

  }
  setFlow(flow) {
    
  }
  changeFlow(flow) {

  }
}


class Graph {
  constructor() {

  }
  addEdge(u,v,capacity,flow=0,lowerBound=0) {

  }
  addEdgeByIndex(uIndex,vIndex,capacity,flow=0,lowerBound=0) {

  }
  addEdgesByIndex(indexPairWithCapList) {

  }
  reduceLowerBounds() {

  }
  restoreLowerBounds() {

  }
  findPathAndAugment() {

  }
  fordFulkerson() {

  }
}

