var node = new Map()

function setParent(id, parentData) {
  node.set(id, parentData)
}

function getParent(id) {
  return node.get(id)
}

export {
  setParent,
  getParent
}