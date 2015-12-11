import React from 'react'
import ReactDOM from 'react-dom'

import store from './store.js'
import Game from './components/game.jsx!'

const render = () => {
  console.log("state", store.getState())
  ReactDOM.render(
    <Game history={store.getState()[0]} store={store} />,
    document.getElementById('app')
  )
}

store.subscribe(render)

render()
