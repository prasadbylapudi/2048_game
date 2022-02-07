var size = 4
var htmlElements
var cells

const createField = () => {
  if (htmlElements) {
    return
  }
  htmlElements = []
  var table = document.getElementById('field')
  for (var y = 0; y < size; y++) {
    var tr = document.createElement('tr')
    var trElements = []
    for (var x = 0; x < size; x++) {
      var td = document.createElement('td')
      td.setAttribute('class', 'cell')
      tr.appendChild(td)
      trElements.push(td)
    }
    htmlElements.push(trElements)
    table.appendChild(tr)
  }
}

const createCells = () => {
  cells = []
  for (var y = 0; y < size; y++) {
    cells.push(new Array(size).fill(0))
  }
}

const generateInEmptyCell = () => {
  var x, y
  do {
    ;(x = Math.floor(Math.random() * size)),
      (y = Math.floor(Math.random() * size))
    if (cells[y][x] == 0) {
      cells[y][x] = Math.random() >= 0.9 ? 4 : 2
      break
    }
  } while (true)
}

const draw = () => {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var td = htmlElements[y][x]
      var v = cells[y][x]
      td.innerHTML = v == 0 ? '' : String(v)
      if (v == 0) {
        td.setAttribute('style', 'background-color: white')
      } else {
        var h = 20 + 24 * Math.log2(2048 / v)
        td.setAttribute('style', 'background-color: hsl(' + h + ', 100%, 70%)')
      }
    }
  }
}

const slide = (array, size) => {
  // [0, 2, 2, 2] => [2, 2, 2] => [4, 0, 2] => [4, 2] => [4, 2, 0, 0]
  const filterEmpty = (a) => {
    return a.filter((x) => x != 0)
  }

  array = filterEmpty(array)
  if (array.length > 0) {
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] == array[i + 1]) {
        array[i] *= 2
        array[i + 1] = 0
      }
    }
  }
  array = filterEmpty(array)
  while (array.length < size) {
    array.push(0)
  }
  return array
}

const slideLeft = () => {
  var changed = false
  for (var y = 0; y < size; y++) {
    var old = Array.from(cells[y])
    cells[y] = slide(cells[y], size)
    changed = changed || cells[y].join(',') != old.join(',')
  }
  return changed
}

const swap = (x1, y1, x2, y2) => {
  var tmp = cells[y1][x1]
  cells[y1][x1] = cells[y2][x2]
  cells[y2][x2] = tmp
}

const mirror = () => {
  for (var y = 0; y < size; y++) {
    for (var xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
      swap(xLeft, y, xRight, y)
    }
  }
}

const transpose = () => {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < y; x++) {
      swap(x, y, y, x)
    }
  }
}

const moveLeft = () => {
  return slideLeft()
}

const moveRight = () => {
  mirror()
  var changed = moveLeft()
  mirror()
  return changed
}

const moveUp = () => {
  transpose()
  var changed = moveLeft()
  transpose()
  return changed
}

const moveDown = () => {
  transpose()
  var changed = moveRight()
  transpose()
  return changed
}

const isGameOver = () => {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      if (cells[y][x] == 0) {
        return false
      }
    }
  }
  for (var y = 0; y < size - 1; y++) {
    for (var x = 0; x < size - 1; x++) {
      var c = cells[y][x]
      if (c != 0 && (c == cells[y + 1][x] || c == cells[y][x + 1])) {
        return false
      }
    }
  }
  return true
}

document.addEventListener('keydown', function (e) {
  var code = e.keyCode
  var ok
  switch (code) {
    case 52:
      ok = moveDown()
      break
    case 51:
      ok = moveUp()
      break
    case 49:
      ok = moveLeft()
      break
    case 50:
      ok = moveRight()
      break
    default:
      return
  }
  if (ok) {
    generateInEmptyCell()
    draw()
  }
  if (isGameOver()) {
    setTimeout(function () {
      alert('Game over')
      init()
    }, 1000)
  }
})

const init = () => {
  createField()
  createCells()
  new Array(3).fill(0).forEach(generateInEmptyCell)
  draw()
}

init()
