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
