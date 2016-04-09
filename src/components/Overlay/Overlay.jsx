import React from "react";

class Overlay extends React.Component {
  static propTypes = {
    step: React.PropTypes.string,
    selectSex: React.PropTypes.func.isRequired,
    selectTag: React.PropTypes.func.isRequired,
    acceptPing: React.PropTypes.func.isRequired,
    rejectPing: React.PropTypes.func.isRequired,
  };

  render() {
    switch(this.props.step) {
      case "selectSex":
        return (
          <div>
            <button onClick={ () => this.props.selectSex("male") }>Male</button>
            <button onClick={ () => this.props.selectSex("female") }>Female</button>
          </div>
        );
      case "selectTag":
        return (
          <div>
            <ul>
              <li><button onClick={ () => this.props.selectTag("piwo") }>#piwo</button></li>
              <li><button onClick={ () => this.props.selectTag("kino") }>#kino</button></li>
              <li><button onClick={ () => this.props.selectTag("muzyka") }>#muzyka</button></li>
              <li><button onClick={ () => this.props.selectTag("cafe") }>#cafe</button></li>
              <li><button onClick={ () => this.props.selectTag("party") }>#party</button></li>
              <li><button onClick={ () => this.props.selectTag("spacer") }>#spacer</button></li>
            </ul>
          </div>
        );
      case "handlePing":
        return (
          <div>
            <button onClick={ this.props.acceptPing }>Tak</button>
            <button onClick={ this.props.rejectPing }>Nie</button>
          </div>
        );
      default:
        return null;
    }
  }
}

export default Overlay;
