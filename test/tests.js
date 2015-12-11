import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { expect } from 'chai'
import { forEach } from 'ramda'

import Game from '../app/components/game.jsx!'
import Square from '../app/components/square.jsx!'

import store from '../app/store.js'

const {
  isCompositeComponent,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils

describe("Game", () => {
  let game
  let render

  beforeEach(() => {
    store.dispatch({ type: 'NEW_GAME' })

    render = () => {
      game =
        renderIntoDocument(<Game history={store.getState()} store={store}/>)
    }

    store.subscribe(render)
    render()
  })

  it("is a composite component", () => {
    expect(isCompositeComponent(game)).to.equal(true)
  })

  it("has one board", () => {
    expect(scryRenderedDOMComponentsWithClass(game, 'board').length).to.equal(1)
  })

  it("begins with an empty history", () => {
    expect(game.props.history).to.eql([])
  })

  describe("board", () => {
    let board

    beforeEach(() => {
      board = scryRenderedDOMComponentsWithClass(game, 'board')[0]
    })

    it("has nine squares", () => {
      expect(board.childNodes.length).to.equal(9)
    })

    it("prevents rewriting squares", () => {
      Simulate.click(board.childNodes[4])
      Simulate.click(board.childNodes[4])

      // Board was rerendered
      board = scryRenderedDOMComponentsWithClass(game, 'board')[0]

      expect(board.childNodes[4].innerHTML).to.equal('x')
    })

    it("tracks moves in game history", () => {
      Simulate.click(board.childNodes[4])
      Simulate.click(board.childNodes[3])
      Simulate.click(board.childNodes[0])

      expect(game.props.history).to.eql([4,3,0])
    })

    it("can alternate moves, X first", () => {
      Simulate.click(board.childNodes[4])
      Simulate.click(board.childNodes[3])
      Simulate.click(board.childNodes[0])

      // Board was rerendered
      board = scryRenderedDOMComponentsWithClass(game, 'board')[0]

      expect(board.childNodes[4].innerHTML).to.equal('x')
      expect(board.childNodes[3].innerHTML).to.equal('o')
      expect(board.childNodes[0].innerHTML).to.equal('x')
    })

    it("recognizes a win", () => {
      const moves = [4, 3, 0, 8, 2, 1, 6] // win

      forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

      expect(
        scryRenderedDOMComponentsWithClass(game, 'board won').length
      ).to.equal(1)
    })

    it("prevents further play after a win", () => {
      const lastSquare = board.childNodes[7]
      const moves = [4, 3, 0, 8, 2, 1, 6] // win

      forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

      Simulate.click(lastSquare)

      expect(lastSquare.innerHTML).to.be.empty
    })
  })
})

describe("Square", () => {
  let square
  const mark = 'x'

  describe("when empty", () => {
    before(() => {
      // Add store and square props!
      square = renderIntoDocument(<Square store={store} square={1} />)
    })

    it("is a composite component", () => {
      expect(isCompositeComponent(square)).to.equal(true)
    })
  })

  describe("after play", () => {
    beforeEach(() => {
      square = renderIntoDocument(
        // Add store and square props!
        <Square store={store} square={1}  mark={mark}/>
      )
    })

    it("has the correct content", () => {
      const div = scryRenderedDOMComponentsWithTag(square, 'div')[0]

      expect(div && div.innerHTML).to.equal(mark)
    })

    it("applies the player's style", () => {
      expect(scryRenderedDOMComponentsWithClass(square, 'x')).not.to.be.empty
    })
  })
})
