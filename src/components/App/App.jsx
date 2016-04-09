import React from "react";
import { GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import cls   from "./App.css";
import uuid from "node-uuid";
import Overlay from "app/components/Overlay/Overlay";

class App extends React.Component {
  constructor(props) {
    super(props);

    setTimeout(() => {
      this.handlePing(this.state.others[0]);
    }, 10000);

    this.socket = io("//localhost:3000");
    this.socket.on("people", others => this.setState({ others }));

    this.state = {
      me: {
        id: uuid.v4(),
        sex: "male",
        position: {
          lat: 51.085695,
          lng: 17.008352,
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
      directions: null,
      overlay: {
        step: "start"
      },
      others: []
    };
  }

  start() {
    this.chooseStep("selectSex");
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
    this.closeOverlay();
    this.setState({ me: { ...this.state.me, tag } }, () => {
      this.socket.emit("intro", this.state.me);
    });
  }

  handlePlace(place) {
    console.log("Place has been choosed", place);
    this.setState({
      place,
      others: [],
      map: { ...this.state.map, center: place.position, zoom: 20 }
    });
    this.createDirection(this.state.me.position, place.position)
      .then(directions => this.setState({ directions }));
  }

  chooseStep(step) {
    this.setState({overlay: { ...this.state.overlay, step }});
  }

  closeOverlay() {
    this.setState({ overlay: { ...this.state.overlay, step: null } });
  }

  createDirection(origin, destination) {
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    return new Promise(resolve => {
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          resolve(<DirectionsRenderer defaultDirections={result} />);
        }
      });
    });
  }

  render() {
    return (
      <div className={ cls.app }>
        <Overlay
          step={ this.state.overlay.step }
          start={ ::this.start }
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
              options={{ styles }}
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
              { this.state.directions }
            </GoogleMap>
          }
        />
      </div>
    );
  }
}

export default App;

const styles = [{"stylers":[{"visibility":"on"},{"saturation":-100},{"gamma":0.54}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#4d4946"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"gamma":0.48}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"gamma":7.18}]}]
