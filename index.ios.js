/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var BackgroundGeolocation = require('react-native-background-geolocation');
var {
  AppRegistry,
  StyleSheet,
  Text,
  SwitchIOS,
  View,
} = React;

var RoadPal = React.createClass({
  getInitialState() {
    const self = this;
    var message = '';

    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 50,
      distanceFilter: 50,
      disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
      locationUpdateInterval: 1000,
      minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
      fastestLocationUpdateInterval: 1000,
      activityRecognitionInterval: 2000,
      stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
      stopTimeout: 2, // 2 minutes
      activityType: 'AutomotiveNavigation',

      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
      forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
      forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
      stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
      startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

      // HTTP / SQLite config
      /*url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
      headers: {
        "X-FOO": "bar"
      },
      params: {
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }*/
    });

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', function(location) {
      message = '- [js]location: '+ JSON.stringify(location);
      console.log(message);
      var distance = calculateDistance(19.2538294, location.coords.latitude, -99.1140977, location.coords.longitude);
      self.setState({message: message, distance: distance, currentSpeed: location.coords.speed});
    });

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on('error', function(error) {
      var type = error.type;
      var code = error.code;
      alert(type + " Error: " + code);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', function(location) {
        message = '- [js]motionchanged: ' + JSON.stringify(location);
        console.log(message);
        self.setState({message: message});
    });

    BackgroundGeolocation.start(function() {
      message = '- [js] BackgroundGeolocation started successfully';
      console.log(message);
      self.setState({message: message});

      // Fetch current position
      BackgroundGeolocation.getCurrentPosition({timeout: 30}, function(location) {
        message = '- [js] BackgroundGeolocation received current position: ' + JSON.stringify(location);
        console.log(message);
        self.setState({message: message});
      }, function(error) {
        alert("Location error: " + error);
      });
    });
    return {
      message : 'App started'
    }
    // Call #stop to halt all tracking
    // BackgroundGeolocation.stop();
  },
  render: function() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>ROADPAL</Text>
        </View>
        <View style={styles.formFieldContainer}>
          <Text>Alerta de camaras</Text>
          <SwitchIOS/>
        </View>
        <View style={styles.formFieldContainer}>
          <Text>Alerta de limites de velocidad</Text>
          <SwitchIOS/>
        </View>
        <View style={styles.speedContainer}>
          <Text style={styles.speedLabel}>{this.state.currentSpeed} km/h</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.welcome}>
            RoadPal
          </Text>
          <Text style={styles.instructions}>
            {this.state.message}
          </Text>
          <Text style={styles.instructions}>
            Drive better, Drive Saffer{'\n'}
            Distance from Home: {this.state.distance} Km{'\n'}
          </Text>
        </View>
      </View>
    );
  }
});

var calculateDistance = function (lat1, lat2, lon1, lon2){
  var R = 6371; // Radio del planeta tierra en km
    var phi1 = (lat1) * Math.PI / 180;
    var phi2 = (lat2) * Math.PI / 180;
    var deltaphi = (lat2-lat1) * Math.PI / 180;
    var deltalambda = (lon2-lon1) * Math.PI / 180;

    var a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c
    return d;
}

var toRadians = function (number) {
  return number * Math.PI / 180;
}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  toolbar: {
    backgroundColor:'#81c04d',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'
  },
  toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    flex:1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  speedContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 400
  },
  speedLabel: {
    fontSize: 60,
    color:'#81c04d',
    textAlign:'center',
    fontWeight:'bold',
  },
  //form styles
  formFieldContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    margin: 10
    //alignItems: 'left'
  }
});

AppRegistry.registerComponent('RoadPal', () => RoadPal);
