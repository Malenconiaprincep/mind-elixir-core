import { getParent, setParent } from './map'

const json1 = require('ot-json1')


function transOTData(data) {
  const { nodeData } = m.getAllData()
  const { name, obj, parent } = data

  let op
  switch (name) {
    // 从父节点插入子节点
    case 'addChild':
      const {rIndex , cIndex} = getParent(parent.id)
      const newrIndex = rIndex + 1
      const newcIndex = cIndex
      setParent(obj.id, {
        id: parent.id,
        rIndex: newrIndex,
        cIndex: cIndex
      })

      let path = []
      for(let i=0; i < newrIndex; i++) {
        path.push('children')
        if(i + 1 < newrIndex) {
          path.push(0)
        }
      }

      op = json1.insertOp(path, [{
        id: obj.id,
        topic: obj.topic,
        parent: parent
      }])

      const newnodeData = json1.type.apply(nodeData, op)
      m.setData({
        nodeData: newnodeData
      }, false)
    case 'removeNode':
      break
    case 'moveNodeAfter':
      break
  }

  return JSON.stringify(op)
}

// TODO: 这里需要写查询 index 算法
function getIndex(id, nodeData) {
  let deepth = 0

  if (nodeData.id === id) {
    return deepth
  } else {
    deepth++
  }
  if (nodeData.children.length > 0) {
    deepth++
    nodeData.children.findIndex(item => item.id === id)
  }

  getIndex(id, nodeData.children)
}

export {
  transOTData
}