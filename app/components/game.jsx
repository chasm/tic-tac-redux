import React, { Component, PropTypes } from 'react'

import {
  addIndex,
  contains,
  curry,
  filter,
  flatten,
  indexOf,
  isEmpty,
  map,
  reduce,
  repeat,
  update
} from 'ramda'

import Square from './square.jsx!'

import shouldPureComponentUpdate from 'react-pure-render/function'

const mapIndexed = addIndex(map)

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const buttonStyle = {
  backgroundColor: '#d9534f',
  border: '1px solid rgba(0, 0, 0, 0)',
  borderColor: '#d43f3a',
  borderRadius: '4px',
  color: '#ffffff',
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  margin: '5px',
  padding: '6px 12px',
  textAlign: 'center',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
}

class Game extends Component {

  static propTypes = {
    history: PropTypes.array.isRequired,
    store: PropTypes.object.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  getPlayer (move, history) {
    return (indexOf(move, history) % 2 === 0) ? 'x' : 'o'
  }

  makeMove (history, memo, move) {
    const player = this.getPlayer(move, history)

    return update(move, player, memo)
  }

  getBoard (history) {
    const move = curry(this.makeMove.bind(this))
    const memo = repeat(false, 9)

    return reduce(move(history), memo, history)
  }

  checkForWin (board) {
    return filter((pattern) => {
      var s1 = board[pattern[0]]
      var s2 = board[pattern[1]]
      var s3 = board[pattern[2]]

      return s1 && s1 === s2 && s2 === s3
    }, winPatterns)
  }

  render () {
    const { store, history } = this.props
    const board  = this.getBoard(history)
    const wins   = flatten(this.checkForWin(board))
    const status = isEmpty(wins) ? 'board' : 'board won'

    return <div style={{textAlign: 'center'}}>
      <div className={status}>
        {this.renderBoard(board, wins)}
      </div>
      <button
        style={buttonStyle}
        onClick={() => store.dispatch({ type: 'NEW_GAME' })}>
        New Game
      </button>
      <button
        style={buttonStyle}
        onClick={() => store.dispatch({ type: 'UNDO_MOVE' })}>
        Undo Move
      </button>
    </div>
  }

  renderBoard (board, wins) {
    const inPlay = isEmpty(wins)
    const { store } = this.props

    return mapIndexed((player, idx) => {
      const props = { key: idx, square: idx, store: store }

      if (contains(idx, wins)) { props.win = true }
      if (player) { props.mark = player }

      return <Square {...props} />
    }, board)
  }
}

export default Game
