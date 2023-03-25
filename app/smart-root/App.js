import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import {StatusBar} from 'expo-status-bar';
import {useState, useEffect} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Footer from './components/Footer';
import GoogleMapViewer from './components/GoogleMapViewer';
import {LOG} from './config';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  const [showFooter, setShowFooter] = useState(true);
  const [userLocation, setUserLocation] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [rootResult, setRootResult] = useState();
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('km');

  useEffect(() => {
    (async () => {
      LOG.debug('---smart root env---');
      LOG.debug(process.env);
      LOG.debug('---env end---');
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setUserLocation(null);
        return;
      }
    })();
  }, []);

  const onReset = () => {
    Keyboard.dismiss();
    setShowFooter(true);
  };

  const disableFooter = () => {
    setShowFooter(false);
  };

  const onRefreshPress = () => {
    LOG.info('onRefreshPress');
    let count = 6;
    const lanLonList = [];
    LOG.debug(`inputVal: ${text}`);
    LOG.debug(`inputUnit: ${unit}`);
    LOG.debug(userLocation);
    let num = parseInt(text);
    if (isNaN(num)) {
      LOG.warn(`failed to parse ${text}`);
      num = 1;
    }
    num = num/7;
    let maxDistance = 0;
    if (unit == 'km' || unit == 'm') {
      if (unit == 'km') {
        maxDistance = num * 1000;
      }
    } else {
      let time = num;
      if (unit == 'hours') {
        time = num * 60;
      }
      maxDistance = time * 80;
    }
    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    const maxDistanceDegrees = maxDistance / 111319;
    for (let i = 0; i < count; i++) {
      const r = maxDistanceDegrees * Math.sqrt(Math.random());
      const theta = Math.random() * 2.0 * Math.PI;
      const lat = userLocation.latitude + (r * Math.cos(theta));
      const lng = userLocation.longitude + (r * Math.sin(theta));
      lanLonList.push({latitude: lat, longitude: lng});
    }
    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    count += 2;
    if (lanLonList.length == 8) {
      setCoordinates(lanLonList);
      setShowRoute(true);
    }
  };

  const onSavePress = () => {
    LOG.info('onSavePress');
    if (null != rootResult) {
      LOG.info(`Distance: ${rootResult.distance} km`);
      LOG.info(`Duration: ${rootResult.duration} min.`);
    }
  };

  const onSettingsPress = () => {
  };

  const onOpenMapPress = () => {
    LOG.info('onOpenMapPress');
    if (null != rootResult) {
      LOG.debug(coordinates);
      LOG.info(`Distance: ${rootResult.distance} km`);
      LOG.info(`Duration: ${rootResult.duration} min.`);
      if (coordinates.length >= 2) {
        let url = `https://www.google.com/maps/dir/?api=1`;
        url += `&origin=${coordinates[0].latitude}`;
        url += `%2C${coordinates[0].longitude}`;
        let waypoints='';
        for (let i = 0; i < rootResult.waypointOrder[0].length; i++) {
          waypoints += `${coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].latitude}`;
          waypoints += `%2C${ coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].longitude}|`;
        }
        waypoints=waypoints.substring(0, waypoints.length-1);
        url += `&waypoints=${waypoints}`;
        url += `&destination=${coordinates[coordinates.length-1].latitude}`;
        url += `%2C${coordinates[coordinates.length-1].longitude}`;
        LOG.debug(url);
        Linking.openURL(url);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onReset}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mapContainer}>
          <GoogleMapViewer
            inputVal={text}
            setInputVal={setText}
            inputUnit={unit}
            setInputUnit={setUnit}
            coordinates={coordinates}
            setUserLocation={setUserLocation}
            setRootResult={setRootResult}
            onInputFocus={disableFooter}
            onInputEndEdit={onReset}
          />
        </View>
        {showFooter ? (
          <View style={styles.footerContainer}>
            <Footer
              isRouteShown={showRoute}
              onRefreshPress={onRefreshPress}
              onSavePress={onSavePress}
              onSettingsPress={onSettingsPress}
              onOpenMapPress={onOpenMapPress}
            />
          </View>
        ) : (
          <View/>
        )}
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  mapContainer: {
    flex: 9,
    width: Dimensions.get('window').width,
    backgroundColor: '#FAA030',
  },
  footerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#32B76C',
  },
});
