import React from "react";
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import cls   from "./App.css";
import uuid from "node-uuid";
import Overlay from "app/components/Overlay/Overlay";

class App extends React.Component {
  constructor(props) {
    super(props);

    setTimeout(() => {
      this.handlePing(this.state.others[0])
    }, 10000);

    this.state = {
      me: {
        id: uuid.v4(),
        sex: "male",
        position: {
          lat: 51.085845,
          lng: 17.009627,
        }
      },
      map: {
        zoom: 16,
        center: {
          lat: 51.085845,
          lng: 17.009627,
        }
      },
      party: null,
      place: null,
      overlay: {
        step: "selectSex"
      },
      others: [
        {
          id: uuid.v4(),
          sex: "female",
          position: {
            lat: 51.084812,
            lng: 17.013667,
          }
        },
        {
          id: uuid.v4(),
          sex: "male",
          position: {
            lat: 51.087775,
            lng: 17.013924,
          }
        },
        {
          id: uuid.v4(),
          sex: "male",
          position: {
            lat: 51.087406,
            lng: 17.007773,
          }
        },
      ]
    };
  }

  pingUser(person) {
    console.log("I've pinged someone");
  }

  handlePing(person) {
    console.log("Someone has pinged");

    this.setState({
      party: person,
      map: { ...this.state.map, center: person.position, zoom: 18 }
    });
    this.chooseStep("handlePing");
  }

  acceptPing() {
    console.log("I've accepted ping", this.state.party);
    this.closeOverlay();
    this.handlePlace({
      position: {
        lat: 51.085037,
        lng: 17.010703
      }
    });
  }

  rejectPing() {
    console.log("I've rejected ping");
    this.closeOverlay();
  }

  selectSex(sex) {
    console.log("I've choosed a sex:", sex);
    this.setState({ me: { ...this.state.me, sex } });
    this.chooseStep("selectTag");
  }

  selectTag(tag) {
    console.log("I've choosed a tag:", tag);
    this.setState({ me: { ...this.state.me, tag } });
    // load people with matching tag
    this.closeOverlay();
  }

  handlePlace(place) {
    console.log("Place has been choosed", place);
    this.setState({
      place,
      others: [],
      map: { ...this.state.map, center: place.position, zoom: 20 }
    });
  }

  chooseStep(step) {
    this.setState({overlay: { ...this.state.overlay, step }});
  }

  closeOverlay() {
    this.setState({ overlay: { ...this.state.overlay, step: null } });
  }

  render() {
    return (
      <div className={ cls.app }>
        <Overlay
          step={ this.state.overlay.step }
          selectSex={ ::this.selectSex }
          selectTag={ ::this.selectTag }
          acceptPing={ ::this.acceptPing }
          rejectPing={ ::this.rejectPing }
        />
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: `100%`,
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              zoom={ this.state.map.zoom }
              center={ this.state.map.center }
            >
              {
                this.state.others.map(attrs => <Marker
                  key={ attrs.id }
                  position={ attrs.position }
                  onClick={ () => this.pingUser(attrs) }
                />)
              }
              { this.state.me ? <Marker position={ this.state.me.position } /> : null }
              { this.state.place ? <Marker position={ this.state.place.position } /> : null }
              { this.state.party ? <Marker position={ this.state.party.position } /> : null }
            </GoogleMap>
          }
        />
      </div>
    );
  }
}

export default App;
