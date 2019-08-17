'use strict'
// 数组转树
export function arrayToTree(rows) {
  function exists(rows, parentId) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].code === parentId) return true
    }
    return false
  }

  var nodes = []
  // get the top level nodes
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i]
    if (!exists(rows, row.parent)) {
      nodes.push(row)
    }
  }

  var toDo = []
  for (var j = 0; j < nodes.length; j++) {
    toDo.push(nodes[j])
  }
  while (toDo.length) {
    var node = toDo.shift() // the parent node
    // get the children nodes
    for (var z = 0; z < rows.length; z++) {
      var rowData = rows[z]
      if (rowData.parent === node.code) {
        var child = rowData
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
        }
        toDo.push(child)
      }
    }
  }
  return nodes
}

// 树转数组
export function treeToArrayHelper(tree, path, currentPath) {
  var currentPath = currentPath || []
  var path = path || []
  for (let i = 0; i < tree.length; i++) {
    if (i !== 0) {
      currentPath.pop()
    }
    currentPath.push(tree[i])
    if (tree[i].children && tree[i].children.length) {
      treeToArrayHelper(tree[i].children, path, currentPath)
    } else {
      path.push(currentPath.slice(0))
    }
  }
  currentPath.pop()
  return path
}

export function treeToArray(tree) {
  var treeToArrayHelper = function(tree, path, currentPath) {
    var currentPath = currentPath || []
    var path = path || []
    for (let i = 0; i < tree.length; i++) {
      if (i !== 0) {
        currentPath.pop()
      }
      currentPath.push(tree[i])
      if (tree[i].children && tree[i].children.length) {
        treeToArrayHelper(tree[i].children, path, currentPath)
      } else {
        path.push(currentPath.slice(0))
      }
    }
    currentPath.pop()
    return path
  }
  let path = treeToArrayHelper(tree)
  let array = []
  path.map(item => {
    item.map(row => {
      if (array.indexOf(row) === -1) array.push(row)
    })
  })
  path = null
  return array
}
