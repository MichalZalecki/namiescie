import React from "react";

class Overlay extends React.Component {
  static propTypes = {
    step: React.PropTypes.string,
    acceptPing: React.PropTypes.func.isRequired,
    rejectPing: React.PropTypes.func.isRequired,
  };

  render() {
    switch(this.props.step) {
      case "handlePing":
        return (
          <div>
            <button onClick={ this.props.acceptPing }>Tak</button>
            <button onClick={ this.props.rejectPing }>Nie</button>
          </div>
        )
        break;
      default:
        return null;
    }
  }
}

export default Overlay;
