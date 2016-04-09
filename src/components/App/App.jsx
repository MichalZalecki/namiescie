import React from "react";
import { GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer, Size } from "react-google-maps";
import cls   from "./App.css";
import uuid from "node-uuid";
import Overlay from "app/components/Overlay/Overlay";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io("//localhost:3000");
    this.socket.on("people", others => this.setState({ others: others.filter(person => person.id !== this.state.me.id) }));
    this.socket.on("getNotified", person => this.handleGetNotified(person));
    this.socket.on("place", place => this.handlePlace(place));

    this.maleImg = {
      url: require("app/img/male.png"),
      size: new google.maps.Size(255, 255)
    };

    this.femaleImg = {
      url: require("app/img/female.png"),
      size: new google.maps.Size(255, 255)
    };

    this.meImg = {
      url: require("app/img/me.png"),
      size: new google.maps.Size(255, 255)
    };

    this.placeImg = {
      url: require("app/img/place.png"),
      size: new google.maps.Size(255, 255)
    };

    this.state = {
      me: {
        id: uuid.v4(),
        sex: "male",
        position: Math.random() > 0.5 ? {
          lat: 51.085695,
          lng: 17.008352,
        } : {
          lat: 51.082818,
          lng: 17.015146,
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

  notifyUser(person) {
    console.log("I've notified someone", person);
    this.socket.emit("notify", {
      sourceId: this.state.me.id,
      destinationId: person.id,
    });
  }

  handleGetNotified(person) {
    console.log("Someone has notified me", person);

    this.setState({
      party: person,
      map: { ...this.state.map, center: person.position, zoom: 18 }
    });
    this.chooseStep("handleGetNotified");
  }

  acceptNotification() {
    console.log("I've accepted", this.state.party);
    this.closeOverlay();
    this.socket.emit("acceptNotification", {
      sourceId: this.state.me.id,
      destinationId: this.state.party.id,
      accepted: true
    });
  }

  rejectNotification() {
    console.log("I've rejected ping");
    this.closeOverlay();
    this.socket.emit("pong", {
      id: this.state.party.id,
      accepted: false
    });
    // TODO: handle reject
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
      this.socket.emit("intro", { ...this.state.me, topic: this.state.me.tag });
    });
  }

  handlePlace(place) {
    console.log("Place selected!");
    this.setState({
      place,
      others: [],
      map: { ...this.state.map, center: place.position, zoom: 20 }
    });
    this.chooseStep("place", place);
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
          acceptNotification={ ::this.acceptNotification }
          rejectNotification={ ::this.rejectNotification }
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
                  icon={ attrs.sex === "male" ? this.maleImg : this.femaleImg }
                  key={ attrs.id }
                  position={ attrs.position }
                  onClick={ () => this.notifyUser(attrs) }
                />)
              }
              { this.state.me ? <Marker position={ this.state.me.position } icon={ this.meImg } /> : null }
              { this.state.place ? <Marker position={ this.state.place.position } icon={ this.placeImg } /> : null }
              { this.state.party ? <Marker position={ this.state.party.position } icon={ this.state.party.sex === "male" ? this.maleImg : this.femaleImg } /> : null }
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
