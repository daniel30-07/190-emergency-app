/* eslint-disable no-sparse-arrays */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native'
import MapView, { Polyline, Marker } from 'react-native-maps';
import BottomButton from '../components/BottomButton';
import { io } from 'socket.io-client'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { socketIoURL } from '../baseUrl'
export default class Police extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookingForUsers: false,
      buttonText: 'VIATURA DISPONÍVEL 🚓'
    };
    this.lookForUsers = this.lookForUsers.bind(this);
    this.acceptUserRequest = this.acceptUserRequest.bind(this);
    this.socket = null;
  }

  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel'
                },
                ,
              ]
            ),
          1000
        );
      }
    });
  }

  async lookForUsers() {
    if (this.state.lookingForUsers) {
      this.setState({
        lookingForUsers: false
      });
      return;
    }

    this.setState({
      lookingForUsers: true,
      buttonText: 'AGUARDANDO OCORRÊNCIA'
    });

    this.socket = io(socketIoURL);

    this.socket.on('connect', () => {
      this.socket.emit('lookingForUsers');
    });

    this.socket.on('policeRequest', async (routeResponse) => {
      await this.props.getRouteDirections(
        routeResponse.geocoded_waypoints[0].place_id
      );
      this.map.fitToCoordinates(this.props.pointCoords, {
        edgePadding: { top: 20, bottom: 20, left: 80, right: 80 }
      });
      this.setState({
        buttonText: 'OCORRÊNCIA NA TELA, APERTE PARA ACEITAR',
        lookingForUsers: false,
        userFound: true,
      });
    });
  }

  acceptUserRequest() {
    const userLocation = this.props.pointCoords[
      this.props.pointCoords.length - 1
    ];
    // this.setState({
    //   lookingForUsers: false,
    // });
    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning
      )
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled
      )
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        console.log('start', status.isRunning);
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    BackgroundGeolocation.on('location', (location) => {
      //Send driver location to user socket io backend
      this.socket.emit('policeLocation', {
        latitude: location.latitude,
        longitude: location.longitude
      });
    });

    if (Platform.OS === 'ios') {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${userLocation.latitude},${userLocation.longitude}`
      );
    } else {
      Linking.openURL(
        `geo:0,0?q=${userLocation.latitude},${userLocation.longitude}(user)`
      );
    }
  }

  render() {
    let endMarker = null;
    let startMarker = null;
    let findingUserActIndicator = null;
    let bottomButtonFunction = this.lookForUsers;

    if (this.props.latitude === null) {
      return null;
    }

    if (this.state.lookingForUsers) {
      findingUserActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForUsers}
          color="white"
        />
      );
    }

    if (this.state.userFound) {
      //userSearchText = 'FOUND User! PRESS TO ACCEPT RIDE?';
      bottomButtonFunction = this.acceptUserRequest;
    }

    if (this.props.pointCoords.length > 1) {
      endMarker = (
        <Marker
          coordinate={
            this.props.pointCoords[this.props.pointCoords.length - 1]
          }>
          <Image
            style={{ width: 40, height: 40 }}
            source={require('../images/target.png')}
          />
        </Marker>
      );
    }

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
            longitudeDelta: 0.0121
          }}
          showsUserLocation={true}>
          <Polyline
            coordinates={this.props.pointCoords}
            strokeWidth={2}
            strokeColor="red"
          />
          {endMarker}
          {startMarker}
        </MapView>

        <BottomButton
          onPressFunction={bottomButtonFunction}
          buttonText={this.state.buttonText}>
          {findingUserActIndicator}
        </BottomButton>
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
    alignSelf: 'center'
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20
  },
  suggestions: {
    backgroundColor: 'white',
    fontSize: 14,
    padding: 5,
    borderWidth: 0.5,
    marginRight: 20,
    marginLeft: 20
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    padding: 5,
    backgroundColor: 'white'
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  }
});
