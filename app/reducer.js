import { append } from 'ramda'
import { createStore } from 'redux'

const history = (state = [], action) => {
  switch (action.type) {
    case 'MOVE':
      return append(action.square, state)
    case 'NEW_GAME':
      return []
    default:
      return state
  }
}

const store = createStore(history)

const logger = () => {
  console.log("New state:", store.getState())
}

store.subscribe(logger)
logger()

console.log(store.getState())

store.dispatch({ type: 'MOVE', square: 4 })

console.log(store.getState())
