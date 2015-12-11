import { createStore } from 'redux'

const history = (state = [], action) => {
  switch (action.type) {
    case 'MOVE':
      return [
        ...state,
        action.square
      ]
    case 'NEW_GAME':
      return []
    default:
      return state
  }
}

const store = createStore(history)

export default store
