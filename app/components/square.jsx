import React, { Component } from 'react'

class Square extends Component {

  handleClick (event) {
    if (this.props.clickCb) {
      this.props.clickCb()
    }
  }

  render () {
    const winner = this.props.win
    const player = this.props.player

    const status = winner ? `${player} win` : player

    return !!player ?
      <div className={status}>{player}</div> :
      <div onClick={this.handleClick.bind(this)}/>
  }
}

Square.propTypes = {
  win: React.PropTypes.bool.isRequired,
  player: React.PropTypes.string,
  clickCb: React.PropTypes.func
}

Square.defaultProps = {
  win: false
}

export default Square
