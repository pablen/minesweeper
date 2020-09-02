import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import * as React from 'react'

import reducer, { init } from './reducer'
import * as utils from './utils'

import '@reach/menu-button/styles.css'
import './styles.css'

const flag = (
  <svg className="flag" viewBox="0 0 250 352" width="40" height="40" fill="red">
    <path d="M42 327l0 -291" stroke="black" strokeWidth="10" />
    <path d="M49 50c70,30 104,28 178,2 -21,42 -21,74 0,116 -72,25 -101,25 -178,0l0 -118z" />
  </svg>
)

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, 'medium', init)
  const currentConfig = state.presets[state.activePresset]
  const remainingMarks =
    currentConfig.minesAmount - utils.getMarksCount(state.field)
  const hasPlayerWon = utils.hasPlayerWon(state.field)
  return (
    <div
      className={`container ${
        state.isGameOver ? 'player-lost' : hasPlayerWon ? 'player-won' : ''
      }`}
    >
      <div className="controls">
        <div className="marksCount">
          {flag} {remainingMarks}
        </div>
        <div className="presets">
          <Menu>
            <MenuButton>
              {state.activePresset} <span aria-hidden="true">▾</span>
            </MenuButton>
            <MenuList>
              {(Object.keys(
                state.presets
              ) as (keyof typeof state.presets)[]).map((presetName) => (
                <MenuItem
                  onSelect={() =>
                    dispatch({ type: 'config updated', payload: presetName })
                  }
                  key={presetName}
                >
                  {presetName}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
        <button
          className="restart-btn"
          onClick={() => dispatch({ type: 'game restarted' })}
          type="button"
        >
          Restart
        </button>
      </div>

      <div className={`field size-${currentConfig.fieldSize}`}>
        {state.field.map((items, row) => (
          <div className="row" key={row}>
            {items.map((cell, col) => (
              <button
                onContextMenu={(ev) => {
                  ev.preventDefault()

                  dispatch({ type: 'cell mark toggled', payload: { row, col } })
                }}
                data-value={cell.isVisible ? cell.value : ''}
                className="cell"
                disabled={cell.isVisible}
                onClick={() =>
                  cell.isMarked
                    ? false
                    : dispatch({
                        type: 'cell discovered',
                        payload: { row, col },
                      })
                }
                type="button"
                key={col}
              >
                {cell.isVisible
                  ? cell.value === -1
                    ? '💣'
                    : cell.value !== 0
                    ? cell.value
                    : ''
                  : cell.isMarked
                  ? flag
                  : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
      {hasPlayerWon && <div className="winMsg">You Win!</div>}
      {state.isGameOver && <div className="looseMsg">Game Over!</div>}
    </div>
  )
}
