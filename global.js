let mousePosX = 0
let mousePosY = 0

let selectedNode = null 

const SELECT_MODE = 0
const MOVE_MODE = 1
const LINE_MODE = 2
const DELETE_MODE = 3

let currentMode = MOVE_MODE
let modeDict = {}

let defaultDemand = 0
let defaultCapacity = 0 
let defaultLowerBound = 0