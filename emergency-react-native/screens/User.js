import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import apiKey from '../google_api_key';
import { io } from 'socket.io-client';
import BottomButton from '../components/BottomButton';
import { baseURL, socketIoURL } from '../baseUrl';
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookingForPolice: false,
      buttonText: 'ACIONAR 🚔',
      policeIsOnTheWay: false,
      predictions: [],
    };
  }

  async onChangeDestination(destination) {
    //call places API
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&key=${apiKey}&location=${this.props.latitude}, ${this.props.longitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
      });
    } catch (err) {
      console.log('L', err);
    }
  }

  async resquestPolice() {
    this.setState({ lookingForPolice: true });

    const socket = io(socketIoURL);

    socket.on('connect', () => {
      //Request a police!
      socket.emit('policeRequest', this.props.routeResponse);
    });

    socket.on('policeLocation', (policeLocation) => {
      const pointCoords = [...this.props.pointCoords, policeLocation];
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 40, bottom: 20, left: 20, right: 20 },
      });
      //this.getRouteDirections(routeResponse.geocoded_waypoints[0].place_id);
      this.setState({
        buttonText: 'POLICIAL A CAMINHO! AGUARDE...',
        lookingForPolice: false,
        policeIsOnTheWay: true,
        policeLocation,
      });
    });
  }

  render() {
    let marker = null;
    let getPolice = null;
    let findingPoliceActIndicator = null;
    let policeMarker = null;

    if (this.props.latitude === null) {
      return null;
    }

    if (this.state.policeIsOnTheWay) {
      policeMarker = (
        <Marker coordinate={this.state.policeLocation}>
          <Image
            source={require('../images/police-car.png')}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      );
    }

    if (this.state.lookingForPolice) {
      findingPoliceActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForPolice}
          color="white"
        />
      );
    }

    if (this.props.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]}
        />
      );
      getPolice = (
        <BottomButton
          onPressFunction={() => this.resquestPolice()}
          buttonText={this.state.buttonText}>
          {findingPoliceActIndicator}
        </BottomButton>
      );
    }
    const predictions = this.state.predictions.map((prediction) => (
      <TouchableHighlight
        onPress={async () => {
          const destinationName = await this.props.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text,
          );
          this.setState({ predictions: [], destination: destinationName });
          this.map.fitToCoordinates(this.props.pointCoords, {
            edgePadding: { top: 20, bottom: 20, left: 80, right: 80 },
          });
        }}
        key={prediction.place_id}>
        <View>
          <Text style={styles.suggestions}>
            {prediction.structured_formatting.main_text}
          </Text>
        </View>
      </TouchableHighlight>
    ));

    return (
      <View style={styles.mapStyle}>
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          style={styles.mapStyle}
          initialRegion={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}>
          <Polyline
            coordinates={this.props.pointCoords}
            strokeWidth={2}
            strokeColor="red"
          />
          {marker}
          {policeMarker}
        </MapView>

        <TextInput
          placeholder="Confirme seu endereço"
          style={styles.destinationInput}
          value={this.state.destination}
          clearButtonMode="always"
          onChangeText={(destination) => {
            this.props.destination = destination;
            //this.setState({destination});
            this.onChangeDestination(destination);
          }}
        />
        {predictions}
        {getPolice}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: 'black',
    padding: 20,
    paddingRight: 40,
    paddingLeft: 40,
    marginTop: 'auto',
    margin: 20,
    alignSelf: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20,
  },
  suggestions: {
    backgroundColor: 'white',
    fontSize: 14,
    padding: 5,
    borderWidth: 0.5,
    marginRight: 20,
    marginLeft: 20,
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    padding: 5,
    backgroundColor: 'white',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});
