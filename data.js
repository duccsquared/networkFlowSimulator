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
  
  constructor(divRef,x1,y1) {
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
  getDemand() {

  }
  setDemand(demand) {

  }
  changeDemand(demand,modifyFlow=false) {

  }

}
// ----------------------------------------------------
class Edge extends CoordObject {
  static edgeList = []
  constructor(u,v,capacity=0,flow=0,isInverse=false,lowerBound=0) {
    super("edge"+genRandomID())
    Edge.edgeList.push(this)
    this.u = u 
    this.v = v 
    this._flow = flow
    this._capacity = capacity // highest flow allowed
    this.isInverse = isInverse // is this an inverse edge?
    this.invEdge = null // this edges' counterpart
    this._lowerBound = lowerBound // lowest flow allowed
    this.u.edges.push(this)
    this.v.edges.push(this)
  }

  get flow() {return this._flow;}
  get capacity() {return this._capacity;}
  get lowerBound() {return this._lowerBound;}

  set flow(flow) {this._flow = flow}
  set capacity(capacity) {this._capacity = capacity}
  set lowerBound(lowerBound) {this._lowerBound = lowerBound}

  delete() {
    this.u.edges.splice(this.u.edges.indexOf(this), 1);
    this.v.edges.splice(this.v.edges.indexOf(this), 1);
    Edge.edgeList.splice(Edge.edgeList.indexOf(this), 1);
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

