export type Cell = { value: number; isVisible: boolean; isMarked: boolean }

export type Field = Cell[][]

export type Preset = {
  minesAmount: number
  fieldSize: number
}

export type State = {
  activePresset: keyof State['presets']
  isGameOver: boolean
  presets: { easy: Preset; medium: Preset; hard: Preset }
  field: Field
}

export type Action =
  | { type: 'cell mark toggled'; payload: { row: number; col: number } }
  | { type: 'cell discovered'; payload: { row: number; col: number } }
  | { type: 'config updated'; payload: keyof State['presets'] }
  | { type: 'game restarted' }
