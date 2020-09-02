import { State, Action } from './types'
import * as utils from './utils'

const presets: State['presets'] = {
  easy: { minesAmount: 4, fieldSize: 6 },
  medium: { minesAmount: 15, fieldSize: 9 },
  hard: { minesAmount: 30, fieldSize: 12 },
}

export function init(activePresset: keyof State['presets']): State {
  const cfg = presets[activePresset]
  return {
    activePresset,
    isGameOver: false,
    presets,
    field: utils.createField(cfg.fieldSize, cfg.minesAmount),
  }
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cell discovered': {
      const { row, col } = action.payload
      // First make the selected cell visible
      const updatedField = state.field.map((items, currentRow) =>
        currentRow === row
          ? items.map((cell, currentCol) =>
              currentCol === col ? { ...cell, isVisible: true } : cell
            )
          : items
      )
      return {
        ...state,
        isGameOver: state.field[row][col].value === -1,
        // If discovered cell was empty, recursively discover adjacent empty cells
        field:
          state.field[row][col].value === 0
            ? utils.updateNeighbours(updatedField, row, col)
            : updatedField,
      }
    }

    case 'cell mark toggled': {
      const { row, col } = action.payload
      const canAddMark =
        utils.getMarksCount(state.field) <
        state.presets[state.activePresset].minesAmount
      return {
        ...state,
        field: state.field.map((items, currentRow) =>
          currentRow === row
            ? items.map((cell, currentCol) =>
                currentCol === col
                  ? {
                      ...cell,
                      // Only add mark if there are remaining marks
                      isMarked: canAddMark ? !cell.isMarked : false,
                    }
                  : cell
              )
            : items
        ),
      }
    }

    case 'game restarted': {
      return init(state.activePresset)
    }

    case 'config updated': {
      return init(action.payload)
    }
  }
}
