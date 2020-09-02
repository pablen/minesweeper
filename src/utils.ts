import { Field } from './types'

// Return current the amount of marks in the field
export function getMarksCount(field: Field): number {
  return field.reduce((rowCount, row) => {
    return row.reduce(
      (count, cell) => (cell.isMarked ? count + 1 : count),
      rowCount
    )
  }, 0)
}

// True if player has placed all the marks and cleared all cells
export function hasPlayerWon(field: Field): boolean {
  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field[0].length; col++) {
      const cell = field[row][col]
      if (!cell.isMarked && !cell.isVisible) return false
    }
  }
  return true
}

// Returns a field where all empty cells and neighbours are made visible
// Caution: mutates the passed field
export function updateNeighbours(field: Field, row: number, col: number) {
  const rowsAmount = field.length
  const colsAmount = field[0].length
  for (let dx of [-1, 0, 1]) {
    for (let dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) continue
      const newRow = row + dx
      const newCol = col + dy
      if (
        newRow < rowsAmount &&
        newCol < colsAmount &&
        newRow >= 0 &&
        newCol >= 0 &&
        field[row][col].value === 0 &&
        field[newRow][newCol].value !== -1 &&
        field[newRow][newCol].isVisible === false
      ) {
        field[newRow][newCol].isVisible = true
        field[newRow][newCol].isMarked = false
        updateNeighbours(field, newRow, newCol)
      }
    }
  }
  return field
}

// Return the amount of mines a specif cell has in adjacent cells
function getNeighbouringMinesAmount(
  field: Field,
  row: number,
  col: number
): number {
  const rowsAmount = field.length
  const colsAmount = field[0].length
  let amount = 0
  for (let dx of [-1, 0, 1]) {
    for (let dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) continue
      const newRow = row + dx
      const newCol = col + dy
      if (
        newRow < rowsAmount &&
        newCol < colsAmount &&
        newRow >= 0 &&
        newCol >= 0 &&
        field[newRow][newCol].value === -1
      ) {
        amount++
      }
    }
  }
  return amount
}

// Returns an n x n array with randomly placed mines
export function createField(size: number, minesAmount: number): Field {
  const field: Field = [...new Array(size)].map(() =>
    [...new Array(size)].map(() => ({
      isVisible: false,
      isMarked: false,
      value: 0,
    }))
  )
  let remainingMines = minesAmount
  while (remainingMines > 0) {
    const row = Math.floor(Math.random() * size)
    const col = Math.floor(Math.random() * size)
    if (field[row][col].value !== -1) {
      field[row][col].value = -1
      remainingMines--
    }
  }
  return field.map((items, row) =>
    items.map((cell, col) => {
      return cell.value === -1
        ? cell
        : { ...cell, value: getNeighbouringMinesAmount(field, row, col) }
    })
  )
}
