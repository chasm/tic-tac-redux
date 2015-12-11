# Tic-Tac-Redux

We'll start with our app from last class, which can be found at [https://github.com/chasm/tic-tac-react](https://github.com/chasm/tic-tac-react). Be sure to clone a copy to use as the base from which to build today's application.

If, after you've cloned it, you'd like to make the repo your own, just delete the `.git` folder, then run `git init` to start your own repo:

```sh
rm -rf .git
git init
git add -A
git commit -m "Initial commit"
```

Once you've cloned the app, make sure you have `n` installed and the latest version of node, as well as `jspm` and the `jspm-server` installed globally. Oh, and it won't hurt to have some babel stuff installed globally as well. Then you can run `npm install` and `jspm install` to set up the app. Finally, running `jspm-server` will serve the app on localhost:8080. You can see and play the game there, and you can run the tests at [http:://localhost:8080/test.html](http:://localhost:8080/test.html)

```sh
npm i -g n
n latest
npm i -g jspm jspm-server babel babel-cli babel-node babel-preset-es2015 babel-preset-stage-0 babel-preset-react
npm install
jspm install
jspm-server
```

## The big review!

OK, we should be ready to go. Let's do a quick review.

In the `index.html` file we see the following script elements:

```html
<script src="jspm_packages/system.js"></script>
<script src="config.js"></script>
<script>
  System.import('app/main.jsx!')
</script>
```

The first one loads `system.js` from our local JSPM packages. [System.js](https://github.com/systemjs/systemjs) is:

> Universal dynamic module loader - loads ES6 modules, AMD, CommonJS and global scripts in the browser and NodeJS. Works with both Traceur and Babel.

The second script loads our local configuration file, which tells it what modules we're using and what options we've selected. The `config.js` file is handled automatically by JSPM. You don't need to worry about it.

Finally, we use System.js's `import` method it grab our top-level JavaScript file and begin resolving the import statements and loading up the various modules. In development mode it parses this tree each time the page is loaded, so it can be a little slow. In production, you would bundle everything up.

That leads us to our `app/main.jsx` file. To load this file properly as JSX, be sure you have the ! (bang) character after the extension. This tells the JSPM JSX transpiler to transpile the JSX to JS.

Our `main.jsx` file looks like this:

```jsx
// app/main.jsx
import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App.jsx!'

const main = () => {
  const app = document.createElement('div')

  document.body.appendChild(app)

  ReactDOM.render(<App/>, app)
}

main()
```

We import React, which gives us JSX. And we import the ReactDOM, which we need to manipulate the browser's DOM. Facebook says:

> The react-dom package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside of the React model if you need to. Most of your components should not need to use this module.

And indeed we'll only use it in the `main.jsx` file to render our App to the browser. Here we create a new `<div/>` element, append it to the `<body>`, and then render our App into it. That's all our `main.jsx` file does.

You'll note that we also import our App from `./components/App.jsx!` (note the !).

Our `app.jsx` file looks like this:

```jsx
// app/components/app.jsx
import React, { Component } from 'react'

import Game from './game.jsx!'

class App extends Component {

  render () {
    return <div>
      <Game/>
    </div>
  }
}

export default App
```

Note that we didn't need to import ReactDOM here, just React. We're going to create our component class by inheriting from the React Component class, so we import that individualy using destructured assignment (new in JavaScript 2015). That means we don't have to write `extends React.Component`. Your mileage may vary. Do it whichever way works for you.

We're going to need the Game component, so we import that. Note the ! to transpile it. Don't forget that.

Our component is very simple (so far). We simply render a `<div>` element wrapped around our `<Game/>` component. Note that empty elements must have a `/` before the closing `>`. Also, while the `<div>` element is a JSX component as well, it represents a typical HTML div element. All the usual HTML elements are available.

The `game.jsx` file is where it all happens, currently. We begin by importing React and Component, and then we import a whole lotta Ramda functions. I like Ramda! So sue me. Finally, we import our Square component, which we'll use to build the board.

```jsx
// in app/components/game.jsx
import React, { Component } from 'react'

import {
  addIndex,
  append,
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
```

Then we add the index to the Ramda `map` function so we can map with indexing in our `render` method. Did I mention that I love Ramda? We also set up our "win patterns" which we'll use to determine if a player has won the game. I'm using the `const` keyword here because we won't be reassigning these variables.

```jsx
// in app/components/game.jsx
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
```

Then we create our Game class, inheriting from React's Component class. The `constructor` runs automatically when the Game class is instantiated. Here, it passes the props up to the superclass (Component), and then sets up our state. The Game class is currently the only component in which we maintain state for our application. In general, we want to concentrate all our state in one place so we can keep a close eye on it. State is not to be trusted! We'll keep it chained up here.

Our state has been kept as simple as possible. We just track a history of moves as an array (list) of square indices (from 0 to 8). These refer to the positions on the board. Because X always moves first, we know that the even-numbered positions in our history array (0, 2, 4, etc.) are X moves, and the odd positions (1, 3, 5, etc.) are O moves.

So from this simple array we can determine everything we need to know about the state of the game.

```jsx
// in app/components/game.jsx
class Game extends Component {

  constructor (props) {
    super(props)

    this.state = { history: [] }
  }

  // more code . . .
}
```

Let's work our way through the code. We'll start with the `render` method at the bottom because, after all, that's what the component does that's worth mentioning, right?

```jsx
// in app/components/game.jsx
render () {
  const board  = this.getBoard(this.state.history)
  const wins   = flatten(this.checkForWin(board))
  const inPlay = isEmpty(wins)
  const status = inPlay ? 'board' : 'board won'

  return <div className={status}>
    {this.renderBoard(board, wins)}
  </div>
}
```

The first thing we do is call `this.getBoard` and pass it the history array from our state. This means that every time the history changes, our Game will call `render` again. Here's the `getBoard` method:

```jsx
// in app/components/game.jsx
getBoard (history) {
  const move = curry(this.makeMove.bind(this))
  const memo = repeat(false, 9)

  return reduce(move(history), memo, history)
}
```

This is the tricky part. The `getBoard` method is going to use the Ramda `reduce` function to loop through the history array and "reduce" (or "fold") it into a board array. The way this works is that we pass in an empty board, which is to say an array of 9 `false` values representing the 9 squares on the board. They are false because they have not yet been played. This is the "memo" which will act as our accumulator, accumulating the actual moves until we have a completed board (for our current state). The Ramda `repeat` function is used to create the array.

The `reduce` method takes a function of two parameters&mdash;the "accumulator" (memo) and the value passed in from the history array. We're going to need to figure out which player is playing (based on position in the history array) and then return a new copy of the `memo` array with that player's mark in the appropriate square.

To do this, we've created a `makeMove` method:

```jsx
// in app/components/game.jsx
makeMove (history, memo, move) {
  const player = this.getPlayer(move, history)

  return update(move, player, memo)
}
```

It takes our accumulator (memo) and our move (from the history array), but, uh, whoops! We also need the full history array so we can figure out which player is playing. Ramda's `reduce` expects two parameters, but here we have three. Hmm.

If you look back up to the `getBoard` method, you'll see that we're doing something clever with Ramda's `curry` function. We've created a new function called `move` by wrapping our `makeMove` method in `curry`. What does this do?

To curry a function means to split the parameters so that they can be applied one at a time. If I have, say, three parameters, I can call the function with the first parameter only, and it will return a *function* that takes the remaining two parameters (and so on).

So in our `getBoard` method, when we call `reduce` instead of giving it the `makeMove` method directly, we call the curried method *with our history array* which *partially applies* the `makeMove` method. Now our history is captured in the method and we can use it to calculate the player.

Speaking of which, let's look at the `makeMove` method a bit more closely. The first thing we do is use that captured `history` array and the move to call the `getPlayer` method. That method looks like this:

```jsx
// in app/components/game.jsx
getPlayer (move, history) {
  return (indexOf(move, history) % 2 === 0) ? 'x' : 'o'
}
```

It should be obvious what this one does. It uses Ramda's `indexOf` method to figure out where in the history array the move occurs, and it returns that index. We use modulus to get the remainder when divided by 2. If the remainder is 0, then it's an even-numbered index and the player is 'x'. If the remainder is 1, then the player is 'o'. Easy peasy.

Back in the `makeMove` method, we user Ramda's `update` function to create a new copy of `memo` with the `move` index updated to `player`. In other words:

```
Calling update with
move === 4
player === 'x'
memo === [false, false, false, false, false, false, false, false, false]

Returns [false, false, false, false, 'x', false, false, false, false]
                                      ^
                                      4th square is now x
```

Got it? This repeats with 3, 0, etc. until the history array is exhausted. If our history array was `[4, 3, 0, 8, 2, 1, 6]`, then the output of `getBoard` would be:

```js
[ 'x', 'o', 'x', 'o', 'x', false, 'x', false, 'o' ]
```

That brings us back to our `render` method:

```jsx
// in app/components/game.jsx
render () {
  const board  = this.getBoard(this.state.history)
  const wins   = flatten(this.checkForWin(board))
  const inPlay = isEmpty(wins)
  const status = inPlay ? 'board' : 'board won'

  return <div className={status}>
    {this.renderBoard(board, wins)}
  </div>
}
```

Next we're going to call `checkForWin` and pass it our newly created board.

```jsx
// in app/components/game.jsx
checkForWin (board) {
  return filter((pattern) => {
    var s1 = board[pattern[0]]
    var s2 = board[pattern[1]]
    var s3 = board[pattern[2]]

    return s1 && s1 === s2 && s2 === s3
  }, winPatterns);
}
```

This takes our array of win patterns (each an array of three square numbers) and loops through it using Ramda's `filter` function. The `filter` function loops through a collection and returns a new collection including only those items for which the passed in anonymous function returned `true`.

So our anonymous function takes each win pattern one at a time and check the board to see if the three cells in the pattern all have the same player's mark in them. If they do, then that pattern is returned.

If there's no winner, the `checkForWin` method returns an empty array, `[]`. If there is a win, it returns one or more winning patterns, e.g., `[[0, 4, 8], [2, 4, 6]]`. OK, almost always, there will only be one pattern.

Nevertheless, our `render` method uses Ramda's `flatten` function to flatten the array, e.g., `[[0, 4, 8], [2, 4, 6]]` becomes [0, 2, 4, 6, 8]. These will be used to color those squares with the winning player's color while the non-winning squares are grayed out.

Continuing, if the `wins` array is empty, then the game is still "inPlay". We set the `className` on our board accordingly. Then we hand off creation of the actual board HTML to the `renderBoard` method, which looks like this:

```jsx
// in app/components/game.jsx
renderBoard (board, wins) {
  const inPlay = isEmpty(wins)

  return mapIndexed((player, idx) => {
    if (inPlay) {
      if (player) {
        return <Square key={idx} player={player}/>
      } else {
        return <Square key={idx} clickCb={this.handleClick.bind(this, idx)}/>
      }
    } else {
      return <Square key={idx} player={player} win={contains(idx, wins)}/>
    }
  }, board)
}
```

This should be pretty obvious. We map through the board, adding the appropriate squares to our output array.

If the game is in play and the square has been played, then we render it like this, e.g.:

```jsx
<Square key={4} player={'x'}/>
```

If it's in play but unplayed, we render it thus, e.g.:

```jsx
<Square key={6} clickCb={this.handleClick.bind(this, 6)}/>
```

So the click callback is only attached when the square is in play but unplayed. Note that we cleverly bind the index of the square to the click callback so the square can remain blissfully ignorant of it's place in the bigger picture. Did we mention that this is clever? Very clever.

Finally, if the game is won, we return a square like this, e.g.:

```jsx
<Square key={2} player={'x'} win={true}/>
```

That `win` prop is determined by comparing the index of the square to the numbers in the `wins` array. Given the `wins` array above and square 2, we get `contains(2, [0, 2, 4, 6, 8])`, which clearly returns `true`.

But wait! What is this `handleClick` method that we're passing to the Square and binding to the Square's index?

```jsx
// in app/components/game.jsx
handleClick (square) {
  this.setState({ history: append(square, this.state.history) })
}
```

Here we see how state is changed in a React component. *We never set state directly!* We're always going to use the `setState` setter, passing it the part of the state we want to update (this is merged into the state to create a new state).

Here we use Ramda's `append` function to append our square's number to the current history array, and then we set that as the new history array.

How does the square handle this? Glad you asked. Here is the Square code:

```jsx
// app/components/square.jsx
import React, { Component } from 'react'

class Square extends Component {

  handleClick (event) {
    if (this.props.clickCb) {
      this.props.clickCb()
    }
  }

  render () {
    const winner = !!this.props.win
    const player = this.props.player

    const status = winner ? `${player} win` : player

    return !!player ?
      <div className={status}>{player}</div> :
      <div onClick={this.handleClick.bind(this)}/>
  }
}

export default Square
```

The import and export should be clear by now. Yep, we extend the React Component class to give us our Square. Yep, we override the Component's `render` method with our own. Here we set `winner` and `player` values just to make the remaining code clearer. They are simply the `props` passed in from the Game component, available through `this.props.<propName>`.

Then we use the status of `this.props.win` (true or undefined) to set `winner` to true or false and then we use that in a ternary operator to decide whether to add the "win" class. If the square has been played (player is not undefined), we return, for example:

```jsx
<div class="x">x</div>
```

(We'll use CSS to make the x big, bold, uppercase, and red.)

Or, if the game was won by x and this is one of the winning squares,

```jsx
<div class="x win">x</div>
```

If the square is unplayed, then we return an empty div with a click event handler:

```jsx
<div onclick="this.handleClick"></div>
```

If the square is clicked on, the Square's `handleClick` method is called:

```jsx
// in app/components/square.jsx
handleClick (event) {
  if (this.props.clickCb) {
    this.props.clickCb()
  }
}
```

And all it does is call the Game's `handleClick` method, bound with the number of the Square, and passed in via `this.props.clickCb`.

Everything making sense now?

So if we have a win like this:

![O wins](./images/o-wins.png)

Then we have React like this (from the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) in Chrome&mdash;and there's a [Firefox version](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), too).

![React winning board](./images/react-winning-board.png)

And our HTML output in the DOM looks like this:

```html
<div data-reactid=".0">
  <div class="board won" data-reactid=".0.0">
    <div data-reactid=".0.0.$0" class="o win">o</div>
    <div data-reactid=".0.0.$1" class="x">x</div>
    <div data-reactid=".0.0.$2"></div>
    <div data-reactid=".0.0.$3" class="x">x</div>
    <div data-reactid=".0.0.$4" class="o win">o</div>
    <div data-reactid=".0.0.$5" class="x">x</div>
    <div data-reactid=".0.0.$6"></div>
    <div data-reactid=".0.0.$7"></div>
    <div data-reactid=".0.0.$8" class="o win">o</div>
  </div>
</div>
```

## What about the tests?

We're also doing some pretty clever front-end testing using mocha and chai. If you check in the `test/tests.js` file, you'll see these imports:

```js
// in test/tests.js
import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { expect } from 'chai'

import App from '../app/components/app.jsx!'
import Game from '../app/components/game.jsx!'
import Square from '../app/components/square.jsx!'

import { forEach } from 'ramda'
```

We need React, of course. And the [TestUtils](https://facebook.github.io/react/docs/test-utils.html) provide a long list of very helpful functions for testing React components, the most powerful of which is probably `Simulate`.

Next, we import those utility functions we need:

```js
// in test/tests.js
const {
  isCompositeComponent,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils
```

To see what these do, refer to the [TestUtils](https://facebook.github.io/react/docs/test-utils.html) documentation. I won't repeat it here. Gotta love functions marked as "scary"!

For the App, we're simply testing that it exists and can be instantiated:

```js
// in test/tests.js
describe("App", () => {

  it("is a composite component", () => {
    const app = renderIntoDocument(<App/>)

    expect(isCompositeComponent(app)).to.equal(true)
  })
})
```

This just renders the App component into the DOM and then checks that it exists. We have similar tests for Game and Square, so we'll skip those.

Remember, these are front-end tests, so to run them, start up `jspm-server` and point your browser to [http://127.0.0.1:8080/test.html](http://127.0.0.1:8080/test.html).

Next, we test the Game. There's a lot too it.

```js
// in test/tests.js
describe("Game", () => {
  let game

  beforeEach(() => {
    game = renderIntoDocument(<Game/>)
  })

  // more code . . .
})
```

First, we use `beforeEach` to render a Game component anew for each test. We need to define `game` outside the `beforeEach` method so it's scoped to the entire `describe` block.

Next we check if the Game has a board:

```js
// in test/tests.js
it("has a board", () => {
  expect(scryRenderedDOMComponentsWithClass(game, 'board').length).to.equal(1)
})
```

The `scryRenderedDOMComponentsWithClass` function takes the Game component and a class name and returns an array of any elements inside that component with that class name. Remember, it returns an *array*, even if it finds only one element (or none).

Then we check that a Game starts with an empty history:

```js
// in test/tests.js
it("begins with an empty history", () => {
  expect(game.state.history).to.eql([])
})
```

OK, cool. But what about the board? The next block will work with the board, so we'll put it in its own describe block and we'll grab the board from the game before each test:

```js
// in test/tests.js
describe("board", () => {
  let board

  beforeEach(() => {
    board = scryRenderedDOMComponentsWithClass(game, 'board')[0]
  })

  // more code . . .
})
```

Now we can start checking. First let's make sure it has *nine* (9) squares, no more, no fewer. And that we can't rewrite the squares (this one's a gimme as we only attach the click handler if the square is unplayed):

```js
// in test/tests.js
it("has nine squares", () => {
  expect(board.childNodes.length).to.equal(9)
})

it("prevents rewriting squares", () => {
  let center = board.childNodes[4]

  Simulate.click(center)
  Simulate.click(center)

  expect(center.innerHTML).to.equal('x')
})
```

This first test should be obvious. The second one, too. We grab the center square, then use `Simulate` to click it twice. It should not change from it's initial value. (This is the first move, so we expect that to be 'x'. I guess this tests that X goes first as well. Two for one!)

Does it track those moves in our game history?

```js
// in test/tests.js
it("tracks moves in game history", () => {
  const board = scryRenderedDOMComponentsWithClass(game, 'board')[0]

  const center = board.childNodes[4]
  const midLeft = board.childNodes[3]
  const topLeft = board.childNodes[0]

  Simulate.click(center)
  Simulate.click(midLeft)
  Simulate.click(topLeft)

  expect(game.state.history).to.eql([4,3,0])
})
```

Let's grab that board again. We'll grab the center, middle left, and top left squares&mdash;that's squares 4, 3, and 0, in that order. Then we'll use `Simulate` to click on them and we'll check that our history records the correct moves in the correct order. This tests our system from the Squares through the `handleClick` methods and back to the Game's `setState` method. Nice.

But how do we know it's not playing all those moves as the same player? Or screwing up the order? Let's check that it's alternating players:

```js
// in test/tests.js
it("can alternate moves, X first", () => {
  let board = scryRenderedDOMComponentsWithClass(game, 'board')[0]

  let center = board.childNodes[4]
  let midLeft = board.childNodes[3]
  let topLeft = board.childNodes[0]

  Simulate.click(center)
  Simulate.click(midLeft)
  Simulate.click(topLeft)

  expect(center.innerHTML).to.equal('x')
  expect(midLeft.innerHTML).to.equal('o')
  expect(topLeft.innerHTML).to.equal('x')
})
```

Finally (for the Game), let's check if it recognizes a win and prevents further moves after the win:

```js
// in test/tests.js
it("recognizes a win", () => {
  const moves = [4, 3, 0, 8, 2, 1, 6] // win

  forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

  expect(scryRenderedDOMComponentsWithClass(game, 'board won').length).to.equal(1)
})

it("prevents further play after a win", () => {
  const lastSquare = board.childNodes[7]
  const moves = [4, 3, 0, 8, 2, 1, 6] // win

  forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

  Simulate.click(lastSquare)

  expect(lastSquare.innerHTML).to.be.empty
})
```

After playing a known win out, we check that the board is marked "won". Then we try to move again in a remaining empty square, and check that the square remains uplayed.

Finally, we test our Square component:

```js
// in test/tests.js
describe("Square", () => {
  let square
  const player = 'x'

  describe("when empty", () => {
    before(() => {
      square = renderIntoDocument(<Square/>)
    })

    it("is a composite component", () => {
      expect(isCompositeComponent(square)).to.equal(true)
    })

    it("calls a callback when clicked", () => {
      const cb = (event) => console.log("Clickeroonie!")
      square = renderIntoDocument(<Square clickCb={cb}/>)

      Simulate.click(square)
    })
  })

  describe("after play", () => {
    beforeEach(() => {
      square = renderIntoDocument(<Square player={player}/>)
    })

    it("has the correct content", () => {
      const div = scryRenderedDOMComponentsWithTag(square, 'div')[0]

      expect(div && div.innerHTML).to.equal(player)
    })

    it("applies the player's style", () => {
      expect(scryRenderedDOMComponentsWithClass(square, 'x')).not.to.be.empty
    })
  })
})
```

We test that an empty square calls the callback when clicked (maybe superfluous as all the clicks on the Game board have already thoroughly tested this). Then we take a played square and make sure that it put that player's mark in the div's innerHTML, and that it also used it as a class to apply the player's style.

And we're good to go.




# OK, ready for the new stuff?

Let's clean things up a bit. For some of our changes, we're going to take advantage of some ES7 goodness. That's JavaScript 2016, we hope. We like to be out there on the bleeding edge.

In the `config.js` file, make the `babelOptions` look like this:

```js
// in config.js
babelOptions: {
  "optional": [
    "runtime",
    "optimisation.modules.system",
    "es7.classProperties",
  ]
},
```

Now let's get started.

## `propTypes` and `defaultProps`

The first thing we can do is spiff up our components and make them a bit more robust by declaring the types of our props and setting default values for them. We do this with `propTypes` and `defaultProps`. Go figure.

With the new JavaScript 2015 syntax, these are nothing more than properties of the components `constructor`, so we can set them right on the component, e.g.:

```jsx
Square.propTypes = { win: React.PropTypes.bool }
Square.defaultProps = { win: false }
```

The available PropTypes include `string`, `number`, `object`, `func`, `bool`, and `any`. And many more. You can see a full list here: [PropTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation). They can also be optional or required (default is to optional).

Right now we're using a double-bang to convert an undefined into a false value for `this.props.win`. If we set the default to false, we wouldn't need that hack.

We're using the player to determine if the square has been played. Maybe this isn't the best method&mdash;relying on dynamic types and "truthiness"&mdash;but we'll leave it for now. As the value could be a string or a boolean, then, we'd have to choose `any`. Hmm. Hard choice.

This:

```js
// in app/components.square.jsx
Square.propTypes = {
  win: React.PropTypes.bool,
  player: React.PropTypes.any,
  clickCb: React.PropTypes.func
}

Square.defaultProps = {
  win: false,
  player: false
}
```

Or this?

```js
// in app/components.square.jsx
Square.propTypes = {
  win: React.PropTypes.bool,
  player: React.PropTypes.string,
  clickCb: React.PropTypes.func
}

Square.defaultProps = {
  win: false
}
```

I think I'm going to go with the latter. I'm more comfortable working with an undefined player and specifying the type as `string` than with going wide open on the type.

Another benefit of this is that we can clearly see what props we're expecting.

We could also require a prop by chaining `isRequired`. We could get away with that on our `win` prop as we're supplying a default value, so it will always be present, but what's the point? It makes more sense to use `isRequired` on props that we can't provide a default for, but which we really need the prop type to be set. So doing this:

```jsx
win: React.PropTypes.bool.isRequired
```

Probably isn't worth it here.

With the latest ES7 (JavaScript 2016?) toys, we can make this even cleaner. Let's use static class properties!

Instead of adding the `propTypes` and `defaultProps` to the `Square` class below the class definition, we'll put them right in the definition like this:

```jsx
// app/components/square.jsx
import React, { Component } from 'react'

class Square extends Component {

  static propTypes = {
    player: React.PropTypes.string,
    win: React.PropTypes.bool,
    clickCb: React.PropTypes.func
  }

  static defaultProps = {
    win: false
  }

  handleClick (event) {
    if (this.props.clickCb) {
      this.props.clickCb()
    }
  }

  render () {
    const winner = this.props.win
    const player = this.props.player

    const status = winner ? `${player} win` : player

    return player ?
      <div className={status}>{player}</div> :
      <div onClick={this.handleClick.bind(this)}/>
  }
}

export default Square
```

Game and App don't take an props (yet), but we can use a similar trick to avoid the `constructor` in Game. We can just set the `state` directly (it changes, so don't make it `static`):

```jsx
// in app/components/game.jsx
class Game extends Component {

  state = { history: [] }

  // more code . . .

}
```

Remember, this *replaces* the constructor that we had before.

## The component lifecycle

React has a component lifecyle that provides "hooks" into the various stages in the life of a React component. These methods are called under various circumstances. Some are called when the component is instantiated and mounted, others are called when the component is updated, and one is called when the component is about to be unmounted.

We can see the ordering of calls to the lifecycle methods (and when they are called) by logging them out to the console. Note that the `shouldComponentUpdate` method is used to determine whether an update is necessary, thus it must return a true or false to decide whether to update or not, respectively.

Let's add these temporarily to our Game component, overwriting the current `constructor` method.

```jsx
// in app/components/game.jsx
constructor (props) {
  super(props)

  this.state = { history: [] }
  console.log("constructor")
}

componentWillMount () {
  console.log("componentWillMount")
}

componentDidMount () {
  console.log("componentDidMount")
}

shouldComponentUpdate () {
  console.log("shouldComponentUpdate")
  return true
}

componentWillUpdate () {
  console.log("componentWillUpdate")
}

componentDidUpdate () {
  console.log("componentDidUpdate")
}
```

This component is not unmounted during our game, so we'll add the `componentWillUnmount` to the Square component instead. And then, to ensure that the Squares do eventually unmount, we'll have the board disappear when the game is won.

In Square, add this method:

```jsx
// in app/components/square.jsx
componentWillUnmount () {
  console.log("componentWillUnmount")
}
```

Then, in Game, we'll comment out the winning board in `renderBoard` and replace it with an empty array:

```jsx
// in app/components/game.jsx
renderBoard (board, wins) {
  const inPlay = isEmpty(wins)

  return mapIndexed((player, idx) => {
    if (inPlay) {
      if (player) {
        return <Square key={idx} player={player}/>
      } else {
        return <Square key={idx} clickCb={this.handleClick.bind(this, idx)}/>
      }
    } else {
      return [] // <Square key={idx} player={player} win={contains(idx, wins)}/>
    }
  }, board)
}
```

Now when we first load the app, we see:

![Lifecycle initialize](./images/lifecycle-initialize.png)

When we make a move, we see the update hooks:

![Lifecycle update](./images/lifecycle-update.png)

And when we finally delete the board upon a win (just temporary!), we see the 9 squares unmounting:

![Lifecycle unmount](./images/lifecycle-unmount.png)

What happens if we return `false` from `shouldComponentUpdate`? Let's try it. We'll change the method in Game:

```jsx
// in app/components/game.jsx
shouldComponentUpdate () {
  console.log("shouldComponentUpdate")
  return false
}
```

Now when we start the game and play a square we see:

![Lifecylce should update false](./images/should-update-false.png)

As you can see, the update doesn't happen. Nice.

React offers a PureRenderMixin that can be used with **pure** components&mdash;components that depend only on their own props and state. Rather than look down through the component tree, the PureRenderMixin saves time by only checking at the top level and the returns false if there's no change.

As we're using the state-of-the-art here, we can do this very easily using the `react-pure-render` module. Let's add it using JSPM:

```sh
jspm i npm:react-pure-render
```

Then we'll import it at the top of our Square component:

```jsx
// in app/components/square.jsx
import shouldPureComponentUpdate from 'react-pure-render/function'
```

Then in the component itself, we'll just replace the `shouldComponentUpdate` method with the plugin's `shouldPureComponentUpdate` method:

```jsx
// in app/components/square.jsx
shouldComponentUpdate = shouldPureComponentUpdate
```

Let's also remove the temporary hooks we added above (don't forget to fix the winning board in `renderBoard`). We'll add hooks back in as we need them.


## REDUX!

OK, time to move our state management out to a Redux store.

First, let's create our store in `app/store.js`:

We'll begin by creating a "reducer" function. This is a function that's going to take the current state of the application and an action, and then return a **new** state after handling the action.

In other words, something like this:

```js
// app/store.js
const history = (state, action) {
  return state
}
```

Right now our reducer just takes a state and returns it. What if the state hasn't been set yet? Maybe we should set a default state:

```js
// app/store.js
const history = (state = [], action) {
  return state
}
```

What does this `action` look like? Well, for Redux, we expect it to be an object with at least one key called `type` that is the type of the action. In our case, the action we expect is a 'MOVE' (the type should be a string).

So let's add a `switch` that will handle a 'MOVE' and return the state unchanged otherwise:


```js
// app/store.js
const history = (state = [], action) {
  switch (action.type) {
    case 'MOVE':
      return state
    default:
      return state
  }
}
```

OK, we need to update that state for the move. Let's assume that our action will also include a field called `square` with the number of the square being played. We'll append this to the array. We could use the Ramda `append` function as we did earlier, but ES7 gives us the spread operator, so let's use that. One thing we **DON'T** want to do is to mutate the state itself (e.g., `state.push(action.square)`&mdash;DON'T DO THIS).

```js
// app/store.js
const history = (state = [], action) {
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
```

This says take the current state array and "spread it out" into individual values. Then we create a new array with those values and the new `action.square` value and return that NEW array as the new state.

Pretty cool, eh?

We also want to be able to reset our state with a 'NEW_GAME' action, so let's add that while we're at it:

```js
// app/store.js
const history = (state = [], action) {
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
```

Easy peasy.

So we have our "reducer" (kind of like the `reduce` method we use earlier, and why that is so will become apparent when we get into combining reducers). Now we want to make it into a Redux store.

So we'll import the Redux `createStore` method (which takes a reducer function as its sole parameter). Then we'll create our store and export it so we can use it in our App.

```js
// app/store.js
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
```

We can now subscribe to the store, passing it a callback, and our callback will be called whenever the store updates.

We want to subscribe to the store at the top level of our application, so that the updates can flow down through the application. We'll add the code to our `main.jsx` function, and we'll simply re-render our app when the store changes. We're keeping it simple here!

We're also going to simplify our app a bit by skipping the App component and rendering the Game directly. We can always add the App component back in later.

```jsx
// in app/main.jsx
import React from 'react'
import ReactDOM from 'react-dom'

import store from './store.js'
import Game from './components/game.jsx!'
```

I'm going to rename the `main` function to `render` to make it clearer. I'm also going to add my div permanently to the `index.html` file so that I can further simplify my render method. If I'm going to rerender every time, why keep regenerating the app div? So change `index.html` like this:

```html
<!-- in index.html -->
<body>
  <div id="app"/>
</body>
```

Now we can make the `render` function drop-dead simple:

```jsx
// in app/main.jsx
const render = () => {
  ReactDOM.render(
    <Game history={store.getState()} store={store} />,
    document.getElementById('app')
  )
}
```

Notice that we're passing both the `history` state and the `store` to the Game component as props. This is nice and pure. Game will use the `this.props.history` instead of `this.state.history`, moving state out of the game and into the store. And we pass the store down so that Game (actually, Square) can `dispatch` moves right to the store.

This creates a nice one way flow of state through the app:

main (get history state, pass to game) ->
game (use history to create squares) ->
square (receive store, click calls dispatch with move action) ->
store (updates, sends updated history to main) ->
main (get history state, pass to game) ->
etc.

Round and round. Nicely *react*ive.

Finally, we just need to subscribe to our store, calling the `render` method when the store changes, and then, as before with `main`, we need to call it once to initialize the application. Here's the complete file now:

```jsx
// app/main.jsx
import React from 'react'
import ReactDOM from 'react-dom'

import store from './store.js'
import Game from './components/game.jsx!'

const render = () => {
  ReactDOM.render(
    <Game history={store.getState()} store={store} />,
    document.getElementById('app')
  )
}

store.subscribe(render)

render()
```

Now we'll need to update our Game. First, let's delete the `app.jsx` file.

In `game.jsx`, let's import the `shouldPureComponentUpdate` function

```jsx
// in app/components.game.jsx
import shouldPureComponentUpdate from 'react-pure-render/function'
```

Then we'll replace the `state = { history: [] }` with our new default types and we'll reassign `shouldComponentUpdate`:

```jsx
// in app/components.game.jsx
static propTypes = {
  history: React.PropTypes.array.isRequired,
  store: React.PropTypes.object.isRequired
}

shouldComponentUpdate = shouldPureComponentUpdate
```

Next, we'll update our `render` method to use the `this.props.history` instead of `this.state.history`, while cleaning it up a wee bit:

```jsx
// in app/components.game.jsx
render () {
  const board  = this.getBoard(this.props.history)
  const wins   = flatten(this.checkForWin(board))
  const status = isEmpty(wins) ? 'board' : 'board won'

  return <div className={status}>
    {this.renderBoard(board, wins)}
  </div>
}
```

Finally, let's take advantage of React's "spread props" (now that we're experts on the spread) to clean up `renderBoard`:

```jsx
// in app/components.game.jsx
renderBoard (board, wins) {
  const inPlay = isEmpty(wins)
  const { store } = this.props

  return mapIndexed((player, idx) => {
    const props = { key: idx, square: idx, store: store }
    const win = contains(idx, wins)
    const mark = player || ''

    if (inPlay) {
      return player ?
        <Square {...props} mark={mark} /> :
        <Square {...props} />
    } else {
      return <Square {...props} mark={mark} win={win} />
    }
  }, board)
}
```

Whoa! What's going on here? We're no longer passing our `clickCb` method. Instead, we're passing the store down to the squares. Now the squares can dispatch actions all on their own. Remember our one-way path? This is cleaner than passing things up and down. Everything goes *down*, nothing goes *up*.

We're also eliminating a warning we got by using `player` both for true/false and for the player's mark. Now we pass the square a string, which can be 'x', 'o', or just ''.

We're also passing in the number of the square. We no longer have the bound `clickCb` callback, so the square will need to pass this number to the store on dispatch. Because the `key`, `square`, and `store` props are sent every time, it's easiest to combine them into an object, and then use React's "spread properties" (...) operator to insert them into each Square. Then we add mark and/or win (or neither) as appropriate.

Oh, and we're using destructured assignment to grab the `store` from `this.props`. Almost not worth it here, but when there are several props, definitely a space saver.

We should also remember to *delete the now-unused `clickCb` method*. Here's our current Game component, cleaning up the PropTypes.

```jsx
// app/components.game.jsx
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
    const board  = this.getBoard(this.props.history)
    const wins   = flatten(this.checkForWin(board))
    const status = isEmpty(wins) ? 'board' : 'board won'

    return <div className={status}>
      {this.renderBoard(board, wins)}
    </div>
  }

  renderBoard (board, wins) {
    const inPlay = isEmpty(wins)
    const { store } = this.props

    return mapIndexed((player, idx) => {
      const props = { key: idx, square: idx, store: store }
      const win = contains(idx, wins)
      const mark = player || ''

      if (inPlay) {
        return player ?
          <Square {...props} mark={mark} /> :
          <Square {...props} />
      } else {
        return <Square {...props} mark={mark} win={win} />
      }
    }, board)
  }
}

export default Game
```

Now let's update our Square to call the store's `dispatch` method with a MOVE action.

First, we'll update our props:

```jsx
// in app/components/square.jsx
static propTypes = {
  store: React.PropTypes.object.isRequired,
  square: React.PropTypes.number.isRequired,
  mark: React.PropTypes.string,
  win: React.PropTypes.bool,
}

static defaultProps = { win: false }
```

We're always going to need access to the store to dispatch our move, and we'll need to know what square we are for that. We've updated `player` to be `mark`, which is more appropriate as it's always a string now. And we have a boolean `win` to set whether this is one of the winning squares, not that there's any money or fame involved or anything.

Our `handleClick` method is the next to change. Instead of calling the passed-in `clickCb` method from Game, we're now going to create a MOVE action and pass it to the store's `dispatch` method:

```jsx
// in app/components/square.jsx
handleClick () {
  this.props.store.dispatch({
    type: 'MOVE',
    square: this.props.square
  })
}
```

Now we see what a Redux action looks like. The one required key is the `type`, which should be a string (uppercase seems to be best practice). We're also including the number of the Square so it can be appended to the moves history.

Finally, we need to handle changes to the `render` method. Here is the full, updated Square component. We'll clean up the PropTypes while we're at it.

```jsx
// app/components/square.jsx
import React, { Component, PropTypes } from 'react'

import shouldPureComponentUpdate from 'react-pure-render/function'

class Square extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    square: PropTypes.number.isRequired,
    mark: PropTypes.string,
    win: PropTypes.bool,
  }

  static defaultProps = { win: false }

  shouldComponentUpdate = shouldPureComponentUpdate

  handleClick () {
    this.props.store.dispatch({
      type: 'MOVE',
      square: this.props.square
    })
  }

  render () {
    const { win, mark } = this.props

    const status = win ? `${mark} win` : mark

    return !!mark ?
      <div className={status}>{mark}</div> :
      <div onClick={this.handleClick.bind(this)}/>
  }
}

export default Square
```

OK, then.

## What happened to our tests?

Well, um, they're broken. Let's fix them.

First, we no longer have an `app.jsx` file and we now have a `store.js` file, so let's fix our imports:

```js
// in test/tests.js
import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { expect } from 'chai'
import { forEach } from 'ramda'

import Game from '../app/components/game.jsx!'
import Square from '../app/components/square.jsx!'

import store from '../app/store.js'
```

And we can simply delete the App's `describe` block.

For the Game block, we'll need to rethink our `beforeEach` method. Set up will be quite different. We need to add our store, pass it into the game along with the state, and subscribe to the store for re-rendering. And we'll need to set our state back to the default each time. How convenient our currently unused 'NEW_GAME' action.

```js
// in test/tests.js
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

  // more code . . .
})
```

Basically, we're just recreating our `main.jsx` file here, but rendering it into the Document instead.

Our first three Game specs look the same, except that history is now a prop rather than state:

```js
// in test/tests.js
it("is a composite component", () => {
  expect(isCompositeComponent(game)).to.equal(true)
})

it("has one board", () => {
  expect(scryRenderedDOMComponentsWithClass(game, 'board').length).to.equal(1)
})

it("begins with an empty history", () => {
  expect(game.props.history).to.eql([])   // props!!
})
```

The board section is almost the same. The biggest difference is that the board is being re-rendered, so we need to grab it from the document again before we check our squares. To simplify things, we've also eliminated a few variables.

```js
// in test/tests.js
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

    // Board was rerendered!
    board = scryRenderedDOMComponentsWithClass(game, 'board')[0]

    expect(board.childNodes[4].innerHTML).to.equal('x')
  })

  it("tracks moves in game history", () => {
    Simulate.click(board.childNodes[4])
    Simulate.click(board.childNodes[3])
    Simulate.click(board.childNodes[0])

    // history is in props now!
    expect(game.props.history).to.eql([4,3,0])
  })

  it("can alternate moves, X first", () => {
    Simulate.click(board.childNodes[4])
    Simulate.click(board.childNodes[3])
    Simulate.click(board.childNodes[0])

    // Board was rerendered!
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
```

Last but not least&mdash;OK, maybe least&mdash;let's add the correct props to our Squares in the Squares block:

```js
// in test/tests.js
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
```

## Multiple games?

What if we want to track games? We could implement a new game button and push the games into the store.

Let's start by extending our store:

What we want is a `game` reducer that calls our `history` reducer with the correct game.

We'll keep our state simple for the moment: It will simply be an array of arrays with current game at the *head* of the array. That way we can grab it with `[0]`.

So our initial state will be an array with a single game array in it: `[[]]`.

Here's the start of our `game` reducer:

```js
// in app/store.js
const game = (state = [[]], action) => {
  return state
}
```

OK, we know we want to handle two actions at least: 'NEW_GAME' and 'MOVE'. So let's add the switch:

```js
// in app/store.js
const game = (state = [[]], action) => {
  switch (action.type) {
    case 'NEW_GAME':
      return state
    case 'MOVE':
      return state
    default:
      return state
  }
}
```

Well, so far it doesn't do much. Bad reducer! Bad!

Before we extend it further let's take a look at our `history` reducer and see how it needs to change. Here it is in its present form:

```js
// in app/store.js
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
```

Well, we don't need the NEW_GAME action anymore, but otherwise it looks about right. It will be working with that inner array, so nothing to change there:

```js
// in app/store.js
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
```

Now we need to call it from our new reducer:

```js
// in app/store.js
const game = (state = [[]], action) => {
  switch (action.type) {
    case 'NEW_GAME':
      return state
    case 'MOVE':
      return [
        history(state[0], action),
        ...state.slice(1)
      ]
    default:
      return state
  }
}
```

We'll call the `history` reducer and pass it the array at the *start* of our state array (the head). That's our current game. We'll pass along the action.

Then we'll create a new array with the history array returned from our call to `history` in the first index, and the rest of the state array of games following. We use `slice(1)`, but we could have used Ramda's `tail` function as well.

Finally, we need to implment the NEW_GAME functionality. All it needs to do is insert a new game. We could insert a `[]`, but we should let our `history` reducer do its job. Here's our new store:

```js
// app/store.js
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
```

Now the only remaining change we need to make is to grab that first array from the state instead of the whole state.

We can do this in `main.jsx`:

```jsx
// in app/main.jsx
const render = () => {
  ReactDOM.render(
    <Game history={store.getState()[0]} store={store} />,
    document.getElementById('app')
  )
}
```

And we'll do it in our tests, too:

```js
// in test/tests.js
render = () => {
  game =
    renderIntoDocument(<Game history={store.getState()[0]} store={store}/>)
}
```

Finally, let's add a button to our Game to reset the game. We'll check out inline styles while we're at it:

```jsx
// in app/components/game.jsx
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
  margin: '5px auto',
  padding: '6px 12px',
  textAlign: 'center',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
}
```

And then the button:

```jsx
// in app/components/game.jsx
return <div style={{textAlign: 'center'}}>
  <div className={status}>
    {this.renderBoard(board, wins)}
  </div>
  <button
    style={buttonStyle}
    onClick={() => store.dispatch({ type: 'NEW_GAME' })}>
    New Game
  </button>
</div>
```

One drawback to inline styles is that pseudoclasses are difficult. We'll cheat, and just add our hover state to the CSS:

```css
/* in styles/main.css */
button:hover {
  background-color: #c9302c !important;
  border-color: #ac2925 !important;
}
```

We need the !important to override inline styles.

And that should work!


