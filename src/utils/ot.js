import { getParent, setParent } from './map'

const json1 = require('ot-json1')


function transOTData(data) {
  const { nodeData } = m.getAllData()
  const { name, obj, target } = data

  let op
  let newnodeData
  switch (name) {
    // 从父节点插入子节点
    case 'addChild':
      {
        const { path } = getParent(target.id)
        const newpath = `${path}-0`
        setParent(obj.id, {
          id: target.id,
          path: newpath,
        })

        let otpath = []
        const arrnewpath = newpath.split('-').slice(1)
        arrnewpath.forEach((path, index) => {
          otpath.push('children')
          if(index + 1 < arrnewpath.length) {
            otpath.push(path)
          }
        })

        op = json1.insertOp(otpath, [{
          id: obj.id,
          topic: obj.topic,
          parent: target,
        }])

        newnodeData = json1.type.apply(nodeData, op)
      }
      break
    case 'removeNode':
      break
    case 'moveNodeAfter':
      break
    case 'insertSibling':
      {
        const { path } = getParent(target.id)
        let newarr = path.split('-')
        newarr[newarr.length - 1] = parseInt(newarr[newarr.length - 1]) + 1
        const newpath = `${newarr.join('-')}`
        setParent(obj.id, {
          id: target.parent.id,
          path: newpath
        })

        let otpath = []
        const arrnewpath = newpath.split('-').slice(1)
        arrnewpath.forEach((path, index) => {
          otpath.push('children')
          otpath.push(parseInt(path, 10))
        })

        op = json1.insertOp(otpath, {
          id: obj.id,
          topic: obj.topic,
          parent: target.parent
        })

        newnodeData = json1.type.apply(nodeData, op)  
      }
      break
  }

  m.setData({
    nodeData: newnodeData
  }, false)
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