import { createStore } from 'redux'

const history = (state = [], action) => {
  switch (action.type) {
    case 'MOVE':
      return [
        ...state,
        action.square
      ]
    default:
      return state
  }
}

const game = (state = [[]], action) => {
  switch (action.type) {
    case 'NEW_GAME':
      return [
        history(undefined, action),
        ...state
      ]
    case 'MOVE':
      return [
        history(state[0], action),
        ...state.slice(1)
      ]
    default:
      return state
  }
}

const store = createStore(game)

export default store
