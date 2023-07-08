
class Queue {
  constructor() {
      this.items = {}
      this.frontIndex = 0
      this.backIndex = 0
  }
  put(item) {
      this.items[this.backIndex] = item
      this.backIndex += 1
  }
  get() {
      const item = this.items[this.frontIndex]
      delete this.items[this.frontIndex]
      this.frontIndex += 1
      return item
  }
  peek() {
      return this.items[this.frontIndex]
  }
  empty() {
    return this.frontIndex == this.backIndex
  }
}

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
  static sourceNode = new Node(document.getElementById("items"),0,0,true)
  static sinkNode = new Node(document.getElementById("items"),0,0,true)
  constructor(divRef,x1,y1,isSourceOrSink=false) {
    super(divRef,"node"+genRandomID(),x1,y1,"")
    Node.nodeList.push(this)
    this.edges = []
    this.startEdges = []
    if(!isSourceOrSink) {
      this.sourceEdge = new Edge(Node.sourceNode,this,0,0) // edge from source to this vertex
      this.sinkEdge = new Edge(this,Node.sinkNode,0,0) // edge from this vertex to the sink
    }
    this.visited = false // has this vertex been visited this iteration?
    this.prevEdge = null // inflow edge from a ford fulkerson iteration for backtracking
  }
  delete() {
    super.delete()
    let edgeCopy = [...this.edges]
    for(let i in edgeCopy) {
      edgeCopy[i].delete()
    }
    Node.nodeList.splice(Node.nodeList.indexOf(this), 1);
  }
  get demand() {return this.sinkEdge.capacity - this.sourceEdge.capacity}
  set demand(demand) {
    this.sourceEdge.capacity = Math.abs(Math.min(0,demand))
    this.sinkEdge.capacity = Math.abs(Math.max(0,demand))
  }
  changeDemand(demand,modifyFlow=false) {
    this.demand += demand 
    if(modifyFlow) {
      this.sourceEdge.flow = Math.min(this.sourceEdge.capacity,Math.max(0,this.sourceEdge.flow + demand * -1))
      this.sinkEdge.flow = Math.min(this.sinkEdge.capacity,Math.max(0,this.sinkEdge.flow + demand))
    }
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
    this.u.startEdges.push(this)
    if(!isInverse) {
      let invEdge = new Edge(v,u,capacity,this.residual,true,lowerBound)
      this.invEdge = invEdge
      invEdge.invEdge = this 
    }
  }

  get flow() {return this._flow;}
  get capacity() {return this._capacity;}
  get lowerBound() {return this._lowerBound;}
  get residual() {return this.capacity - this.flow}

  set flow(flow) {this._flow = flow; this.invEdge._flow = this.residual}
  set capacity(capacity) {this._capacity = capacity;this.invEdge._capacity = capacity}
  set lowerBound(lowerBound) {this._lowerBound = lowerBound}

  delete() {
    this.u.edges.splice(this.u.edges.indexOf(this), 1);
    this.v.edges.splice(this.v.edges.indexOf(this), 1);
    this.u.startEdges.splice(this.u.edges.indexOf(this), 1);
    Edge.edgeList.splice(Edge.edgeList.indexOf(this), 1);
    let invEdge = this.invEdge
    this.invEdge = null
    if(invEdge!=null && invEdge.invEdge!=null) {
      invEdge.delete()
    }
  }

}



class Graph {
  reduceLowerBounds() {
    for(let i in Node.nodeList) {
      let u = Node.nodeList[i]
      for(let j in u.startEdges) {
        let edge = u.startEdges[j]
        if(edge.lowerBound!=0 && !edge.isInverse) {
          edge.capacity -= edge.lowerBound
          edge.flow = Math.max(0,edge.flow - edge.lowerBound)
          edge.u.changeDemand(edge.lowerBound)
          edge.v.changeDemand(-edge.lowerBound)
        }
      }
    }
  }
  restoreLowerBounds() {
    for(let i in Node.nodeList) {
      let u = Node.nodeList[i]
      for(let j in u.startEdges) {
        let edge = u.startEdges[j]
        if(edge.lowerBound!=0 && !edge.isInverse) {
          edge.capacity += edge.lowerBound
          edge.flow = Math.max(0,edge.flow + edge.lowerBound)
          edge.u.changeDemand(-edge.lowerBound,true)
          edge.v.changeDemand(edge.lowerBound,true)
        }
      }
    }
  }
  findPathAndAugment() {
    // reset variables for nodes
    for(let i in Node.nodeList) {
      let u = Node.nodeList[i]
      u.visited = false 
      u.prevEdge = null 
    }
    // create queue and add the source
    let nodeQueue = new Queue()
    nodeQueue.put([Node.sourceNode,Infinity])
    // augment starts as zero
    let augment = 0
    // set source as visited with no previous edge
    Node.sourceNode.visited = true 
    Node.sourceNode.prevEdge = null 
    // loop until queue runs out or the sink is found
    while(!nodeQueue.empty()) {
      console.log(augment)
      // get node and bottleneck
      let vals = nodeQueue.get()
      let u = vals[0]
      let bottleneck = vals[1]
      // if the sink is found, set augment and exit loop
      if(u==Node.sinkNode) {
        if(bottleneck!=Infinity) {augment = bottleneck}
        else {augment = 0}
        break
      }
      // for each neighbour
      for(let i in u.startEdges) {
        console.log(i)
        let edge = u.startEdges[i]
        // can more flow be pushed into the edge?
        if(edge.residual>0 && !edge.v.visited) {
          // set as previous and visited
          edge.v.prevEdge = edge 
          edge.v.visited = true 
          // add to queue
          nodeQueue.put([edge.v,Math.min(bottleneck,edge.residual)])
        }
      }
    }
    // backtrack through flow path
    let edge = Node.sinkNode.prevEdge
    while(edge != null) {
      // account for augment
      edge.flow += augment
      // get to previous edge
      edge = edge.u.prevEdge
    }
    // return augment
    return augment

  }
  fordFulkerson() {
    let augmentedFlow = 1 
    this.reduceLowerBounds()
    while(augmentedFlow > 0) {
      console.log(augmentedFlow)
      augmentedFlow = this.findPathAndAugment()
    }
    this.restoreLowerBounds()
  }
}

