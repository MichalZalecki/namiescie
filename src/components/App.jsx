import React from "react";
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import cls   from "./App.css";
import uuid from "node-uuid";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      me: {
        id: uuid.v4(),
        sex: "male",
        position: {
          lat: 51.085845,
          lng: 17.009627,
        }
      },
      others: [
        {
          id: uuid.v4(),
          sex: "male",
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
    //
  }

  render() {
    return (
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
            defaultZoom={ 16 }
            defaultCenter={ this.state.me.position }
          >
            <Marker
              position={ this.state.me.position }
            />
            {
              this.state.others.map(attrs => <Marker
                key={ attrs.id }
                position={ attrs.position }
                onClick={ () => this.pingUser(attrs) }
              />)
            }
          </GoogleMap>
        }
      />
    );
  }
}

export default App;
